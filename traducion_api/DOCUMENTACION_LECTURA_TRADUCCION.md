# Documentación del Sistema de Lectura y Traducción Simultánea

Este documento detalla el funcionamiento del sistema de lectura y traducción simultánea implementado en la aplicación, explicando cómo el texto se lee en voz alta y su traducción aparece debajo de la línea que se está leyendo.

## 1. Visión General del Proceso

El sistema está diseñado para proporcionar una experiencia de lectura inmersiva, donde el usuario puede escuchar el texto original mientras ve su traducción en tiempo real. Esto se logra mediante la división del texto en frases, la gestión de la paginación, la integración de una API de voz y un sistema de traducción con caché.

El flujo general es el siguiente:
1.  El usuario selecciona un texto para leer.
2.  El texto se carga y se divide en frases.
3.  Se calcula cuántas frases caben en la pantalla (paginación).
4.  Cuando el usuario inicia la lectura, el sistema lee frase por frase.
5.  Antes de que cada frase sea leída, su traducción se busca en un caché o se traduce en tiempo real.
6.  La traducción se muestra debajo de la frase original justo antes de que la voz comience a leerla.
7.  El sistema resalta la frase actual y avanza automáticamente a la siguiente frase o página.
8.  La lectura puede ser pausada y reanudada desde la última posición.

## 2. Archivos Principales Involucrados

Los siguientes archivos son cruciales para el funcionamiento de este sistema:

*   **`pestanas/lectura.php`**:
    *   Es la interfaz de usuario principal para el lector.
    *   Incluye los scripts JavaScript y CSS necesarios.
    *   Contiene la estructura HTML para mostrar el título del texto, el progreso, los botones de navegación y la zona donde se renderizan las frases originales y sus traducciones.
    *   Define los contenedores (`.frase-original`, `.frase-traduccion-original`) donde JavaScript insertará el contenido dinámicamente.

*   **`pestanas/js/lectura.js`**:
    *   **Lógica de Paginación y Carga de Contenido**: Maneja la división del texto en frases (`dividirEnFrases`), el cálculo de cuántas frases caben por página (`calcularFrasesPorPagina`), y la visualización de la página actual (`mostrarPagina`).
    *   **Orquestación**: Coordina la carga del texto desde el servidor (`cargarContenidoLectura`), la inicialización del caché de traducciones, y la actualización de la interfaz de usuario (títulos, paginación).
    *   **Control del Botón de Reproducción**: Gestiona el estado del botón "Play/Pause" y su interacción con el `MotorLectura`.
    *   **Manejo de Eventos**: Escucha eventos de redimensionamiento de ventana para ajustar la paginación dinámicamente.

*   **`lector/reading-engine.js`**:
    *   **Motor de Lectura Principal (`MotorLectura` objeto)**: Contiene la lógica central para la reproducción de voz y el control de la lectura.
    *   **Estado de Lectura**: Mantiene el estado actual (`inactivo`, `reproduciendo`, `pausado`).
    *   **Resaltado**: Resalta la frase que se está leyendo (`resaltar`, `limpiarResaltado`).
    *   **Reproducción de Voz (`hablar`)**: Utiliza la API `SpeechSynthesisUtterance` del navegador para leer el texto.
    *   **Lógica de Avance (`siguiente`)**: Determina cuándo avanzar al siguiente párrafo o a la siguiente página.
    *   **`hablarActual()`**: Esta es la función clave. Se encarga de:
        *   Obtener la frase original actual.
        *   Buscar el elemento HTML donde se debe mostrar la traducción.
        *   Obtener la traducción (del caché o traduciéndola en tiempo real).
        *   **Insertar la traducción en el DOM justo antes de iniciar la reproducción de voz.**
        *   Iniciar la reproducción de voz de la frase original.
    *   **Pausa y Reanudación**: Implementa `pausar()` y `reanudar()` para detener y continuar la lectura, guardando la posición exacta (página y párrafo) en las propiedades `lastPausedPageIndex` y `lastPausedParagraphIndex`.

*   **`traducion_api/lectura-translation-functions.js`**:
    *   **Caché de Traducciones (`window.contentTranslationsCache`)**: Almacena las traducciones de frases ya obtenidas para evitar peticiones repetidas a la API.
    *   **`traducirFrase(fraseOriginal, textId)`**: Función asíncrona que:
        *   Verifica si la traducción ya está en el caché.
        *   Si no está, realiza una petición `fetch` a `traducion_api/translate.php` para obtener la traducción.
        *   Guarda la traducción obtenida en el caché y en la base de datos (`save_content_translation.php`).
    *   **`cargarCacheTraducciones(textId)`**: Carga las traducciones previamente guardadas para un texto específico desde la base de datos (`get_content_translation.php`) al inicio de la lectura.
    *   **`guardarTraduccionEnBD` / `guardarTraduccionCompletaEnBD` / `traducirTitulo` / `guardarTraduccionTituloEnBD`**: Funciones auxiliares para interactuar con la base de datos y la API de traducción para títulos y contenido completo.

