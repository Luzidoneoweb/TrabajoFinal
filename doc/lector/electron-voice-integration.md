# Documentación del archivo `lector/electron-voice-integration.js`

## Descripción
El archivo `electron-voice-integration.js` proporciona un sistema unificado para la integración de la funcionalidad de voz en la aplicación, utilizando la biblioteca ResponsiveVoice.js. Está diseñado para funcionar tanto en un entorno web estándar como en una aplicación Electron, evitando conflictos de variables y ofreciendo una API consistente para la lectura de texto.

## Estructura y Lógica Principal

### 1. Silenciador de Logs (`setupRVLogSilencer()`)
*   **Propósito:** Reduce la verbosidad de los logs de consola generados por ResponsiveVoice.js.
*   **Funcionamiento:** Sobrescribe temporalmente `console.log`, `console.info` y `console.warn` para filtrar mensajes específicos de ResponsiveVoice, evitando que saturen la consola durante el desarrollo o en producción.

### 2. Variables Privadas
*   `_vozCargada`: Booleano que indica si ResponsiveVoice.js ha sido cargado y está listo.
*   `_esElectron`: Booleano que indica si la aplicación se está ejecutando en un entorno Electron.
*   `_claveAPI`: Clave API para ResponsiveVoice.js.
*   `_scriptCargado`: Booleano que asegura que el script de ResponsiveVoice.js no se cargue múltiples veces.
*   `_promesaInicializacion`: Almacena la promesa de inicialización para asegurar que la voz se inicialice una sola vez.

### 3. `cargarScript(src, callback)`
*   **Propósito:** Carga dinámicamente un script JavaScript desde una URL.
*   **Funcionamiento:** Crea un elemento `<script>`, le asigna la `src` y lo añade al `<head>`. Ejecuta un `callback` cuando el script se carga correctamente. Incluye un mecanismo para evitar cargas duplicadas.

### 4. `detectarElectron()`
*   **Propósito:** Detecta si la aplicación se está ejecutando dentro de un entorno Electron.
*   **Funcionamiento:** Comprueba la existencia de `window.electronAPI`, que es una interfaz común para la comunicación entre el proceso de renderizado y el proceso principal en Electron.

### 5. `inicializarVoz()`
*   **Propósito:** Función principal para inicializar el sistema de voz.
*   **Funcionamiento:**
    *   Llama a `detectarElectron()`.
    *   Verifica si `responsiveVoice` ya está cargado. Si es así, establece `_vozCargada` a `true` y llama a `configurarFuncionesVoz()`.
    *   Si no está cargado, carga ResponsiveVoice.js desde su CDN utilizando `cargarScript()` y la `_claveAPI`. Una vez cargado, establece `_vozCargada` a `true` y llama a `configurarFuncionesVoz()`.
    *   Devuelve una `Promise` que se resuelve cuando la voz está inicializada.

### 6. `configurarFuncionesVoz()`
*   **Propósito:** Expone las funciones de control de voz al objeto `window` para que sean accesibles globalmente.
*   **Funciones expuestas:**
    *   `window.leerTexto(texto, velocidad, callbacks)`: Inicia la lectura de un texto con una voz y velocidad configurables. Permite definir callbacks para eventos como `onstart`, `onend`, `onpause`, `onresume`, `onerror`.
    *   `window.detenerLectura()`: Detiene la lectura actual.
    *   `window.estaLeyendo()`: Devuelve `true` si ResponsiveVoice está reproduciendo audio.
    *   `window.pausarLectura()`: Pausa la lectura.
    *   `window.reanudarLectura()`: Reanuda la lectura.
    *   `window.cambiarVelocidad(nuevaVelocidad)`: (Implementación futura) Para ajustar la velocidad en caliente.
    *   `window.obtenerVoces()`: Devuelve la lista de voces disponibles.

### 7. `window.obtenerEstadoVoz()`
*   **Propósito:** Proporciona información sobre el estado actual del sistema de voz.
*   **Funcionamiento:** Devuelve un objeto con propiedades como `entorno` (Electron/Web), `responsiveVoiceDisponible`, `vozCargada`, `scriptCargado`, `claveAPI` y una lista de `funcionesDisponibles`.

### 8. `window.obtenerSistemaVozListo()`
*   **Propósito:** Devuelve una promesa que se resuelve cuando el sistema de voz está completamente inicializado.
*   **Funcionamiento:** Si la promesa de inicialización no ha sido creada, llama a `inicializarVoz()` y la almacena. Siempre devuelve la misma promesa.

## Inicialización
*   El script se inicializa automáticamente cuando el DOM está listo (`DOMContentLoaded`) o inmediatamente si el DOM ya está cargado.

## Archivos relacionados
*   `pestanas/lectura.php`: Incluye este script para habilitar la funcionalidad de voz en el lector.
*   `lector/reading-engine.js`: Probablemente utiliza las funciones globales expuestas por este script (ej. `window.leerTexto`, `window.detenerLectura`) para controlar la lectura de texto.
