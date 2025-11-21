# Documentación del archivo `pestanas/js/modalFinalizacion.js`

## Descripción
El archivo `modalFinalizacion.js` implementa la lógica para mostrar un modal de finalización de lectura. Este modal incluye un spinner animado, un mensaje de confirmación de lectura finalizada y una redirección automática a una URL predefinida (por defecto, la pestaña "Mis Textos") después de un breve retraso. Está diseñado para proporcionar una experiencia de usuario fluida al completar un texto.

## Estructura y Lógica Principal

### `mostrarModalFinalizacion(urlRedireccion, liberarFlag)` (función global)
*   **Propósito:** Muestra el modal de finalización de lectura y gestiona la redirección.
*   **Parámetros:**
    *   `urlRedireccion`: (string, opcional) La URL a la que se redirigirá al usuario. Por defecto es `"index.php?tab=textos"`.
    *   `liberarFlag`: (boolean, opcional) Si es `true`, libera el flag `window.isReadingInProgress` (si existe). Por defecto es `true`.
*   **Funcionamiento:**
    1.  **Verificación de Duplicados:** Elimina cualquier modal de finalización existente para evitar múltiples instancias.
    2.  **Creación del Modal:** Crea un nuevo elemento `div` con el ID `modal-finalizacion`.
    3.  **Estilos Dinámicos:** Aplica estilos CSS directamente al modal para posicionarlo en el centro de la pantalla, darle un aspecto visual y asegurar un `z-index` alto (ajustado si la aplicación está en modo pantalla completa).
    4.  **Contenido HTML:** Inserta el HTML interno del modal, que incluye:
        *   Un spinner CSS animado.
        *   El mensaje "Lectura finalizada".
        *   El mensaje "Redirigiendo...".
    5.  **Animación CSS:** Si la animación `@keyframes spin` no existe en el documento, la inyecta dinámicamente en el `<head>`.
    6.  **Añadir al DOM:** Agrega el modal al `document.body`.
    7.  **Redirección con Retraso:** Utiliza `setTimeout` para:
        *   Liberar el flag `window.isReadingInProgress` (si `liberarFlag` es `true`).
        *   Redirigir a `window.location.href` a la `urlRedireccion` especificada después de 2 segundos.
    8.  **Manejo de Errores:** Si ocurre un error durante la creación o visualización del modal, lo registra en consola y redirige de todas formas después de un breve retraso.

## Exportación Global
La función `mostrarModalFinalizacion` se asigna al objeto `window`, haciéndola accesible globalmente desde otros scripts de la aplicación.

## Inicialización
El script se envuelve en una IIFE (Immediately Invoked Function Expression) y utiliza un bloque `try...catch` para asegurar que, incluso si hay errores al cargar el script, se defina una función `mostrarModalFinalizacion` de *stub* que simplemente redirige, evitando así que otros scripts fallen al intentar llamarla.

## Archivos relacionados
*   `pestanas/lectura.js`: Llama a `window.mostrarModalFinalizacion()` cuando la lectura de un texto ha llegado a su fin natural.
*   `lector/reading-engine.js`: También llama a `window.mostrarModalFinalizacion()` cuando la lectura finaliza de forma natural.
