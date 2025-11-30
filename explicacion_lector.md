# Documentación del Sistema de Lectura (Lector)

Este documento explica el funcionamiento del sistema de lectura, los archivos involucrados, las APIs externas utilizadas, las funciones principales y una revisión de código.

## 1. Visión General

El sistema de lectura permite la reproducción de texto a voz (Text-to-Speech, TTS) de los párrafos de un texto, con funcionalidades de resaltado, pausa, reanudación y detención. También integra la traducción simultánea de frases mientras se lee. Está diseñado para funcionar tanto en entornos web como en aplicaciones Electron.

## 2. Archivos Involucrados

Los archivos principales que intervienen en el sistema de lectura son:

*   `lector/electron-voice-integration.js`: Gestiona la integración con la API de Text-to-Speech ResponsiveVoice, proporcionando una interfaz unificada para la lectura de voz en entornos web y Electron.
*   `lector/reading-engine.js`: Contiene la lógica principal del motor de lectura, controlando el flujo de reproducción de párrafos, el resaltado, la interacción con la API de traducción y la gestión del estado de la lectura.
*   `pestanas/js/lectura.js`: (Implícito) Este archivo sería el encargado de inicializar el motor de lectura y llamar a las funciones expuestas por `electron-voice-integration.js` y `reading-engine.js` en la interfaz de usuario.
*   `traducion_api/lectura-translation-functions.js`: (Relacionado) Proporciona las funciones para traducir frases, que son utilizadas por `reading-engine.js` para la traducción simultánea.

## 3. Cómo se Utiliza

El sistema de lectura se utiliza principalmente a través de las funciones expuestas globalmente por `reading-engine.js` y `electron-voice-integration.js`.

### Inicialización y Control de Voz (`electron-voice-integration.js`)

Este script se encarga de cargar la librería ResponsiveVoice y exponer funciones globales para interactuar con ella:

*   **`window.obtenerSistemaVozListo()`**: Devuelve una promesa que se resuelve cuando ResponsiveVoice está cargado y listo para usar. Es el punto de entrada para asegurar que el sistema de voz está operativo.
*   **`window.leerTexto(texto, velocidad, callbacks)`**: Inicia la lectura de un `texto` dado con una `velocidad` específica. Permite definir `callbacks` para eventos como `onstart`, `onend`, `onpause`, `onresume`, `onerror`.
*   **`window.detenerLectura()`**: Detiene cualquier lectura en curso.
*   **`window.pausarLectura()`**: Pausa la lectura actual.
*   **`window.reanudarLectura()`**: Reanuda la lectura pausada.
*   **`window.estaLeyendo()`**: Devuelve `true` si ResponsiveVoice está reproduciendo audio.
*   **`window.obtenerVoces()`**: Devuelve una lista de las voces disponibles.
*   **`window.obtenerEstadoVoz()`**: Proporciona información sobre el estado actual del sistema de voz (entorno, si ResponsiveVoice está disponible, etc.).

### Motor de Lectura (`reading-engine.js`)

Este script define el objeto `MotorLectura` que gestiona el flujo de la lectura de un texto completo:

*   **`window.MotorLectura.iniciar(startIndex)`**: Inicia la lectura del texto. Puede recibir un `startIndex` para comenzar desde un párrafo específico. Si no se proporciona, intenta reanudar desde la última posición pausada o leída.
*   **`window.MotorLectura.pausar()`**: Pausa la lectura y guarda la posición actual (párrafo y página).
*   **`window.MotorLectura.reanudar()`**: Reanuda la lectura desde la última posición pausada.
*   **`window.MotorLectura.detener()`**: Detiene la lectura, limpia el resaltado y restablece el estado.
*   **`window.MotorLectura.finalizarLecturaNatural()`**: Se llama cuando la lectura llega al final del texto. Oculta los controles de lectura, muestra botones de finalización y un modal.

### Flujo de Lectura Típico

