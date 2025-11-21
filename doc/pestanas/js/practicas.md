# Documentación del archivo `pestanas/js/practicas.js`

## Descripción
El archivo `pestanas/js/practicas.js` es el script principal que gestiona la lógica de la interfaz de la pestaña "Prácticas" de la aplicación. Su función principal es cargar dinámicamente la lista de textos disponibles para la práctica en un elemento `<select>` y asegurar que esta lista se actualice cuando el panel de prácticas se activa.

## Funciones Clave

### 1. `cargarTextosPractica()`
*   **Propósito:** Obtiene la lista de textos del usuario desde el servidor y los popula en el selector de textos para la práctica.
*   **Funcionamiento:**
    1.  **Petición `fetch`:** Realiza una petición `fetch` (GET) a `pestanas/php/get_textos.php` para obtener los textos del usuario.
    2.  **Manejo de Respuesta Exitosa (`.then(data => ...)`):**
        *   Obtiene la referencia al elemento `<select>` con ID `selectorTextosPractica`.
        *   Limpia las opciones existentes en el selector, dejando solo la opción por defecto "Selecciona un texto...".
        *   Si `data.success` es `true` y `data.data` contiene textos, itera sobre ellos:
            *   Crea un elemento `<option>` para cada texto.
            *   Establece el `value` de la opción con el `id` del texto y el `textContent` con el `title` del texto.
            *   Añade la opción al selector.
    3.  **Manejo de Errores de `fetch`:** Captura y registra cualquier error durante la petición o el procesamiento.

## Event Listeners y Lógica de Inicialización

*   **`DOMContentLoaded`:**
    *   Después de un pequeño retraso, verifica si el `panelPracticas` está activo y, si lo está, llama a `cargarTextosPractica()`.
*   **`MutationObserver`:**
    *   Configura un observador para `panelPracticas` que detecta cambios en sus atributos de clase.
    *   Si `panelPracticas` adquiere la clase `activo`, registra un mensaje en consola y llama a `cargarTextosPractica()` para recargar los textos. Esto asegura que la lista de textos esté siempre actualizada cuando el usuario navega a la pestaña de prácticas.

## Archivos relacionados
*   `pestanas/practicas.php`: Incluye este script y proporciona la estructura HTML con el elemento `<select id="selectorTextosPractica">`.
*   `pestanas/php/get_textos.php`: Endpoint PHP al que este script hace la petición `fetch` para obtener la lista de textos del usuario.
*   `js/global.js` (o `pestanas/js/global.js`): Podría contener `window.showLoadingMessage` y `window.hideLoadingMessage` (comentados en el código actual, pero podrían ser relevantes).
