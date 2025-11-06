# Documentación del Sistema de Traducciones

Este documento detalla el funcionamiento general del sistema de traducciones en la aplicación, incluyendo las funciones y archivos clave que intervienen, y un esquema de la estructura de archivos.

## 1. Visión General del Sistema de Traducción

El sistema de traducción permite obtener traducciones de palabras, frases y textos completos, tanto para el contenido principal como para los títulos. Utiliza una API de traducción externa (a través de `translate.php`) y un sistema de caché y persistencia en base de datos para optimizar el rendimiento y guardar las traducciones para uso futuro.

El sistema se integra en diferentes partes de la aplicación, como el lector de textos, para proporcionar traducciones simultáneas y la gestión de vocabulario.

## 2. Archivos Principales Involucrados y sus Funciones

A continuación, se describen los archivos clave y sus responsabilidades dentro del sistema de traducción:

### Archivos PHP (Backend)

*   **`traducion_api/translate.php`**:
    *   **Función**: Es el *endpoint* principal que interactúa con una API de traducción externa. Recibe una palabra o frase en inglés y devuelve su traducción al español.
    *   **Intervención**: Es llamado por las funciones JavaScript de traducción (e.g., `traducirFrase`, `traducirTitulo`) para obtener las traducciones reales.

*   **`traducion_api/save_content_translation.php`**:
    *   **Función**: Guarda una traducción específica de una frase de contenido en la base de datos, asociándola a un `text_id`.
    *   **Intervención**: Es llamado por `lectura-translation-functions.js` después de obtener una nueva traducción de una frase.

*   **`traducion_api/save_title_translation.php`**:
    *   **Función**: Guarda la traducción de un título de texto en la base de datos.
    *   **Intervención**: Es llamado por `lectura-translation-functions.js` (a través de `traducirTitulo`) cuando se traduce un título por primera vez.

*   **`traducion_api/get_content_translation.php`**:
    *   **Función**: Recupera todas las traducciones de frases de contenido asociadas a un `text_id` específico desde la base de datos.
    *   **Intervención**: Es llamado por `lectura-translation-functions.js` (a través de `cargarCacheTraducciones`) para precargar el caché de traducciones al iniciar la lectura de un texto.

*   **`traducion_api/save_complete_translation.php`**:
    *   **Función**: Guarda la traducción completa de un texto (unida a partir de todas las frases traducidas) en la base de datos.
    *   **Intervención**: Es llamado por `pestanas/js/lectura.js` (a través de `window.guardarTextoCompletoTraducido`) cuando todas las frases de un texto han sido traducidas.

*   **`traducion_api/content_functions.php`**:
    *   **Función**: Contiene funciones PHP auxiliares relacionadas con el manejo de contenido y traducciones en la base de datos. Puede incluir lógica para insertar, actualizar o consultar traducciones.
    *   **Intervención**: Es incluido por otros scripts PHP para reutilizar la lógica de base de datos.

*   **`traducion_api/diccionario.php`**:
    *   **Función**: Probablemente gestiona la funcionalidad del diccionario de la aplicación, permitiendo a los usuarios buscar y guardar palabras.
    *   **Intervención**: Puede ser un *endpoint* para buscar definiciones o un script que maneje la interfaz del diccionario.

*   **`traducion_api/saved_words.php`**:
    *   **Función**: Muestra o gestiona las palabras que el usuario ha guardado en su diccionario personal.
    *   **Intervención**: Es un *endpoint* o un componente de interfaz para la sección de "Palabras Guardadas".

*   **`traducion_api/save_word.php`**:
    *   **Función**: Permite guardar una palabra individual (y su traducción) en el diccionario personal del usuario.
    *   **Intervención**: Es un *endpoint* llamado cuando el usuario decide guardar una palabra.

### Archivos JavaScript (Frontend)

*   **`traducion_api/lectura-translation-functions.js`**:
    *   **Función**: Contiene la lógica JavaScript específica para la traducción de frases en el contexto del lector de textos.
    *   **Intervención**:
        *   Define `window.contentTranslationsCache` para almacenar traducciones en el cliente.
        *   Implementa `traducirFrase()` para obtener traducciones (usando `translate.php`) y gestiona el caché.
        *   Implementa `cargarCacheTraducciones()` para precargar el caché desde la base de datos.
        *   Define `traducirTitulo()` para la traducción de títulos.
        *   Exporta estas funciones para que sean accesibles globalmente.