1.  La página de lectura carga el contenido del texto.
2.  Se llama a `window.obtenerSistemaVozListo()` para asegurar que el sistema de voz esté cargado.
3.  Se llama a `window.cargarCacheTraducciones(textId)` (desde `lectura-translation-functions.js`) para precargar las traducciones existentes desde la base de datos al caché del navegador.
4.  El usuario hace clic en un botón "Reproducir" (que llama a `window.iniciarLectura()` o `window.iniciarLecturaDesdeIndice()`).
5.  `MotorLectura.iniciar()` comienza a procesar los párrafos:
    *   Resalta el párrafo actual.
    *   Busca la traducción de la frase actual en el caché del navegador.
    *   Si no está en caché, llama a `window.traducirFrase()` (de `lectura-translation-functions.js`) para obtener la traducción de la API externa y la guarda en caché y BD.
    *   Muestra la traducción en la interfaz.
    *   Llama a `window.leerTexto()` (de `electron-voice-integration.js`) para reproducir el párrafo.
    *   Al finalizar un párrafo, avanza al siguiente o a la siguiente página.
6.  El usuario puede pausar, reanudar o detener la lectura en cualquier momento.
7.  Al finalizar el texto, se activa `finalizarLecturaNatural()`.

## 4. APIs Externas Utilizadas

El sistema de lectura utiliza una API externa principal para la síntesis de voz:

1.  **ResponsiveVoice.js**:
    *   **Endpoint**: `https://code.responsivevoice.org/responsivevoice.js`
    *   **Clave API**: `wJGiW37b` (expuesta en `electron-voice-integration.js`).
    *   **Propósito**: Proporciona la funcionalidad de Text-to-Speech para leer el texto en voz alta.
    *   **Voz por defecto**: 'UK English Female'.

Además, indirectamente, el motor de lectura interactúa con la API de traducción (DeepL/Google Translate) a través de `lectura-translation-functions.js` para obtener las traducciones de frases.

## 5. Funciones Principales

### `electron-voice-integration.js`

*   **`setupRVLogSilencer()`**: Silencia los mensajes de consola verbosos de ResponsiveVoice para mantener la consola limpia.
*   **`cargarScript(src, callback)`**: Carga dinámicamente el script de ResponsiveVoice desde su CDN.
*   **`detectarElectron()`**: Determina si la aplicación se está ejecutando en un entorno Electron o en un navegador web estándar.
*   **`inicializarVoz()`**: Función principal que carga ResponsiveVoice si no está ya disponible y configura las funciones globales de voz.
*   **`configurarFuncionesVoz()`**: Asigna las funciones de control de voz (`leerTexto`, `detenerLectura`, `pausarLectura`, etc.) al objeto `window` para que sean accesibles globalmente.

### `reading-engine.js` (Objeto `MotorLectura`)

*   **`estado`**: Variable que rastrea el estado actual del motor (`'inactivo'`, `'reproduciendo'`, `'pausado'`).
*   **`indiceActual`**: Índice del párrafo que se está leyendo actualmente dentro de la página.
*   **`lastPausedParagraphIndex`, `lastPausedPageIndex`**: Guardan la posición exacta donde se pausó la lectura para poder reanudarla.
*   **`obtenerVelocidad()`**: Obtiene la velocidad de lectura del input `rate` en el DOM.
*   **`parrafos()`**: Devuelve un array de los elementos `<p>` de la página activa.
*   **`limpiarResaltado()`**: Elimina la clase de resaltado de los párrafos.
*   **`resaltar(i)`**: Añade la clase de resaltado al párrafo en el índice `i`.
*   **`hablar(text)`**: Utiliza la API nativa `SpeechSynthesis` del navegador para leer el texto. (Nota: Hay una duplicidad aquí con `window.leerTexto` de ResponsiveVoice).
*   **`hablarActual()`**: Lógica central para leer el párrafo actual, incluyendo resaltado y la integración con la traducción.
*   **`siguiente()`**: Avanza al siguiente párrafo o a la siguiente página si se llega al final de la actual.
*   **`iniciar(startIndex)`**: Inicia la lectura desde un índice dado o desde la última posición guardada.
*   **`pausar()`**: Pausa la lectura y guarda la posición.
*   **`reanudar()`**: Reanuda la lectura, navegando a la página y párrafo correctos si es necesario.
*   **`detener()`**: Detiene la lectura y restablece la interfaz.
*   **`finalizarLecturaNatural()`**: Maneja el final de la lectura del texto completo, mostrando el modal de finalización.

