# Documentación del archivo `pestanas/php/multi-word-selection.js`

## Descripción
El archivo `multi-word-selection.js` implementa la funcionalidad de selección de múltiples palabras en el texto, similar a la característica de Readlang. Permite a los usuarios arrastrar el cursor sobre varias palabras para seleccionarlas, resaltarlas y obtener una traducción combinada. También gestiona la visualización de un tooltip con la traducción y la persistencia de las palabras traducidas.

## Clase `MultiWordSelector`

### Constructor (`constructor()`)
*   Inicializa las propiedades de estado:
    *   `isSelecting`: Booleano que indica si el usuario está actualmente seleccionando palabras.
    *   `selectedWords`: Array de elementos DOM de las palabras seleccionadas.
    *   `startElement`, `endElement`: Elementos DOM de inicio y fin de la selección.
    *   `selectionHighlight`: (No utilizado directamente en el código proporcionado, pero podría ser para un elemento de resaltado general).
    *   `tooltip`: Elemento DOM del tooltip de traducción.
    *   `tooltipTimeout`: ID del timeout para ocultar el tooltip automáticamente.
    *   `hasDragged`: Booleano que indica si el usuario ha arrastrado el ratón (distingue entre clic simple y selección).
    *   `startPosition`: Coordenadas iniciales del clic para detectar arrastre.
*   Llama a `init()` para configurar los *event listeners* y estilos.

### Métodos

#### 1. `init()`
*   **Propósito:** Configura los *event listeners* y añade los estilos CSS necesarios.
*   **Funcionamiento:**
    *   Llama a `addStyles()`.
    *   Añade *event listeners* para `mousedown`, `mousemove` y `mouseup` al `document`, utilizando *arrow functions* para mantener el contexto `this`.
    *   Añade un *event listener* para `click` al `document` para limpiar la selección y el tooltip al hacer clic fuera.

#### 2. `addStyles()`
*   **Propósito:** Inyecta estilos CSS dinámicamente en el `<head>` del documento para el resaltado de palabras.
*   **Funcionamiento:** Crea un elemento `<style>` con un ID `multi-word-selector-styles` y añade las reglas CSS para `.word-selection`, `.word-selection-start` y `.word-selection-end`. Evita añadir estilos duplicados.

#### 3. `onMouseDown(event)`
*   **Propósito:** Maneja el evento `mousedown` para iniciar una posible selección.
*   **Funcionamiento:**
    *   Ignora clics en elementos de interfaz (dropdowns, modales, botones, etc.).
    *   Solo activa la selección si el clic es en una palabra clickeable (`.clickable-word`, `.practice-word`) o dentro de un área de lectura/práctica.
    *   Establece `isSelecting` a `true`, guarda `startElement` y `startPosition`, y limpia cualquier selección anterior.
    *   Previene el comportamiento por defecto del navegador (selección de texto nativa).

#### 4. `onMouseMove(event)`
*   **Propósito:** Maneja el evento `mousemove` para actualizar la selección mientras el usuario arrastra.
*   **Funcionamiento:**
    *   Solo actúa si `isSelecting` es `true`.
    *   Ignora movimientos sobre elementos de interfaz.
    *   Detecta si el usuario ha arrastrado el ratón más allá de un umbral (`distance > 5`).
    *   Si el `target` del evento es diferente a `endElement`, actualiza `endElement` y llama a `updateSelection()`.

#### 5. `onMouseUp(event)`
*   **Propósito:** Maneja el evento `mouseup` para finalizar la selección y procesar la traducción.
*   **Funcionamiento:**
    *   Solo actúa si `isSelecting` es `true`.
    *   Ignora *mouseups* sobre elementos de interfaz.
    *   Si no hubo arrastre (`!this.hasDragged`), considera que es un clic simple, selecciona solo la palabra, la resalta y la traduce.
    *   Si hubo arrastre, llama a `updateSelection()` y `translateSelection()`.
    *   Establece `isSelecting` a `false`.

#### 6. `onDocumentClick(event)`
*   **Propósito:** Limpia la selección y oculta el tooltip si el usuario hace clic fuera de ellos.
*   **Funcionamiento:** Si el clic no fue en una palabra seleccionable ni en el tooltip, llama a `clearSelection()` y `hideTooltip()`.

#### 7. `detectAdjacentWords(clickedWord)` (No utilizada directamente en el flujo `onMouseUp` actual, pero es una función auxiliar)
*   **Propósito:** Intenta detectar si una palabra clickeada forma parte de una expresión de varias palabras.
*   **Funcionamiento:** Busca en una lista de `commonExpressions` (frases verbales, etc.) y devuelve un array de palabras si encuentra una coincidencia. Si no, devuelve solo la palabra clickeada.

