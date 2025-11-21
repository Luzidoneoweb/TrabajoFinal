# Documentación del archivo `pestanas/js/texto.js`

## Descripción
El archivo `pestanas/js/texto.js` es el script principal que gestiona la interfaz y la lógica de la pestaña "Mis Textos" de la aplicación. Se encarga de cargar los textos del usuario desde el servidor, renderizarlos en la interfaz, manejar la traducción automática de títulos, la navegación a la pestaña de lectura y la eliminación de textos seleccionados.

## Funciones Clave

### 1. `cargarTextos()`
*   **Propósito:** Carga la lista de textos del usuario desde el servidor y actualiza la interfaz de la pestaña "Mis Textos".
*   **Funcionamiento:**
    1.  **Mostrar Mensaje de Carga:** Si `window.showLoadingMessage` está disponible, lo llama para mostrar un indicador de carga.
    2.  **Petición `fetch`:** Realiza una petición `fetch` (GET) a `pestanas/php/get_textos.php` para obtener los textos del usuario.
    3.  **Manejo de Respuesta Exitosa (`.then(data => ...)`):**
        *   Si `data.success` es `true`:
            *   Obtiene referencias a los elementos DOM `.lista-textos`, `.visor-texto` y `.contador-textos`.
            *   Limpia el contenido existente de `.lista-textos`.
            *   Actualiza el `.contador-textos` con el número de textos encontrados.
            *   Si `window.cargarTextosSubidos` está disponible, lo llama para actualizar las estadísticas en la pestaña de Progreso.
            *   **Manejo de Textos Vacíos:** Si no hay textos (`data.data.length === 0`), muestra un mensaje amigable y un botón "Subir mi primer texto" que, al hacer clic, cambia a la pestaña "Subir Texto" utilizando `window.cambiarPestana()`.
            *   **Renderizado de Textos:** Itera sobre cada texto recibido (`data.data.forEach(texto => ...)`):
                *   Crea un elemento `div` (`.item-texto`) para cada texto.
                *   Establece el `data-id` del elemento con el ID del texto.
                *   Rellena el HTML interno con el título, la traducción del título (si existe, o "Traduciendo..."), el número de palabras y el estado (Público/Privado).
                *   **Traducción Automática de Títulos:** Si `texto.title_translation` no existe y `window.traducirTitulo` está disponible, llama a `window.traducirTitulo()` para obtener y guardar la traducción del título de forma asíncrona, actualizando el `elementoTraduccion.textContent` una vez recibida.
                *   **Evento de Clic en Texto:** Añade un `event listener` a cada `.item-texto` (excepto para checkboxes y botones) que:
                    *   Guarda el `texto.id` en `localStorage` como `currentTextId`.
                    *   Muestra el mensaje de carga.
                    *   Con un pequeño retraso, llama a `window.cambiarPestana('lectura')` para navegar a la pestaña de lectura.
                *   Añade el `itemTexto` a `.lista-textos`.
        *   Si `data.success` es `false`, registra el error en consola y muestra un mensaje de error en `.lista-textos`.
    4.  **Manejo de Errores de `fetch` (`.catch(error => ...)`):**
        *   Captura errores de red o HTTP.
        *   Muestra un mensaje de error amigable en `.lista-textos` indicando que verifique la conexión.
        *   Registra el error en consola (excepto para errores de "Failed to fetch" que pueden ocurrir si el usuario está offline).
    5.  **Ocultar Mensaje de Carga:** Si `window.hideLoadingMessage` está disponible, lo llama al finalizar (éxito o error).

### 2. `manejarEliminacionTextos()`
*   **Propósito:** Gestiona la eliminación de uno o más textos seleccionados por el usuario.
*   **Funcionamiento:**
    1.  **Obtener IDs:** Recopila los `data-id` de todos los checkboxes seleccionados (`.chk-texto:checked`).
    2.  **Validación:** Si no hay textos seleccionados, muestra una notificación de error.
    3.  **Confirmación:** Pide confirmación al usuario antes de proceder con la eliminación.
    4.  **Petición `fetch`:** Realiza una petición `fetch` (POST) a `pestanas/php/eliminar_textos.php` enviando un JSON con los IDs de los textos a eliminar.
    5.  **Manejo de Respuesta:**
        *   Si la respuesta es exitosa (`data.success`), muestra una notificación de éxito, llama a `cargarTextos()` para actualizar la lista, y si están disponibles, llama a `window.cargarTextosSubidos()` y `window.cargarPalabras()` para actualizar otras secciones de la UI.
        *   Si hay un error, muestra una notificación de error.
    6.  **Manejo de Errores de `fetch`:** Captura y muestra errores de conexión.

## Event Listeners y Lógica de Inicialización
*   **`DOMContentLoaded`:**
    *   Después de un pequeño retraso, verifica si el `panelTextos` está activo y, si lo está, llama a `cargarTextos()`.
    *   **`MutationObserver`:** Configura un observador para `panelTextos` que detecta cambios en sus atributos de clase. Si `panelTextos` adquiere la clase `activo`, llama a `cargarTextos()` para recargar los textos.
    *   **Botón Eliminar Textos:** Asigna la función `manejarEliminacionTextos` al botón `#btn-eliminar-textos`.

## Archivos relacionados
*   `pestanas/textos.php`: Incluye este script y proporciona la estructura HTML con los elementos DOM que este script manipula.
*   `pestanas/php/get_textos.php`: Endpoint PHP para obtener la lista de textos.
*   `pestanas/php/eliminar_textos.php`: Endpoint PHP para eliminar textos.
*   `pestanas/js/global.js`: Define `window.cambiarPestana` y `mostrarNotificacion`.
*   `js/global.js`: Define `window.showLoadingMessage` y `window.hideLoadingMessage`.
*   `traducion_api/lectura-translation-functions.js`: Define `window.traducirTitulo`.
*   `pestanas/js/cargar-estadisticas.js`: Se espera que defina `window.cargarTextosSubidos`.
*   `pestanas/js/palabras.js`: Se espera que defina `window.cargarPalabras`.
