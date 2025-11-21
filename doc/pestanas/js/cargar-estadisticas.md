# Documentación del archivo `pestanas/js/cargar-estadisticas.js`

## Descripción
El archivo `cargar-estadisticas.js` contiene funciones JavaScript encargadas de cargar y actualizar dinámicamente las estadísticas de progreso del usuario en la interfaz. Específicamente, se enfoca en obtener el número de textos subidos y el total de palabras guardadas, y mostrarlos en los elementos HTML correspondientes.

## Funciones Clave

### 1. `cargarTextosSubidos()` (función global)
*   **Propósito:** Obtiene el número de textos subidos por el usuario y actualiza el elemento `#textos-subidos`.
*   **Funcionamiento:**
    *   Obtiene la referencia al elemento DOM `#textos-subidos`. Si no se encuentra, registra una advertencia y detiene la ejecución.
    *   Realiza una petición `fetch` (GET) a `/trabajoFinal/pestanas/php/get_textos.php`.
    *   Si la respuesta es exitosa (`data.success` es `true` y `data.data` es un array), actualiza el `textContent` de `#textos-subidos` con la longitud del array de textos.
    *   En caso de error (HTTP o de la API), registra el error en consola y establece el `textContent` a '0'.

### 2. `cargarPalabrasGuardadas()` (función global)
*   **Propósito:** Obtiene el número total de palabras guardadas por el usuario y actualiza el elemento `#palabras-guardadas`.
*   **Funcionamiento:**
    *   Obtiene la referencia al elemento DOM `#palabras-guardadas`. Si no se encuentra, registra una advertencia y detiene la ejecución.
    *   Realiza una petición `fetch` (GET) a `/trabajoFinal/pestanas/php/get_total_words.php`.
    *   Si la respuesta es exitosa (`data.success` es `true`), actualiza el `textContent` de `#palabras-guardadas` con el valor de `data.total_words`.
    *   En caso de error (HTTP o de la API), registra el error en consola y establece el `textContent` a '0'.

## Inicialización
*   Ambas funciones (`cargarTextosSubidos` y `cargarPalabrasGuardadas`) se ejecutan automáticamente cuando el DOM está listo (`DOMContentLoaded`) o inmediatamente si el DOM ya está cargado, pero solo si los elementos HTML correspondientes (`#textos-subidos` y `#palabras-guardadas`) existen en la página.
*   Ambas funciones también se exportan al objeto `window` para permitir que otros scripts las llamen manualmente cuando sea necesario (por ejemplo, después de que un usuario suba o elimine un texto, o guarde una palabra).

## Archivos relacionados
*   `pestanas/progreso.php`: Incluye este script y proporciona la estructura HTML con los elementos `#textos-subidos` y `#palabras-guardadas`.
*   `pestanas/php/get_textos.php`: Endpoint PHP para obtener el número de textos subidos.
*   `pestanas/php/get_total_words.php`: Endpoint PHP para obtener el número total de palabras guardadas.
*   `pestanas/js/texto.js`: Llama a `window.cargarTextosSubidos()` después de subir o eliminar textos.
*   `pestanas/js/subir_texto.js`: Llama a `window.cargarTextosSubidos()` después de subir un texto.