*   **`traducion_api/title-translation-functions.js`**:
    *   **Función**: Similar a `lectura-translation-functions.js` pero específicamente para la traducción de títulos. Aunque `lectura-translation-functions.js` ya incluye `traducirTitulo`, este archivo podría existir para una separación de responsabilidades o para un uso en otros contextos donde solo se necesite la traducción de títulos.
    *   **Intervención**: Podría contener funciones como `traducirTitulo` si no estuvieran ya en `lectura-translation-functions.js`, o funciones adicionales para la gestión de títulos.

*   **`pestanas/js/lectura.js`**:
    *   **Función**: Orquesta la visualización del texto y la integración con el motor de lectura y las funciones de traducción.
    *   **Intervención**:
        *   Llama a `cargarCacheTraducciones()` al inicio de la carga del texto.
        *   Utiliza `window.todasLasFrasesTraduccion` para almacenar las traducciones de las frases.
        *   Llama a `window.traducirFrase()` (a través de `lector/reading-engine.js::hablarActual()`) para obtener y mostrar la traducción de cada frase.
        *   Llama a `window.guardarTextoCompletoTraducido()` para guardar la traducción completa del texto.

*   **`lector/reading-engine.js`**:
    *   **Función**: El motor que controla la lectura de voz y el resaltado.
    *   **Intervención**: En su función `hablarActual()`, es donde se realiza la llamada a las funciones de traducción (`window.traducirFrase`) y se inserta la traducción obtenida en el DOM (`pTraduccion.textContent = traduccionFrase`).

## 3. Flujo de Traducción (Ejemplo: Traducción de una Frase en Lectura)

1.  **Solicitud de Lectura**: El usuario inicia la lectura de un texto en `pestanas/lectura.php`.
2.  **Carga del Texto**: `pestanas/js/lectura.js::cargarContenidoLectura()` obtiene el texto y precarga el caché de traducciones llamando a `traducion_api/lectura-translation-functions.js::cargarCacheTraducciones()`, que a su vez consulta `traducion_api/get_content_translation.php`.
3.  **Inicio de la Frase**: `lector/reading-engine.js::hablarActual()` se prepara para leer una frase.
4.  **Búsqueda de Traducción**: `hablarActual()` verifica si la traducción de la frase original ya existe en `window.todasLasFrasesTraduccion` o en `window.contentTranslationsCache`.
5.  **Traducción en Tiempo Real (si es necesario)**: Si la traducción no está en caché, `hablarActual()` llama a `traducion_api/lectura-translation-functions.js::traducirFrase(fraseOriginal, textId)`.
    *   `traducirFrase()` realiza una petición `fetch` a `traducion_api/translate.php` con la `fraseOriginal`.
    *   `translate.php` interactúa con la API de traducción externa y devuelve la traducción.
    *   `traducirFrase()` recibe la traducción, la guarda en `window.contentTranslationsCache` y llama a `traducion_api/save_content_translation.php` para persistirla en la base de datos.
6.  **Visualización**: `hablarActual()` recibe la `traduccionFrase` y la inserta en el elemento `<p class="texto-traduccion-original">` correspondiente en el DOM.
7.  **Lectura de Voz**: `hablarActual()` inicia la reproducción de voz de la `fraseOriginal`.
8.  **Guardado Completo**: Una vez que todas las frases de un texto han sido traducidas (ya sea desde el caché o en tiempo real), `pestanas/js/lectura.js` llama a `window.guardarTextoCompletoTraducido()`, que a su vez llama a `traducion_api/save_complete_translation.php` para guardar la versión completa del texto traducido.

## 4. Esquema de Archivos (Directorio `traducion_api/`)

```
traducion_api/
├── translate.php                       # Endpoint para la API de traducción externa
├── lectura-translation-functions.js    # Funciones JS para traducción en el lector
├── title-translation-functions.js      # Funciones JS para traducción de títulos (puede estar integrado en lectura-translation-functions.js)
├── save_content_translation.php        # Guarda traducciones de frases de contenido en BD
├── save_title_translation.php          # Guarda traducciones de títulos en BD
├── get_content_translation.php         # Obtiene traducciones de frases de contenido desde BD
├── save_complete_translation.php       # Guarda la traducción completa de un texto en BD
├── content_functions.php               # Funciones PHP auxiliares para manejo de contenido/traducciones
├── diccionario.php                     # Lógica para el diccionario (búsqueda, etc.)
├── saved_words.php                     # Lógica para mostrar palabras guardadas por el usuario
├── save_word.php                       # Lógica para guardar palabras individuales
├── ESPECIFICACION_TRADUCCIONES.md      # Documentación existente sobre especificaciones de traducciones
├── SISTEMA_TRADUCCION.md               # Documentación existente sobre el sistema de traducción
└── DOCUMENTACION_LECTURA_TRADUCCION.md # Documento creado anteriormente sobre lectura y traducción