#### 8. `findAdjacentExpression(allWords, clickedIndex)` (función auxiliar)
*   **Propósito:** Lógica interna para `detectAdjacentWords` para buscar expresiones de 2 o 3 palabras.

#### 9. `highlightSelection(words)`
*   **Propósito:** Aplica clases de resaltado a un array de palabras.
*   **Funcionamiento:** Itera sobre las palabras y aplica `word-selection`, `word-selection-start` o `word-selection-end` según la posición.

#### 10. `updateSelection()`
*   **Propósito:** Actualiza el resaltado de las palabras seleccionadas entre `startElement` y `endElement`.
*   **Funcionamiento:**
    *   Limpia cualquier selección anterior.
    *   Obtiene todos los elementos `clickable-word` o `practice-word` entre `startElement` y `endElement` utilizando `getElementsBetween()`.
    *   Aplica las clases de resaltado a estos elementos.

#### 11. `getElementsBetween(start, end)`
*   **Propósito:** Obtiene todos los elementos de palabra entre dos elementos dados dentro de un mismo contenedor.
*   **Funcionamiento:** Encuentra el contenedor común, obtiene todas las palabras dentro de él y devuelve un subconjunto basado en los índices de `start` y `end`.

#### 12. `highlightWord(element, position)`
*   **Propósito:** Aplica clases CSS de resaltado a un solo elemento de palabra.

#### 13. `clearSelection()`
*   **Propósito:** Elimina todas las clases de resaltado de palabras.

#### 14. `translateSelection()`
*   **Propósito:** Envía el texto seleccionado a la API de traducción y muestra el resultado en un tooltip.
*   **Funcionamiento:**
    *   Concatena el texto de `selectedWords`.
    *   Realiza una petición `fetch` (POST) a `traducion_api/translate.php`.
    *   Si la traducción es exitosa, llama a `showTooltip()` y, si `window.saveTranslatedWord` está disponible, guarda la palabra traducida con su contexto (`findSentenceContainingWords()`).
    *   Maneja errores y muestra mensajes apropiados en el tooltip.

#### 15. `findSentenceContainingWords()`
*   **Propósito:** Encuentra la frase completa que contiene las palabras seleccionadas.
*   **Funcionamiento:** Busca el párrafo padre de la primera palabra seleccionada, divide su texto en frases y busca la frase que contiene el texto seleccionado.

#### 16. `showTooltip(originalText, translation)`
*   **Propósito:** Muestra un tooltip con la traducción.
*   **Funcionamiento:**
    *   Crea un `div.multi-word-tooltip` y lo añade al `body`.
    *   Posiciona el tooltip utilizando `positionTooltip()`.
    *   Configura un `setTimeout` para ocultar el tooltip automáticamente después de 3 segundos.

#### 17. `positionTooltip()`
*   **Propósito:** Calcula y aplica la posición del tooltip para que aparezca debajo de la selección de palabras, ajustándose a los límites de la ventana.
*   **Funcionamiento:** Obtiene las coordenadas de las palabras seleccionadas y las dimensiones del tooltip para calcular una posición óptima (centrado horizontalmente, debajo de la selección, o arriba si no hay espacio abajo).

#### 18. `hideTooltip()`
*   **Propósito:** Oculta y elimina el tooltip del DOM.

#### 19. `destroy()`
*   **Propósito:** Limpia completamente el estado de la selección y el tooltip.

## Inicialización Global

### `window.initializeMultiWordSelector()`
*   **Propósito:** Inicializa una instancia de `MultiWordSelector` si no existe y si la página actual no es una página de práctica.
*   **Funcionamiento:** Verifica la URL y la pestaña activa para determinar si se debe inicializar el selector.

### Event Listeners
*   **`DOMContentLoaded`:** Llama a `window.initializeMultiWordSelector()` cuando el DOM está listo.
*   **`MutationObserver`:** Observa cambios en `#panelLectura`. Si se añaden nodos que contienen palabras clickeables y `window.multiWordSelector` no está inicializado, lo inicializa después de un breve retraso. Esto es crucial para contenido cargado dinámicamente.

## Archivos relacionados
*   `pestanas/lectura.php`: Incluye este script.
*   `pestanas/js/lectura.js`: Llama a `window.initializeMultiWordSelector()` para activar la selección de palabras.
*   `traducion_api/translate.php`: Endpoint PHP para realizar traducciones.
*   `pestanas/php/save_translated_word.php`: Endpoint PHP para guardar palabras traducidas.
*   `css/floating-menu.css`: Podría contener estilos adicionales para el tooltip.
