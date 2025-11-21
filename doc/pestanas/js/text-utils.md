# Documentación del archivo `pestanas/js/text-utils.js`

## Descripción
El archivo `text-utils.js` contiene funciones JavaScript de utilidad diseñadas para el procesamiento y manipulación de texto. Estas funciones son reutilizables y se utilizan en varias partes de la aplicación para tareas como dividir un texto largo en frases más cortas o truncar un texto a un número específico de palabras.

## Funciones Clave

### 1. `window.dividirEnFrases(texto, limitePalabras = 20)`
*   **Propósito:** Divide un texto largo en un array de frases, intentando mantener cada frase por debajo de un límite de palabras especificado y respetando los puntos finales.
*   **Parámetros:**
    *   `texto`: (string) El texto original que se desea dividir.
    *   `limitePalabras`: (number, opcional) El número máximo de palabras que debe contener cada fragmento de frase. Por defecto es 20.
*   **Funcionamiento:**
    *   Inicializa un array `frases` y una variable `textoRestante` con el texto original.
    *   Entra en un bucle `while` que continúa mientras haya `textoRestante`.
    *   En cada iteración, divide el `textoRestante` en palabras.
    *   Si el número de palabras es menor o igual al `limitePalabras`:
        *   Busca el primer punto final (`. `) en el `textoRestante`.
        *   Si encuentra un punto, toma el fragmento hasta ese punto y lo añade a `frases`, actualizando `textoRestante`.
        *   Si no encuentra un punto, toma todo el `textoRestante` como una frase.
    *   Si el número de palabras es mayor que `limitePalabras`:
        *   Toma las primeras `limitePalabras` para formar un fragmento.
        *   Busca un punto final dentro de este fragmento de 20 palabras.
        *   Si encuentra un punto, toma el fragmento hasta ese punto y lo añade a `frases`, actualizando `textoRestante`.
        *   Si no encuentra un punto, toma el fragmento de 20 palabras y lo añade a `frases`, y el resto de las palabras se convierten en el nuevo `textoRestante`.
    *   Finalmente, devuelve el array `frases`, filtrando cualquier frase vacía.

### 2. `window.truncarTexto(texto, limitePalabras)`
*   **Propósito:** Trunca un texto a un número máximo de palabras, añadiendo puntos suspensivos si el texto original excede el límite.
*   **Parámetros:**
    *   `texto`: (string) El texto original que se desea truncar.
    *   `limitePalabras`: (number) El número máximo de palabras permitidas.
*   **Funcionamiento:**
    *   Divide el texto en palabras.
    *   Si el número de palabras excede `limitePalabras`, toma solo las primeras `limitePalabras` y las une, añadiendo "..." al final.
    *   Si el texto no excede el límite, devuelve el texto original.

## Exportación Global
Ambas funciones (`dividirEnFrases` y `truncarTexto`) se asignan al objeto `window`, haciéndolas accesibles globalmente desde cualquier otro script de la aplicación.

## Archivos relacionados
*   `pestanas/js/lectura.js`: Es muy probable que utilice `dividirEnFrases` para preparar el contenido de los textos para la visualización paginada.
*   `pestanas/js/texto.js`: Podría utilizar `truncarTexto` para mostrar previsualizaciones de contenido en la lista de textos.
