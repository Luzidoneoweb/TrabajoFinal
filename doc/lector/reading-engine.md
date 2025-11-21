# Documentación del archivo `lector/reading-engine.js`

## Descripción
El archivo `reading-engine.js` implementa el motor principal de lectura de la aplicación. Define un objeto `MotorLectura` que gestiona el estado de la reproducción de voz, el progreso de la lectura (párrafo actual, página), el resaltado visual del texto que se está leyendo, y la integración con el sistema de traducción para mostrar las traducciones de frases de forma simultánea.

## Objeto `MotorLectura`

### Propiedades
*   `estado`: (string) Indica el estado actual del motor de lectura ('inactivo', 'reproduciendo', 'pausado').
*   `indiceActual`: (number) El índice del párrafo actual que se está leyendo dentro de la página activa.
*   `pronunciacion`: (SpeechSynthesisUtterance) Referencia al objeto de pronunciación actual.
*   `lastPausedParagraphIndex`: (number) Guarda el índice del párrafo en el que se pausó la lectura.
*   `lastPausedPageIndex`: (number) Guarda el índice de la página en la que se pausó la lectura.

### Métodos

#### 1. `obtenerVelocidad()`
*   **Propósito:** Obtiene la velocidad de lectura configurada por el usuario.
*   **Funcionamiento:** Lee el valor de un input con ID `rate` y lo parsea a un flotante. Si no se encuentra o es inválido, devuelve 0.9 por defecto.

#### 2. `parrafos()`
*   **Propósito:** Obtiene todos los elementos de párrafo (`<p.paragraph>`) de la página activa.
*   **Funcionamiento:** Busca el elemento `.page.active` y luego todos los `p.paragraph` dentro de él.

#### 3. `limpiarResaltado()`
*   **Propósito:** Elimina el resaltado de todos los párrafos.
*   **Funcionamiento:** Remueve la clase `reading-current` de cualquier párrafo que la tenga.

#### 4. `resaltar(i)`
*   **Propósito:** Resalta el párrafo en el índice `i`.
*   **Funcionamiento:** Añade la clase `reading-current` al párrafo correspondiente. También guarda el `i` como `window.lastReadParagraphIndex` y el índice de la página activa como `window.lastReadPageIndex` para recordar la última posición de lectura.

#### 5. `hablar(text)`
*   **Propósito:** Utiliza la API `SpeechSynthesis` del navegador para leer un texto.
*   **Funcionamiento:**
    *   Cancela cualquier pronunciación anterior.
    *   Crea un `SpeechSynthesisUtterance` con el texto, velocidad, tono, volumen e idioma (`en-GB`).
    *   Define `onend` y `onerror` para avanzar al siguiente párrafo automáticamente.
    *   Inicia la pronunciación.

#### 6. `async hablarActual()`
*   **Propósito:** Lee el párrafo actual, lo resalta y muestra su traducción.
*   **Funcionamiento:**
    *   Verifica si hay párrafos y si el `indiceActual` es válido.
    *   Obtiene el texto del párrafo actual.
    *   Llama a `limpiarResaltado()` y `resaltar(this.indiceActual)`.
    *   **Integración con Traducción:**
        *   Calcula el índice global de la frase.
        *   Obtiene la frase original de `window.todasLasFrasesOriginales`.
        *   Busca el elemento DOM donde se mostrará la traducción.
        *   Intenta obtener la traducción de `window.todasLasFrasesTraduccion` o de `window.contentTranslationsCache`.
        *   Si no encuentra la traducción, llama a `window.traducirFrase()` (definida en `traducion_api/lectura-translation-functions.js`) para obtenerla y la guarda en el array y, si es necesario, llama a `window.guardarTextoCompletoTraducido()`.
        *   Muestra la traducción en el elemento DOM correspondiente.
    *   Finalmente, llama a `this.hablar(text)` para iniciar la lectura del párrafo.

