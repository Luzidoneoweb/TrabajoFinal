# Documentación del archivo `pestanas/textos.php`

## Descripción
El archivo `textos.php` es un fragmento de código PHP y HTML que se incluye en `php/conten_logueado.php`. Su función principal es mostrar la interfaz de usuario para la gestión de los textos del usuario, incluyendo la lista de textos, opciones de acciones en lote (como eliminar), y un visor para el contenido de los textos. Es la interfaz que interactúa con `pestanas/php/get_textos.php` para cargar los datos.

## Lógica PHP
*   `require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/php/login_seguridad/seguridad.php';`: Incluye el archivo de seguridad para asegurar que las funciones de seguridad estén disponibles.

## Estructura HTML
El archivo se organiza en un contenedor principal (`.contenedor-textos`) que incluye:

### 1. Notificación Flotante (`#notificacion-flotante`)
*   Un `div` para mostrar mensajes de notificación al usuario.

### 2. Encabezado de Textos (`.encabezado-textos`)
*   **Contador de Textos (`.contador-textos`):** Un párrafo que muestra cuántos textos se han encontrado. Este valor se actualiza dinámicamente con JavaScript.
*   **Grupo de Acciones (`.acciones-grupo`):**
    *   **Desplegable de Acciones (`.desplegable-acciones`):** Un botón que al hacer clic muestra un menú desplegable con opciones como "Marcar como leído", "Marcar como no leído" y "Eliminar" (`#btn-eliminar-textos`).
    *   **Botón de Textos Públicos (`.btn-publicos`):** Un botón para filtrar o gestionar textos públicos.

### 3. Lista de Textos (`.lista-textos`)
*   Un `div` vacío que será poblado dinámicamente con los textos del usuario mediante JavaScript. Aquí es donde se renderizan los elementos individuales de texto.

### 4. Visor de Texto (`.visor-texto`)
*   Un `div` vacío destinado a mostrar el contenido completo de un texto cuando el usuario lo selecciona de la lista.

## Archivos JavaScript incluidos
*   `pestanas/js/global.js`: Contiene funciones globales para la gestión de pestañas y otras utilidades.
*   `traducion_api/lectura-translation-functions.js`: Scripts relacionados con las funciones de traducción para la lectura.
*   `pestanas/js/text-utils.js`: Utilidades para el manejo de texto.
*   `pestanas/js/texto.js`: **Este es el script principal que interactúa con `pestanas/php/get_textos.php` para cargar y mostrar los textos.** También maneja la lógica de clic en los textos, la eliminación y la traducción de títulos.

## Archivos PHP relacionados
*   `php/conten_logueado.php`: Incluye este archivo para mostrar el contenido de la pestaña "Mis Textos".
*   `pestanas/php/get_textos.php`: Es el endpoint PHP al que `pestanas/js/texto.js` hace la petición `fetch` para obtener la lista de textos del usuario.
*   `pestanas/php/eliminar_textos.php`: Es el endpoint PHP al que `pestanas/js/texto.js` hace la petición `fetch` para eliminar textos seleccionados.
*   `php/login_seguridad/seguridad.php`: Proporciona funciones de seguridad.

## Relevancia para el error `net::ERR_INTERNET_DISCONNECTED`
El error original se produce en `texto.js` en la línea 10, que corresponde a la llamada `fetch('pestanas/php/get_textos.php', ...)`. Esto confirma que el problema no es de ruta incorrecta en el código, sino de la incapacidad del navegador para conectar con el servidor donde se encuentra `get_textos.php`. La solución debe centrarse en asegurar que el servidor local (XAMPP) esté funcionando y sea accesible.
