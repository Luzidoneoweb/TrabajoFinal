# Marcado de Palabras Individuales

Este documento describe el funcionamiento del sistema de traducción de palabras individuales, incluyendo su activación, proceso de traducción y guardado para práctica posterior.

## Activación

El usuario puede traducir palabras individuales haciendo clic sobre cualquier palabra en el texto en la pestaña de lectura. Este comportamiento se activa mediante event listeners en JavaScript que detectan los clics sobre elementos de texto.

```javascript
// En js/content-translation-functions.js
document.addEventListener('click', handleWordClick);
```

## Flujo de Traducción

1. Cuando se hace clic en una palabra:
   - Se captura el texto seleccionado
   - Se envía una petición AJAX a `translate.php`
   - Se recibe la traducción del servidor

2. El servidor procesa la petición:
   - Consulta primero el diccionario local
   - Si no encuentra la palabra, usa la API externa
   - Devuelve la traducción en formato JSON

## Visualización

La traducción se muestra en un tooltip flotante cerca de la palabra seleccionada:

- Aparece inmediatamente después del clic
- Muestra la traducion de la palabra original.
- automaticamente se guarda la palabra para el usuario
  -cuando la palabra pierde foco  Cerrar el tooltip
  - Ver más detalles (si están disponibles)

## Guardado para Práctica

Las palabras traducidas se  guatda para práctica posterior:

. Se invoca `saveTranslatedWord()`:
```javascript
function saveTranslatedWord(word, translation) {
    $.post('save_content_translation.php', {
        word: word,
        translation: translation
    });
}
```
3. La palabra se almacena en la base de datos `saved_words`

## Estructura de Base de Datos

```sql
CREATE TABLE saved_words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(100),
    translation TEXT,
    date_saved TIMESTAMP
);
```

## Archivos Relacionados

- `translate.php`: API principal de traducción
- `js/content-translation-functions.js`: Funciones de traducción
- `js/floating-menu.js`: Gestión del tooltip
- `save_content_translation.php`: Guardado de palabras
- `css/floating-menu.css`: Estilos del tooltip