# Documentación del archivo `pestanas/palabras.php`

## Descripción
El archivo `palabras.php` es un fragmento de código PHP y HTML que se incluye en `php/conten_logueado.php`. Su propósito es mostrar la interfaz de usuario para la gestión de las palabras guardadas por el usuario. Las palabras se agrupan por el texto al que pertenecen, y se proporciona funcionalidad para eliminar palabras seleccionadas.

## Lógica PHP
1.  **Inicio de Sesión y Conexión a la DB:**
    *   Verifica si la sesión ya está iniciada (`session_status() === PHP_SESSION_NONE`) y la inicia si no lo está.
    *   Incluye `db/conexion.php` para establecer la conexión a la base de datos.
2.  **Verificación de Autenticación:**
    *   Si el usuario no está autenticado (`!isset($_SESSION['user_id'])`), muestra un mensaje "No autenticado" y detiene la ejecución del script (devolviendo el control al archivo que lo incluyó).
3.  **Obtención de `user_id`:**
    *   Si el usuario está autenticado, se obtiene el ID del usuario de la sesión.
4.  **Consulta de Palabras Guardadas:**
    *   Realiza una consulta a la base de datos para obtener todas las palabras guardadas por el `user_id` actual.
    *   La consulta une la tabla `saved_words` con la tabla `texts` para obtener el título del texto asociado a cada palabra.
    *   Los resultados se ordenan por el título del texto y la fecha de creación de la palabra.
5.  **Agrupación de Palabras por Texto:**
    *   Las palabras obtenidas se procesan y se agrupan en un array `$words_by_text`, donde la clave es el título del texto (o 'Sin texto asociado' si no hay) y el valor es un array de palabras de ese texto.
    *   Se mantiene un contador `$total_words_saved` para el número total de palabras.

## Estructura HTML
El archivo se organiza en un contenedor principal (`.contenedor-palabras`) que incluye:

### 1. Barra de Acciones (`.barra-acciones-palabras`)
*   Muestra el total de palabras guardadas (`#total-words-count`).
*   Contiene un botón para eliminar palabras seleccionadas (`#delete-selected-words-btn`), que está deshabilitado por defecto.
*   Un contador de palabras seleccionadas (`#selected-count`).
*   Esta barra se oculta si no hay palabras guardadas.

### 2. Contenedor de Palabras (`#palabras-dinamicas-container`)
*   Muestra mensajes de éxito o error si están definidos.
*   **Mensaje "No tienes palabras guardadas":** Se muestra si `$words_by_text` está vacío.
*   **Formulario de Lista de Palabras (`#words-list-form`):**
    *   Itera sobre `$words_by_text` para crear "tarjetas" (`.card`) para cada texto.
    *   **Encabezado de Tarjeta (`.card-header`):**
        *   Un checkbox (`.text-checkbox.group-checkbox`) para seleccionar/deseleccionar todas las palabras de un texto.
        *   El título del texto y el número de palabras asociadas a él.
    *   **Lista de Palabras (`.text-list`):**
        *   Una lista (`<ul>`) que contiene cada palabra guardada (`<li>`).
        *   Cada `<li>` incluye un checkbox individual, la palabra original, su traducción, el contexto (si existe) y la fecha de guardado.
        *   El contexto se almacena en un atributo `data-context` y se espera que JavaScript lo use para mostrar la traducción del contexto.

## Archivos JavaScript incluidos
*   `pestanas/js/palabras.js`: Este es el script principal que maneja la interactividad de esta sección, incluyendo la selección de checkboxes, la habilitación/deshabilitación del botón de eliminar, la actualización del contador de palabras seleccionadas, y la lógica para eliminar palabras.

## Archivos PHP relacionados
*   `php/conten_logueado.php`: Incluye este archivo para mostrar el contenido de la pestaña "Palabras".
*   `db/conexion.php`: Proporciona la conexión a la base de datos.
*   `traducion_api/palabras/save_word.php` y `traducion_api/palabras/save_translated_word.php`: Probablemente son los endpoints que se usan para guardar las palabras que se muestran aquí.
*   `traducion_api/palabras/ajax_saved_words_content.php`: Podría ser un endpoint para recargar la lista de palabras dinámicamente.
