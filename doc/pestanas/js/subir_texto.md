# Documentación del archivo `pestanas/js/subir_texto.js`

## Descripción
El archivo `pestanas/js/subir_texto.js` es el script principal que gestiona la interfaz y la lógica del formulario para subir nuevos textos en la pestaña "Subir Texto". Se encarga de interactuar con los elementos del formulario, cargar dinámicamente las categorías (si el usuario es administrador), enviar los datos del texto al servidor y mostrar mensajes de estado al usuario.

## Funciones Clave

### 1. `mostrarMensaje(mensaje, tipo = 'info')` (función local)
*   **Propósito:** Muestra un mensaje flotante estilizado en la esquina superior derecha de la pantalla.
*   **Parámetros:**
    *   `mensaje`: El texto a mostrar.
    *   `tipo`: (Opcional) El tipo de mensaje ('info', 'success', 'error'), que determina el color de fondo. Por defecto es 'info'.
*   **Funcionamiento:**
    *   Crea un elemento `div` con clases y estilos CSS para posicionarlo y darle un aspecto visual.
    *   Aplica colores de fondo según el `tipo` de mensaje.
    *   Lo añade al `document.body`.
    *   Utiliza `setTimeout` para animar su entrada (deslizándose desde la derecha) y su posterior salida y eliminación del DOM después de 3 segundos.

### 2. `cargarCategorias()` (función local)
*   **Propósito:** Carga dinámicamente las categorías disponibles desde el servidor y las popula en el elemento `<select>` del formulario.
*   **Funcionamiento:**
    *   Verifica si el elemento `categoria` existe en el DOM (solo visible para administradores). Si no, detiene la ejecución.
    *   Realiza una petición `fetch` (GET) a `/trabajoFinal/pestanas/php/get_categoria.php`.
    *   Si la respuesta es exitosa (`data.success`), limpia las opciones existentes en el `select` y añade una opción por defecto. Luego, itera sobre las categorías recibidas (`data.categories`) y crea un `<option>` para cada una, añadiéndolas al `select`.
    *   Registra errores en consola si la carga falla.

## Event Listeners y Lógica de Inicialización

*   **`DOMContentLoaded`:**
    *   Obtiene referencias a los elementos del formulario: `titulo`, `contenido`, `texto_publico`, `categoria` y `btnSubirTexto`.
    *   Llama a `cargarCategorias()` si el elemento `categoria` existe.
    *   **`btnSubirTexto` click:**
        *   Crea un objeto `FormData` con los valores de los campos del formulario (título, contenido, si es público, y categoría).
        *   Realiza una petición `fetch` (POST) a `/trabajoFinal/pestanas/php/subirTextoFuncion.php` para enviar los datos.
        *   **Manejo de Respuesta Exitosa (`.then(data => ...)`):**
            *   Si `data.success` es `true`:
                *   Llama a `mostrarMensaje()` con un mensaje de éxito.
                *   Limpia los campos del formulario.
                *   Si `window.cargarTextosSubidos` está disponible, lo llama para actualizar las estadísticas de progreso.
                *   Después de 1 segundo, llama a `cambiarPestana('textos')` (definida en `pestanas/js/global.js`) para redirigir a la pestaña "Mis Textos".
            *   Si `data.success` es `false`, llama a `mostrarMensaje()` con un mensaje de error.
        *   **Manejo de Errores de `fetch`:** Captura y muestra errores de conexión con `mostrarMensaje()`.

## Archivos relacionados
*   `pestanas/subir_texto.php`: Incluye este script y proporciona la estructura HTML del formulario.
*   `pestanas/php/get_categoria.php`: Endpoint PHP para obtener las categorías.
*   `pestanas/php/subirTextoFuncion.php`: Endpoint PHP que procesa la subida del texto.
*   `pestanas/js/global.js`: Define `cambiarPestana`.
*   `pestanas/js/cargar-estadisticas.js`: Se espera que defina `window.cargarTextosSubidos`.
