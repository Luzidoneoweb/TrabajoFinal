# Documentación del archivo `traducion_api/lectura-translation-functions.js`

## Descripción
El archivo `lectura-translation-functions.js` contiene un conjunto de funciones JavaScript diseñadas para gestionar la traducción de frases y títulos de textos dentro de la aplicación. Incluye lógica para el almacenamiento en caché de traducciones en el cliente y la persistencia de estas traducciones en la base de datos a través de llamadas a la API.

## Variables Globales
*   `window.contentTranslationsCache`: Un objeto global utilizado como caché para almacenar traducciones de frases y evitar peticiones repetidas al servidor.

## Funciones Clave

### 1. `traducirFrase(fraseOriginal, textId)`
*   **Propósito:** Traduce una frase dada utilizando la API de traducción.
*   **Funcionamiento:**
    1.  **Verificación de Caché:** Primero, comprueba si la `fraseOriginal` ya existe en `window.contentTranslationsCache`. Si es así, devuelve la traducción almacenada.
    2.  **Petición a la API:** Si no está en caché, realiza una petición `fetch` (POST) a `traducion_api/translate.php` enviando la `fraseOriginal`.
    3.  **Manejo de Respuesta:**
        *   Si la respuesta es exitosa y contiene una traducción, la guarda en `window.contentTranslationsCache`.
        *   Llama a `guardarTraduccionEnBD()` de forma asíncrona (sin esperar su finalización) para persistir la traducción en la base de datos.
        *   Devuelve la traducción.
    4.  **Manejo de Errores:** Captura y registra cualquier error durante la petición o el procesamiento.

### 2. `guardarTraduccionEnBD(textId, content, translation)`
*   **Propósito:** Guarda una traducción de contenido (frase) en la base de datos.
*   **Funcionamiento:**
    *   Realiza una petición `fetch` (POST) a `traducion_api/save_content_translation.php` con el `textId`, `content` (frase original) y `translation`.
    *   Esta función no espera una respuesta, ya que su objetivo es solo enviar los datos para su almacenamiento.
    *   Incluye manejo de errores.

### 3. `cargarCacheTraducciones(textId)`
*   **Propósito:** Carga las traducciones de frases previamente guardadas para un `textId` específico desde la base de datos al caché local (`window.contentTranslationsCache`).
*   **Funcionamiento:**
    *   Realiza una petición `fetch` (GET) a `traducion_api/get_content_translation.php` con el `textId`.
    *   Si la respuesta es exitosa y contiene un array de traducciones, las itera y las almacena en `window.contentTranslationsCache`.
    *   Registra en consola el número de traducciones cargadas.
    *   Incluye manejo de errores.

### 4. `traducirTitulo(title, textId)`
*   **Propósito:** Traduce el título de un texto utilizando la API de traducción.
*   **Funcionamiento:**
    1.  **Petición a la API:** Realiza una petición `fetch` (POST) a `traducion_api/translate.php` enviando el `title`.
    2.  **Manejo de Respuesta:**
        *   Si la respuesta es exitosa y contiene una traducción, llama a `guardarTraduccionTituloEnBD()` para persistir la traducción del título.
        *   Devuelve la traducción.
    3.  **Manejo de Errores:** Captura y registra cualquier error.

### 5. `guardarTraduccionTituloEnBD(textId, title, translation)`
*   **Propósito:** Guarda la traducción de un título en la base de datos.
*   **Funcionamiento:**
    *   Realiza una petición `fetch` (POST) a `traducion_api/save_title_translation.php` con el `textId`, `title` (título original) y `title_translation`.
    *   Registra el éxito o error de la operación en consola.
    *   Incluye manejo de errores.

### 6. `guardarTraduccionCompletaEnBD(textId, contentTranslation)`
*   **Propósito:** Guarda la traducción completa de todo el contenido de un texto en la base de datos.
*   **Funcionamiento:**
    *   Realiza una petición `fetch` (POST) a `traducion_api/save_complete_translation.php` con el `textId` y `contentTranslation`.
    *   Registra el éxito o error de la operación en consola.
    *   Incluye manejo de errores.

### 7. `construirTextoCompletoTraducido(frasesTraduccion)`
*   **Propósito:** Concatena un array de frases traducidas para formar un texto completo.
*   **Funcionamiento:** Filtra las frases vacías y las une con un espacio.

## Exportación Global
Todas las funciones clave (`traducirFrase`, `guardarTraduccionEnBD`, `cargarCacheTraducciones`, `traducirTitulo`, `guardarTraduccionTituloEnBD`, `guardarTraduccionCompletaEnBD`, `construirTextoCompletoTraducido`) se exportan al objeto `window` para que sean accesibles globalmente desde otros scripts.

## Archivos relacionados
*   `pestanas/js/lectura.js`: Utiliza `traducirFrase`, `cargarCacheTraducciones`, `guardarTraduccionCompletaEnBD` y `construirTextoCompletoTraducido`.
*   `pestanas/js/texto.js`: Utiliza `traducirTitulo`.
*   `traducion_api/translate.php`: Endpoint PHP para realizar traducciones.
*   `traducion_api/save_content_translation.php`: Endpoint PHP para guardar traducciones de frases.
*   `traducion_api/get_content_translation.php`: Endpoint PHP para obtener traducciones de frases.
*   `traducion_api/save_title_translation.php`: Endpoint PHP para guardar traducciones de títulos.
*   `traducion_api/save_complete_translation.php`: Endpoint PHP para guardar la traducción completa del contenido.