#### 7. `siguiente()`
*   **Propósito:** Avanza al siguiente párrafo o a la siguiente página si se ha terminado la actual.
*   **Funcionamiento:**
    *   Si hay más párrafos en la página actual, llama a `hablarActual()`.
    *   Si no, intenta hacer clic en el botón "Siguiente" (`.btn-siguiente`) para cambiar de página. Después de un breve retraso, reinicia `indiceActual` a 0 y llama a `hablarActual()`.
    *   Si no hay más páginas, llama a `finalizarLecturaNatural()`.

#### 8. `async iniciar(startIndex)`
*   **Propósito:** Inicia la lectura desde un índice de párrafo específico o desde la última posición guardada/pausada.
*   **Funcionamiento:**
    *   Determina el `indiceActual` basándose en `startIndex`, `lastPausedParagraphIndex`/`lastPausedPageIndex` o `window.lastReadParagraphIndex`.
    *   Actualiza el `estado` a 'reproduciendo' y las variables globales `window.isCurrentlyReading`, `window.isCurrentlyPaused`.
    *   Si la lectura se reanuda desde una página diferente a la actual, llama a `window.mostrarPagina()` y espera a que el DOM se actualice antes de continuar.
    *   Llama a `hablarActual()`.

#### 9. `pausar()`
*   **Propósito:** Pausa la lectura.
*   **Funcionamiento:**
    *   Cambia el `estado` a 'pausado'.
    *   Guarda `indiceActual` y `window.paginaActual` en `lastPausedParagraphIndex` y `lastPausedPageIndex`.
    *   Cancela `speechSynthesis`.
    *   Actualiza `window.isCurrentlyPaused` y el botón flotante (si existe `window.updateFloatingButton`).

#### 10. `async reanudar()`
*   **Propósito:** Reanuda la lectura desde la posición pausada.
*   **Funcionamiento:**
    *   Si el `estado` es 'pausado', lo cambia a 'reproduciendo'.
    *   Actualiza `window.isCurrentlyPaused`, `window.isCurrentlyReading` y el botón flotante.
    *   Si la página actual es diferente a `lastPausedPageIndex`, cambia a esa página y luego reanuda la lectura.
    *   Si no, reanuda la lectura desde `lastPausedParagraphIndex`.
    *   Si el `estado` era 'inactivo', llama a `iniciar()` desde la última posición pausada.

#### 11. `detener()`
*   **Propósito:** Detiene completamente la lectura.
*   **Funcionamiento:**
    *   Cambia el `estado` a 'inactivo'.
    *   Cancela `speechSynthesis`.
    *   Llama a `limpiarResaltado()`.
    *   Actualiza `window.isCurrentlyReading`, `window.isCurrentlyPaused` y el botón flotante.
    *   Restaura la visibilidad de los controles de lectura y oculta los botones de final de lectura.

#### 12. `finalizarLecturaNatural()`
*   **Propósito:** Se llama cuando la lectura llega al final del texto.
*   **Funcionamiento:**
    *   Detiene la lectura de forma similar a `detener()`.
    *   Muestra los botones de final de lectura y oculta los controles normales.
    *   Llama a `window.mostrarModalFinalizacion()` (definida en `pestanas/js/modalFinalizacion.js`).

## Exportación Global
El objeto `MotorLectura` se asigna a `window.MotorLectura`. Además, se exponen funciones globales como `window.iniciarLectura`, `window.iniciarLecturaDesdeIndice`, `window.pausarVoz`, `window.reanudarVoz` y `window.detenerLectura` para proporcionar una API sencilla para controlar el motor de lectura, pero solo si no existen ya para evitar sobrescribir otras implementaciones.

## Archivos relacionados
*   `pestanas/lectura.php`: Incluye este script.
*   `lector/electron-voice-integration.js`: Proporciona las funciones `window.leerTexto`, `window.detenerLectura`, etc., que este motor utiliza.
*   `traducion_api/lectura-translation-functions.js`: Proporciona `window.traducirFrase` y `window.guardarTextoCompletoTraducido`.
*   `pestanas/js/lectura.js`: Es el script que interactúa directamente con este motor para controlar la UI del lector.
*   `pestanas/js/modalFinalizacion.js`: Define `window.mostrarModalFinalizacion`.