## 6. Revisión de Código (Código Basura / Mejoras)

### `lector/electron-voice-integration.js`

*   **Clave API expuesta**: La clave de API de ResponsiveVoice (`_claveAPI = 'wJGiW37b'`) está directamente en el código. Esto es una **vulnerabilidad de seguridad**. Debería almacenarse en una variable de entorno o un archivo de configuración fuera del control de versiones y no accesible públicamente.
*   **Silenciador de logs**: La función `setupRVLogSilencer` es una solución ingeniosa para silenciar los logs de ResponsiveVoice, pero es un *hack* que podría romperse si la librería cambia sus mensajes de log.
*   **Detección de Electron**: La detección `window.electronAPI !== undefined` es específica para una API de Electron personalizada. Asegurarse de que esta API esté correctamente inyectada en el entorno Electron.
*   **Duplicidad de `detenerLectura`**: Este archivo expone `window.detenerLectura`, `window.pausarLectura`, `window.reanudarLectura`. Sin embargo, `reading-engine.js` también expone funciones con nombres similares (`window.detenerLectura`, `window.pausarVoz`, `window.reanudarVoz`) que llaman a sus propios métodos internos. Esto puede llevar a confusión o conflictos si no se gestiona cuidadosamente qué función se llama desde la UI.

### `lector/reading-engine.js`

*   **Duplicidad de TTS**: El método `MotorLectura.hablar(text)` utiliza la API nativa `window.speechSynthesis`, mientras que `electron-voice-integration.js` carga y expone `window.leerTexto` que usa ResponsiveVoice. Esto es una **duplicidad significativa**. Se debería elegir una única API de TTS (ResponsiveVoice o la nativa) y usarla consistentemente en todo el motor de lectura para evitar comportamientos inconsistentes y código redundante. Si la intención es usar ResponsiveVoice, `MotorLectura.hablar` debería llamar a `window.leerTexto`.
*   **Variables globales**: El motor de lectura depende de varias variables globales (`window.todasLasFrasesOriginales`, `window.currentTextId`, `window.paginaActual`, `window.frasesPorPagina`, `window.todasLasFrasesTraduccion`, `window.contentTranslationsCache`, `window.traducirFrase`, `window.guardarTextoCompletoTraducido`, `window.mostrarPagina`, `window.updateFloatingButton`, `window.mostrarModalFinalizacion`). Esto crea un acoplamiento fuerte y dificulta la depuración y el mantenimiento. Sería preferible encapsular estas dependencias o pasarlas como parámetros.
*   **Manejo de errores de `SpeechSynthesis`**: El `onerror` de `SpeechSynthesisUtterance` avanza al siguiente párrafo incluso si el error no es de interrupción/cancelación. Esto podría ocultar problemas reales de TTS.
*   **`setTimeout` para navegación de página**: El uso de `setTimeout` con un tiempo fijo (e.g., 100ms, 300ms) para esperar la actualización del DOM después de cambiar de página (`nextBtn.click()`, `window.mostrarPagina()`) es propenso a errores. Sería más robusto usar un mecanismo de espera basado en eventos o mutaciones del DOM para asegurar que la página esté realmente lista antes de continuar.
*   **`window.isCurrentlyReading`, `window.isCurrentlyPaused`**: Estas variables globales también contribuyen al acoplamiento.
*   **Exposición condicional de funciones**: La parte final del script que expone `window.iniciarLectura`, `window.pausarVoz`, etc., solo si no existen, es un intento de evitar conflictos, pero subraya el problema de la falta de un diseño modular claro.

### Código Basura

No se observa código "basura" evidente en el sentido de código comentado, funciones no utilizadas o bloques de código muertos. Las "mejoras" mencionadas anteriormente son más bien refactorizaciones para mejorar la modularidad, la robustez y evitar duplicidades.

## Conclusión

El sistema de lectura es funcional y ofrece una experiencia de lectura a voz con traducción integrada. Sin embargo, presenta áreas significativas de mejora en cuanto a la gestión de dependencias globales, la eliminación de duplicidades en la API de TTS y la robustez en la sincronización de la interfaz de usuario con el flujo de lectura. La seguridad de la clave API de ResponsiveVoice también es una preocupación importante.
