# Notaciones y Símbolos Comunes en Documentación Técnica

Este documento describe notaciones y símbolos comunes utilizados en la documentación técnica y el desarrollo de software para mejorar la claridad y la comprensión.

## 1. Notaciones de Archivos y Directorios

*   **`nombre_archivo.ext`**: Se utiliza para referirse a un archivo específico.
    *   Ejemplo: `index.php`, `style.css`, `script.js`.
*   **`nombre_directorio/`**: Se utiliza para referirse a un directorio.
    *   Ejemplo: `css/`, `js/`, `db/`.
*   **`ruta/a/archivo.ext`**: Ruta relativa a un archivo.
    *   Ejemplo: `traducion_api/translate.php`, `pestanas/js/lectura.js`.
*   **`../`**: Representa el directorio padre.
    *   Ejemplo: `../db/conexion.php` (el archivo `conexion.php` está en el directorio `db`, que es un nivel superior al directorio actual).
*   **`./`**: Representa el directorio actual (a menudo implícito y se puede omitir).
    *   Ejemplo: `./script.js` es lo mismo que `script.js` si está en el mismo directorio.
*   **`$_SERVER['DOCUMENT_ROOT']`**: En PHP, representa la raíz del documento del servidor web.
    *   Ejemplo: `$_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php'`.

## 2. Notaciones de Código

*   **`código_inline`**: Se utiliza para referirse a fragmentos de código, nombres de variables, funciones, clases o cualquier elemento de código dentro de una línea de texto.
    *   Ejemplo: La función `traducirFrase` se encuentra en `lectura-translation-functions.js`.
*   **```bloque_de_código```**: Se utiliza para bloques de código más grandes, a menudo con resaltado de sintaxis.
    ```php
    <?php
    session_start();
    require_once '../db/conexion.php';
    ?>
    ```
*   **`window.nombreVariable`**: Indica una variable global accesible a través del objeto `window` en JavaScript.
    *   Ejemplo: `window.contentTranslationsCache`, `window.API_BASE_URL`.
*   **`nombreFuncion()`**: Se refiere a una función o método.
    *   Ejemplo: `detectLanguage()`, `MotorLectura.iniciar()`.
*   **`nombreClase` / `nombreObjeto`**: Se refiere a una clase o un objeto.
    *   Ejemplo: `MotorLectura`, `SpeechSynthesisUtterance`.
*   **`$variable_php`**: Indica una variable en PHP.
    *   Ejemplo: `$deepl_api_key`, `$_POST['text']`.
*   **`::`**: Operador de resolución de ámbito en PHP, utilizado para acceder a miembros estáticos o constantes de una clase.
    *   Ejemplo: `PDO::FETCH_ASSOC`.
*   **`->`**: Operador de objeto en PHP, utilizado para acceder a propiedades o métodos de un objeto.
    *   Ejemplo: `$stmt->execute()`.

## 3. Notaciones de Bases de Datos

*   **`nombre_tabla`**: Se refiere a una tabla en la base de datos.
    *   Ejemplo: `texts`, `users`.
*   **`nombre_columna`**: Se refiere a una columna dentro de una tabla.
    *   Ejemplo: `id`, `content_translation`, `user_id`.
*   **`PDO`**: Objeto de Datos PHP, una interfaz para acceder a bases de datos en PHP.
*   **`SQL`**: Lenguaje de Consulta Estructurado, utilizado para interactuar con bases de datos.

## 4. Notaciones de Red y APIs

*   **`Endpoint`**: Una URL específica a la que se envían las peticiones en una API.
    *   Ejemplo: `https://api-free.deepl.com/v2/translate`.
*   **`GET` / `POST`**: Métodos HTTP utilizados para las peticiones web.
*   **`JSON`**: JavaScript Object Notation, un formato ligero de intercambio de datos.
*   **`API Key`**: Una clave única utilizada para autenticarse y autorizar el acceso a una API.
*   **`CDN`**: Content Delivery Network, una red de servidores que distribuyen contenido web para mejorar la velocidad de carga.

## 5. Símbolos Comunes

*   **`//`**: Comentario de una sola línea en JavaScript o PHP.
*   **`/* ... */`**: Bloque de comentario en JavaScript o PHP.
*   **`#`**: Encabezado en Markdown.
*   **`*` o `-`**: Elemento de lista en Markdown.
*   **`**texto**` o `__texto__`**: Texto en negrita en Markdown.
*   **`*texto*` o `_texto_`**: Texto en cursiva en Markdown.
*   **`[texto del enlace](URL)`**: Enlace en Markdown.
*   **`->`**: Indica un flujo o una consecuencia.
*   **`=>`**: En JavaScript, se utiliza para funciones flecha. En PHP, para asociar claves con valores en arrays.
*   **`===`**: Operador de igualdad estricta en JavaScript (valor y tipo).
*   **`!==`**: Operador de desigualdad estricta en JavaScript.
*   **`??`**: Operador de fusión de nulos en PHP y JavaScript.
*   **`||`**: Operador lógico OR.
*   **`&&`**: Operador lógico AND.
*   **`!`**: Operador lógico NOT.
*   **`?`**: En PHP, se utiliza como marcador de posición en sentencias preparadas de SQL. En JavaScript, para el operador ternario o encadenamiento opcional.
*   **`:`**: En PHP, se utiliza para indicar el tipo de retorno de una función o para etiquetas. En JavaScript, en objetos literales.
*   **`{ ... }`**: Bloque de código, objeto literal en JavaScript, o array asociativo en PHP.
*   **`[ ... ]`**: Array en JavaScript o PHP.
*   **`()`**: Llamada a función, agrupación de expresiones.
*   **`;`**: Terminador de sentencia en JavaScript y PHP.
