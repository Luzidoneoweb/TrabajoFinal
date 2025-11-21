# Documentación del archivo `pestanas/js/lectura.js`

## Descripción
El archivo `pestanas/js/lectura.js` es el script principal que controla la funcionalidad de la pestaña de lectura de textos. Se encarga de cargar el contenido de un texto, dividirlo en frases y páginas, renderizarlo en la interfaz, gestionar la paginación, interactuar con el motor de lectura de voz (`MotorLectura`) y las funciones de traducción, y manejar eventos de usuario como el redimensionamiento de la ventana.

## Variables Globales
*   `window.todasLasFrasesOriginales`: Array que almacena todas las frases originales del texto, divididas.
*   `window.todasLasFrasesTraduccion`: Array que almacena las traducciones correspondientes a `todasLasFrasesOriginales`.
*   `window.paginaActual`: Índice de la página actual que se está mostrando (comienza en 0).
*   `window.frasesPorPagina`: Número de frases que caben en una página, calculado dinámicamente.
*   `window.currentTextId`: ID del texto que se está leyendo actualmente.
*   `isPageReadyForReading`: Bandera booleana que indica si la página está completamente cargada y lista para la lectura.
*   `isContentLoading`: Bandera booleana para evitar cargas de contenido duplicadas.

## Funciones Clave

### 1. `window.guardarTextoCompletoTraducido()`
*   **Propósito:** Guarda la traducción completa del contenido del texto en la base de datos.
*   **Funcionamiento:**
    *   Utiliza un mecanismo de *debounce* para evitar múltiples llamadas rápidas.
    *   Verifica si todas las frases originales tienen una traducción correspondiente.
    *   Si todas están traducidas, utiliza `window.construirTextoCompletoTraducido()` (de `traducion_api/lectura-translation-functions.js`) para unir las frases traducidas y luego `window.guardarTraduccionCompletaEnBD()` para persistir el texto completo traducido.

### 2. `mostrarPagina(numeroPagina)` (función local, expuesta globalmente por `window.mostrarPagina`)
*   **Propósito:** Renderiza las frases correspondientes a la `numeroPagina` especificada en la interfaz.
*   **Funcionamiento:**
    *   Limpia el contenido de `.zona-frases` y crea un nuevo contenedor `.page.active`.
    *   Calcula los índices de inicio y fin de las frases a mostrar para la página actual.
    *   Itera sobre las frases originales de la página:
        *   Crea un `div.frase.frase-original` para cada frase.
        *   Divide la frase en palabras y envuelve cada palabra en un `span.clickable-word` para permitir la interacción.
        *   Crea un `div.frase-traduccion-original` vacío debajo de cada frase original, que se llenará dinámicamente con la traducción cuando se lea esa frase.
    *   Llama a `actualizarEstadoPaginacion()` para actualizar los números de página y el estado de los botones.
    *   Inicializa `window.initializeMultiWordSelector()` o `window.MultiWordSelector` después de un breve retraso para permitir que el DOM se estabilice.

### 3. `calcularFrasesPorPagina()` (función local)
*   **Propósito:** Calcula dinámicamente cuántas frases pueden caber en la altura disponible de la pantalla.
*   **Funcionamiento:**
    *   Calcula la altura disponible restando la altura del encabezado y los controles de la altura del contenedor de lectura.
    *   Crea un elemento temporal con la estructura de una frase completa para medir su altura real (incluyendo márgenes y padding).
    *   Divide la altura disponible por la altura de una frase para determinar cuántas frases caben.
    *   Asegura que al menos una frase siempre se muestre por página.

### 4. `actualizarEstadoPaginacion()` (función local)
*   **Propósito:** Actualiza el contador de páginas (`X / Y`) y habilita/deshabilita los botones de paginación.
*   **Funcionamiento:**
    *   Recalcula `totalPaginas` basándose en `todasLasFrasesOriginales.length` y `frasesPorPagina`.
    *   Actualiza el texto del elemento `.estado-pagina`.
    *   Habilita o deshabilita los botones `.btn-anterior` y `.btn-siguiente` según si se está en la primera o última página.

