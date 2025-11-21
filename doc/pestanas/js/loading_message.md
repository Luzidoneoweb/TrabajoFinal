# Documentación del archivo `pestanas/js/loading_message.js`

## Descripción
El archivo `loading_message.js` proporciona funciones JavaScript para mostrar y ocultar un mensaje de carga en la interfaz de usuario. Estas funciones están diseñadas para ser accesibles globalmente y se utilizan para indicar al usuario que se está realizando una operación que requiere tiempo, como la carga de datos.

## Funciones Clave

### 1. `window.showLoadingMessage()`
*   **Propósito:** Hace visible el mensaje de carga.
*   **Funcionamiento:**
    *   Intenta obtener el elemento DOM con el ID `loading-message`.
    *   Si el elemento se encuentra, establece su estilo `display` a `flex` para hacerlo visible.
    *   Si el elemento no está disponible inmediatamente, realiza hasta 10 intentos con un pequeño retraso (`setTimeout`) para dar tiempo a que el DOM se renderice.
    *   Si después de varios intentos el elemento no se encuentra, registra una advertencia en la consola.

### 2. `window.hideLoadingMessage()`
*   **Propósito:** Oculta el mensaje de carga.
*   **Funcionamiento:**
    *   Obtiene el elemento DOM con el ID `loading-message`.
    *   Si el elemento se encuentra, establece su estilo `display` a `none` para ocultarlo.

## Exportación Global
Ambas funciones (`showLoadingMessage` y `hideLoadingMessage`) se asignan al objeto `window`, haciéndolas accesibles globalmente desde cualquier otro script de la aplicación.

## Archivos relacionados
*   `pestanas/lectura.php`: Incluye este script y el CSS asociado (`pestanas/css/loading_message.css`).
*   `pestanas/php/loading_message.php`: Probablemente proporciona la estructura HTML del mensaje de carga (`<div id="loading-message">`).
*   `pestanas/js/texto.js`: Utiliza `window.showLoadingMessage()` y `window.hideLoadingMessage()` al cargar y procesar los textos del usuario.
*   `pestanas/js/lectura.js`: Utiliza `window.showLoadingMessage()` y `window.hideLoadingMessage()` al cargar el contenido de lectura.
*   `pestanas/js/global.js`: También hace referencia a `window.showLoadingMessage()` y `window.hideLoadingMessage()` al cambiar de pestañas.
