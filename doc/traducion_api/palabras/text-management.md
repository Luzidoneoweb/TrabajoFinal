# Documentación del archivo `traducion_api/palabras/text-management.js`

## Descripción
El archivo `text-management.js` contiene funciones JavaScript que gestionan la interacción del usuario con el texto, específicamente para guardar palabras traducidas y controlar la visibilidad y el estado de los botones flotantes de lectura. También incluye funciones de utilidad para contar palabras y letras en un texto.

## Variables Globales
*   `window.isCurrentlyReading`: Booleano que indica si la aplicación está actualmente en modo de lectura.
*   `window.isCurrentlyPaused`: Booleano que indica si la lectura está pausada.
*   `window.lastReadParagraphIndex`: Almacena el índice del último párrafo leído.
*   `window.lastReadPageIndex`: Almacena el índice de la última página leída.

## Funciones Clave

### 1. `window.saveTranslatedWord(word, translation, sentence = '')`
*   **Propósito:** Guarda una palabra traducida en la base de datos.
*   **Funcionamiento:**
    *   Intenta obtener el `textId` del texto actual, priorizando `window.currentTextId`, luego `window.AppState.currentTextId`, y finalmente buscando en el DOM.
    *   Crea un objeto `FormData` con la palabra, su traducción, el contexto (frase) y el `textId`.
    *   Realiza una petición `fetch` (POST) a `traducion_api/palabras/save_translated_word.php`.
    *   Registra la respuesta del servidor y devuelve `true` si la operación fue exitosa, `false` en caso contrario.
    *   Incluye manejo de errores.

### 2. `window.showFloatingButton()`
*   **Propósito:** Muestra el menú flotante y el botón de reproducción flotante.
*   **Funcionamiento:**
    *   Establece el `display` de `#floating-menu` y `#floating-play` a 'block'.
    *   Aplica una transición de opacidad y transformación para una aparición suave.
    *   Si existe un botón de "continuar" (`#continue-btn-container`) y `window.lastReadParagraphIndex` es mayor que 0, también lo muestra.

### 3. `window.hideFloatingButton()`
*   **Propósito:** Oculta el menú flotante y el botón de reproducción flotante.
*   **Funcionamiento:** Establece el `display` de `#floating-menu` y `#floating-play` a 'none'.

### 4. `window.updateFloatingButton()`
*   **Propósito:** Actualiza el icono y el título del botón flotante de reproducción/pausa.
*   **Funcionamiento:**
    *   Si `window.isCurrentlyReading` es `true` y `window.isCurrentlyPaused` es `false`, el botón muestra "⏸️" (pausar).
    *   De lo contrario, muestra "▶️" (iniciar o continuar).

### 5. `window.continueFromLastParagraph()`
*   **Propósito:** Intenta reanudar la lectura desde el último párrafo leído.
*   **Funcionamiento:** Llama a `window.startReadingFromParagraph()` (se espera que esté definida en `pestanas/js/lectura.js`) con los índices del último párrafo y página leídos.

### 6. `loadPublicTexts()`
*   **Propósito:** Carga textos públicos en un contenedor específico.
*   **Funcionamiento:** Realiza una petición `fetch` a `index.php?show_public_texts=1` y inserta el HTML resultante en `#public-texts-container`. Los errores se manejan silenciosamente.

### 7. `window.countWordsInText(text)`
*   **Propósito:** Cuenta el número de palabras en una cadena de texto.
*   **Funcionamiento:** Elimina espacios extra, divide el texto por espacios y filtra elementos vacíos para obtener un conteo preciso.

### 8. `window.countLettersInText(text)`
*   **Propósito:** Cuenta el número de caracteres alfabéticos en una cadena de texto.
*   **Funcionamiento:** Utiliza una expresión regular para encontrar y contar solo letras (incluyendo acentos y ñ).

## Event Listeners y Lógica de Inicialización
*   **`DOMContentLoaded`:**
    *   Después de un retraso, aplica transiciones de opacidad y transformación a varios elementos de la UI (botones de subir texto, mis textos, textos públicos, botón de continuar) para una aparición suave.
*   **Botones de Subir Texto:**
    *   Los botones `#upload-text-btn` y `#upload-text-btn-user` están asociados a la función `showUploadForm()` (se espera que esté definida en `pestanas/js/subir_texto.js`).
*   **Botón "Volver a la lista":**
    *   El botón `#back-to-list` oculta el contenedor del formulario de subida y llama a `loadUserTexts()` (se espera que esté definida en `pestanas/js/texto.js`).

## Archivos relacionados
*   `pestanas/lectura.php`: Incluye este script.
*   `pestanas/js/lectura.js`: Interactúa con las variables globales de estado de lectura y las funciones de control de lectura.
*   `traducion_api/palabras/save_translated_word.php`: Endpoint PHP para guardar palabras traducidas.
*   `pestanas/js/subir_texto.js`: Se espera que defina `showUploadForm()`.
*   `pestanas/js/texto.js`: Se espera que defina `loadUserTexts()`.
*   `css/floating-menu.css`: Proporciona los estilos para los botones flotantes.