### 5. `cargarContenidoLectura()` (función local)
*   **Propósito:** Carga el contenido completo del texto seleccionado desde el servidor.
*   **Funcionamiento:**
    *   Establece `isContentLoading` a `true` y `isPageReadyForReading` a `false`.
    *   Muestra el mensaje de carga (`window.showLoadingMessage()`) y deshabilita el botón de reproducción.
    *   Obtiene el `textId` de `localStorage` (o usa un valor por defecto para pruebas).
    *   Llama a `window.cargarCacheTraducciones()` (de `traducion_api/lectura-translation-functions.js`) para precargar las traducciones.
    *   Realiza una petición `fetch` a `pestanas/php/get_lectura_data.php` para obtener el texto.
    *   Actualiza el título original y su traducción (si existe o la traduce con `window.traducirTitulo()`).
    *   Divide el contenido original en frases usando `window.dividirEnFrases()`.
    *   Inicializa `window.todasLasFrasesTraduccion`, priorizando el caché y luego la traducción completa del contenido.
    *   Si todas las frases están traducidas, llama a `window.guardarTextoCompletoTraducido()` para asegurar que la traducción completa esté persistida.
    *   Resetea `window.paginaActual` a 0, recalcula `window.frasesPorPagina` y llama a `mostrarPagina()` para renderizar la primera página.
    *   Hace visible el contenido del lector y oculta el mensaje de carga.
    *   Habilita el botón de reproducción y establece `isPageReadyForReading` a `true`.
    *   Incluye manejo de errores para peticiones `fetch` y actualizaciones de UI en caso de fallo.

## Event Listeners y Lógica de Interacción

*   **`DOMContentLoaded`:**
    *   Configura un `MutationObserver` en `#panelLectura` para llamar a `cargarContenidoLectura()` cuando el panel se activa y detener la lectura cuando se desactiva.
*   **Botones de Paginación (`.btn-anterior`, `.btn-siguiente`):**
    *   Al hacer clic, cambian `window.paginaActual` y llaman a `mostrarPagina()`. Detienen la lectura continua si está activa.
*   **`resize` Event:**
    *   Utiliza un *debounce* para recalcular `window.frasesPorPagina` y `totalPaginas` al cambiar el tamaño de la ventana o el zoom, y luego llama a `mostrarPagina()` para adaptar la visualización.
*   **Botón de Reproducción/Detención (`.btn-play`):**
    *   **`actualizarBotonPlay()`:** Función local que actualiza el icono y el título del botón, y la visibilidad de los encabezados (`.encabezado-lectura` y `.encabezado-secundario-lectura`) según el estado de `window.MotorLectura`.
    *   Al hacer clic, inicia, pausa o detiene la lectura a través de `window.MotorLectura.iniciar()` o `window.MotorLectura.detener()`.
*   **Botón "Volver" Secundario (`.btn-volver-secundario`):**
    *   Detiene la lectura, restaura la visibilidad de los encabezados y cambia a la pestaña "Mis Textos".
*   **Extensión de `window.MotorLectura.siguiente`:**
    *   Modifica el método `siguiente` del `MotorLectura` para que, al terminar los párrafos de una página, avance automáticamente a la siguiente página si `lecturaContinua` es `true`.
*   **Modificación de `mostrarPagina`:**
    *   Envuelve la función `mostrarPagina` original para detener la lectura si el usuario cambia de página manualmente.
*   **`setInterval` para `actualizarBotonPlay`:**
    *   Actualiza el estado del botón de reproducción cada 500ms.
*   **`visibilitychange` Event:**
    *   Detiene la lectura si la página se oculta (ej. el usuario cambia de pestaña o minimiza la ventana).
*   **`beforeunload` Event:**
    *   Detiene `speechSynthesis` y el `MotorLectura` de forma síncrona cuando el usuario intenta salir o recargar la página.
*   **`pageshow` Event:**
    *   Detiene cualquier lectura activa al cargar la página (especialmente útil para navegación de historial).

## Archivos relacionados
*   `pestanas/lectura.php`: Incluye este script y proporciona la estructura HTML.
*   `pestanas/php/get_lectura_data.php`: Endpoint PHP para obtener el contenido del texto.
*   `lector/reading-engine.js`: Define `window.MotorLectura` y sus métodos.
*   `lector/electron-voice-integration.js`: Proporciona la API de voz.
*   `traducion_api/lectura-translation-functions.js`: Proporciona `window.traducirFrase`, `window.cargarCacheTraducciones`, `window.traducirTitulo`, `window.guardarTraduccionCompletaEnBD`, `window.construirTextoCompletoTraducido`.
*   `pestanas/js/text-utils.js`: Proporciona `window.dividirEnFrases`.
*   `pestanas/js/modalFinalizacion.js`: Define `window.mostrarModalFinalizacion`.
*   `js/global.js`: Define `window.showLoadingMessage`, `window.hideLoadingMessage`, `window.toggleEncabezadoPrincipal`, `window.cambiarPestana`.
