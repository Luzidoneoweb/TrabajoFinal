# Documentación de Módulo de Práctica

Este documento detalla la estructura y funcionalidad de los archivos relacionados con el módulo de práctica, ubicados en las carpetas `practica/` y `practica/includes/`.

## `practica/includes/content_functions.php`

**Descripción:** Contiene funciones para el manejo de traducciones de contenido de textos.

**Funciones:**

*   `guardarTraduccionContenido($text_id, $content, $translation)`: Guarda la traducción de un fragmento de contenido para un texto específico.
*   `obtenerTraduccionContenido($text_id)`: Recupera la traducción de contenido para un texto dado.
*   `obtenerTextosConTraduccionesContenido($user_id = null, $limit = null)`: Obtiene una lista de textos con sus traducciones de contenido, opcionalmente filtrado por usuario y limitado.
*   `necesitaTraduccionContenido($text_id)`: Verifica si un texto necesita traducción de contenido (si no tiene una traducción existente).

## `practica/includes/practice_functions.php`

**Descripción:** Provee funciones comunes para el registro y gestión del progreso de la práctica.

**Funciones:**

*   `guardarProgresoPractica($user_id, $mode, $total_words, $correct_answers, $incorrect_answers, $text_id = null)`: Registra el progreso de una sesión de práctica, incluyendo el modo, palabras totales, respuestas correctas e incorrectas, y la precisión.
*   `guardarTiempoPractica($user_id, $mode, $duration)`: Guarda la duración de una sesión de práctica para un usuario y modo específicos.

## `practica/includes/title_functions.php`

**Descripción:** Contiene funciones para el manejo de traducciones de títulos de textos.

**Funciones:**

*   `guardarTraduccionTitulo($text_id, $title, $translation)`: Guarda la traducción de un título para un texto específico.
*   `obtenerTraduccionTitulo($text_id)`: Recupera la traducción del título para un texto dado.
*   `obtenerTextosConTraducciones($user_id = null, $limit = null)`: Obtiene una lista de textos con sus traducciones de título, opcionalmente filtrado por usuario y limitado.
*   `necesitaTraduccionTitulo($text_id)`: Verifica si un título de texto necesita traducción.

## `practica/includes/word_functions.php`

**Descripción:** Contiene funciones relacionadas con la obtención de palabras para la práctica.

**Funciones:**

*   `obtenerPalabrasAleatoriasPractica($user_id, $limit = 10)`: Obtiene un conjunto de palabras aleatorias guardadas por el usuario para ser utilizadas en la práctica.

## `practica/ajax_practice_content.php`

**Descripción:** Script PHP que genera la interfaz de usuario para la sección de práctica. Incluye lógica JavaScript para cargar los modos de práctica.

**Elementos Clave (HTML/JavaScript):**

*   `id="contenedor-practica"`: Contenedor principal de la interfaz de práctica.
*   `id="contenido-practica"`: Área donde se cargan dinámicamente los ejercicios de práctica.
*   `window.cargarModoPractica()`: Función global para inicializar el modo de práctica.
*   `cargarPracticaBasica()`: Función que verifica si hay palabras para practicar y muestra el selector de modo.
*   `mostrarSelectorModoPractica()`: Muestra las opciones para elegir el tipo de práctica (selección múltiple, escribir palabra, traducir frases).
*   `iniciarModoPractica(mode)`: Inicia el modo de práctica seleccionado.
*   `class="tarjeta-modo-practica"`: Clase CSS para las tarjetas de selección de modo de práctica.

## `practica/ajax_practice_data.php`

**Descripción:** Endpoint AJAX para obtener datos necesarios para la práctica, como palabras guardadas por el usuario.

**Parámetros/Respuestas:**

*   `GET['obtener_conteo_palabras']` y `GET['text_id']`: Devuelve el número de palabras guardadas para un texto específico (`conteo_palabras`).
*   Respuesta por defecto: Devuelve un array de palabras guardadas por el usuario (`palabras`) con su traducción y contexto.

## `practica/ajax_user_texts.php`

**Descripción:** Endpoint AJAX para listar los textos del usuario (propios y públicos leídos) que tienen palabras guardadas, utilizados para seleccionar el contenido de la práctica.

**Parámetros/Respuestas:**

*   `POST['accion'] = 'listar'`: Devuelve una lista de textos (`textos`) que el usuario puede practicar.
*   Variables internas: `id_usuario`, `tipo_texto` (`propio` o `publico`), `textos`.

## `practica/practice.php`

**Descripción:** Script PHP que maneja el guardado del progreso de la práctica.

**Parámetros/Respuestas:**

*   `POST['guardar_progreso_practica']`: Recibe los datos de progreso de una sesión de práctica (modo, total de palabras, respuestas correctas/incorrectas, precisión) y los guarda en la base de datos.
*   Variables internas: `id_usuario`, `modo`, `total_palabras`, `respuestas_correctas`, `respuestas_incorrectas`, `precision`.
