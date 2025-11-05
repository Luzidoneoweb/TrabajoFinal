Para explicar cómo hacer funciona la traducción simultánea de párrafos en esta aplicación, he analizado los siguientes archivos y su código:

*   `traducion_api/ESPECIFICACION_TRADUCCIONES.md`: Proporciona una descripción general del sistema de traducción, los archivos principales involucrados y la arquitectura.
*   `traducion_api/2_test_page.php`: Es la plantilla HTML que define la estructura de la página de lectura, incluyendo los contenedores para el texto original y su traducción.
*   `traducion_api/test_page_script.js`: Contiene las funciones JavaScript encargadas de la lógica de carga del texto, división en frases, paginación y visualización de la traducción.

Aquí te detallo el funcionamiento y los archivos clave:

### Archivos y Código Clave

1.  **`traducion_api/2_test_page.php` (Estructura HTML)**:
    Este archivo define la interfaz de usuario. Para cada párrafo original, existe un contenedor para su traducción.
    ```html
    <div class="frase frase-original" aria-label="Frase original">
        <div class="contenido-texto">
            <p></p> <!-- Aquí se carga el párrafo original -->
        </div>
    </div>
    <div class="frase-traduccion-original" aria-label="Traducción de la frase original">
        <p class="texto-traduccion-original"></p> <!-- Aquí se inyecta la traducción -->
    </div>
    ```
    El elemento `<p class="texto-traduccion-original"></p>` es donde se mostrará la traducción debajo del párrafo original.

2.  **`traducion_api/test_page_script.js` (Lógica de Carga y Traducción)**:
    Este script es el corazón de la experiencia de lectura en `2_test_page.php`. Sus funciones principales son:
    *   **`cargarContenidoLectura(textId)`**: Realiza una petición `fetch` a `get_test_text_data.php` para obtener el título, contenido original y traducción del texto.
    *   **`dividirEnFrases(texto, limitePalabras)`**: Divide el texto original y la traducción en fragmentos para la paginación.
    *   **`mostrarPagina(numeroPagina)`**: Renderiza las frases originales y sus traducciones correspondientes en la `zona-frases`.
    *   **`calcularFrasesPorPagina()`**: Ajusta dinámicamente el número de frases que caben en la pantalla.
    *   **`actualizarEstadoPaginacion()`**: Gestiona los botones de paginación y el contador de páginas.

    Este script se encarga de obtener la traducción (que ya viene pre-cargada en `content_translation` desde la base de datos a través de `get_test_text_data.php`) y mostrarla.

3.  **`translate.php` (Endpoint de Traducción)**:
    Este archivo PHP actúa como un intermediario con la API de Google Translate. Recibe el texto en inglés enviado desde el frontend, lo traduce y devuelve la traducción en formato JSON. (Aunque en `2_test_page.php` la traducción se carga directamente de la BD, este archivo es parte del sistema de traducción general).

4.  **`get_content_translation.php` y `save_content_translation.php` (Endpoints de Caché en BD)**:
    Estos archivos PHP gestionan la persistencia de las traducciones en una base de datos, permitiendo que las traducciones ya realizadas se carguen rápidamente sin necesidad de llamar a la API de Google Translate cada vez. (En el contexto de `2_test_page.php`, `get_test_text_data.php` ya devuelve la traducción guardada).

4.  **`translate.php` (Endpoint de Traducción)**:
    Este archivo PHP actúa como un intermediario con la API de Google Translate. Recibe el texto en inglés enviado desde el frontend, lo traduce y devuelve la traducción en formato JSON.

5.  **`get_content_translation.php` y `save_content_translation.php` (Endpoints de Caché en BD)**:
    Estos archivos PHP gestionan la persistencia de las traducciones en una base de datos, permitiendo que las traducciones ya realizadas se carguen rápidamente sin necesidad de llamar a la API de Google Translate cada vez.

### Funcionamiento de la Traducción Simultánea

El proceso de carga y visualización de la traducción en `traducion_api/2_test_page.php` ocurre de la siguiente manera:

1.  **Carga Inicial**: Al cargar `2_test_page.php`, el script `traducion_api/test_page_script.js` se ejecuta.
2.  **Petición de Datos**: `test_page_script.js` realiza una petición `fetch` a `traducion_api/get_test_text_data.php` con el ID del texto (por ejemplo, ID 1).
3.  **Obtención de Texto y Traducción**: `get_test_text_data.php` consulta la base de datos y devuelve el título, el contenido original (`content`) y la traducción (`content_translation`) del texto en formato JSON.
4.  **Procesamiento en Frontend**: `test_page_script.js` recibe estos datos:
    *   Actualiza el título en `<h1 class="titulo-lectura">`.
    *   Divide tanto el `content` original como el `content_translation` en frases utilizando la función `dividirEnFrases`.
    *   Calcula cuántas frases caben por página (`calcularFrasesPorPagina`).
    *   Muestra la primera página de frases (`mostrarPagina`), inyectando cada frase original en `<p class="paragraph">` y su traducción correspondiente (truncada a 20 palabras) en `<p class="texto-traduccion-original"></p>`.
5.  **Navegación**: Los botones "Anterior" y "Siguiente" permiten al usuario navegar entre las páginas de frases, y `mostrarPagina` se encarga de renderizar el contenido y su traducción para la página actual.

En este contexto, la "simultaneidad" se refiere a que la traducción ya está disponible en la base de datos junto con el texto original, y se carga y muestra al mismo tiempo que el texto original para cada frase, sin necesidad de una llamada adicional a una API de traducción externa en el momento de la lectura.