*   **`lector/electron-voice-integration.js`**:
    *   **Integración de ResponsiveVoice**: Carga la biblioteca ResponsiveVoice.js y la integra con el sistema.
    *   **API de Voz Unificada**: Proporciona una API consistente (`window.leerTexto`, `window.detenerLectura`, etc.) que `MotorLectura` utiliza para interactuar con el servicio de voz.
    *   **Silenciamiento de Logs**: Contiene lógica para silenciar los logs verbosos de ResponsiveVoice en la consola.

## 3. Flujo de Ejecución Detallado (Lectura y Traducción Simultánea)

1.  **Activación del Panel de Lectura**: Cuando el `div` con `id="panelLectura"` obtiene la clase `activo` (manejado por `pestanas/js/global.js` o similar), se llama a `pestanas/js/lectura.js::cargarContenidoLectura()`.
2.  **Carga y Preparación del Texto**:
    *   `cargarContenidoLectura()` obtiene el texto original y su traducción completa (si existe) de la base de datos.
    *   Divide el texto original en frases usando `dividirEnFrases()`.
    *   Carga las traducciones existentes en `window.contentTranslationsCache` y `window.todasLasFrasesTraduccion`.
    *   Calcula `window.frasesPorPagina` y llama a `mostrarPagina(0)` para renderizar la primera página.
3.  **Renderización de la Página (`mostrarPagina`)**:
    *   Limpia el contenido anterior de `.zona-frases`.
    *   Crea un `div` con `class="page active"` para la página actual.
    *   Para cada frase original de la página:
        *   Crea un `div.frase.frase-original` con un `p.paragraph` para la frase original.
        *   Crea un `div.frase-traduccion-original` con un `p.texto-traduccion-original` vacío debajo. Este `p` es donde aparecerá la traducción.
4.  **Inicio de la Lectura (`btn-play` click)**:
    *   Cuando el usuario hace clic en `btn-play`, se llama a `window.MotorLectura.iniciar()`.
    *   `MotorLectura.iniciar()` determina el `indiceActual` (párrafo) y `window.paginaActual` (página) desde donde empezar (considerando la última posición pausada o el inicio).
    *   Establece el `estado` del motor a `reproduciendo` y llama a `this.hablarActual()`.
5.  **Lectura de la Frase Actual (`hablarActual`)**:
    *   `hablarActual()` obtiene el párrafo actual (`p.paragraph`) y su texto.
    *   Limpia cualquier resaltado anterior y resalta el párrafo actual (`p.paragraph.reading-current`).
    *   **Punto clave de la traducción simultánea**:
        *   Calcula el `indiceGlobal` de la frase actual.
        *   Busca la traducción en `window.todasLasFrasesTraduccion` o en `window.contentTranslationsCache`.
        *   Si no la encuentra, llama a `window.traducirFrase()` (que usa `traducion_api/translate.php`).
        *   **Una vez obtenida la `traduccionFrase`, la inserta en el `p.texto-traduccion-original` correspondiente a la frase actual.**
    *   Finalmente, llama a `this.hablar(text)` para que la API de voz lea la frase original.
6.  **Avance de la Lectura**:
    *   Cuando la API de voz termina de leer una frase (`utt.onend`), `MotorLectura.siguiente()` se llama automáticamente.
    *   `siguiente()` incrementa `indiceActual` y llama a `hablarActual()` para la siguiente frase.
    *   Si no hay más frases en la página actual, y `lecturaContinua` es `true`, avanza a la siguiente página llamando a `window.mostrarPagina()` y luego reinicia `indiceActual` a 0 para la nueva página.

## 4. Manejo de la Pausa y Reanudación

*   **Pausa (`MotorLectura.pausar()`)**:
    *   Cambia el `estado` a `pausado`.
    *   **Guarda la posición actual**: Almacena `this.indiceActual` en `this.lastPausedParagraphIndex` y `window.paginaActual` en `this.lastPausedPageIndex`.
    *   Cancela la síntesis de voz actual.
*   **Reanudación (`MotorLectura.reanudar()`)**:
    *   Si el `estado` es `pausado`, lo cambia a `reproduciendo`.
    *   **Recupera la posición**: Si la `window.paginaActual` actual es diferente de `this.lastPausedPageIndex`, navega a la página guardada usando `window.mostrarPagina()`.
    *   Una vez en la página correcta, establece `this.indiceActual` a `this.lastPausedParagraphIndex` y llama a `this.hablarActual()` para continuar la lectura desde ese punto.
    *   Si el `estado` es `inactivo`, llama a `this.iniciar()` (que a su vez usará la última posición pausada si existe).
*   **Inicio (`MotorLectura.iniciar(startIndex)`)**:
    *   Si se llama sin `startIndex` y hay una posición pausada guardada (`this.lastPausedPageIndex` o `this.lastPausedParagraphIndex` no son 0), el motor navegará a esa página y párrafo para reanudar.
    *   Si no hay posición pausada o se proporciona un `startIndex`, la lectura comenzará desde el `startIndex` o desde el principio (0).

Este sistema garantiza que la traducción se muestre de manera sincronizada con la lectura de voz, y que la experiencia del usuario sea fluida al pausar y reanudar el texto.
