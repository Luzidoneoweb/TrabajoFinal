# Documentación del archivo `php/conten_logueado.php`

## Descripción
El archivo `conten_logueado.php` es un fragmento de código PHP que se incluye en `index.php` cuando un usuario ha iniciado sesión. Su propósito principal es estructurar y cargar el contenido dinámico de las diferentes pestañas de la aplicación, como "Progreso", "Mis Textos", "Palabras", "Biblioteca", "Prácticas" y "Subir Texto", y "Lectura".

## Estructura HTML y Lógica de Inclusión
El archivo define una sección principal (`<section class="contenido-aplicacion" id="contenidoAplicacion">`) que contiene múltiples `div` con la clase `panel-pestana`. Cada uno de estos `div` representa el contenido de una pestaña específica y se identifica mediante un `id` único (ej. `panelProgreso`, `panelTextos`).

Dentro de cada `panel-pestana`, se incluye un archivo PHP correspondiente que contiene el HTML y la lógica específica para esa sección. La inclusión se realiza utilizando `include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/[nombre_pestana].php';`, lo que asegura que la ruta sea absoluta y funcione correctamente independientemente de dónde se incluya `conten_logueado.php`.

Las pestañas y sus archivos PHP incluidos son:

*   **Progreso:** `pestanas/progreso.php`
*   **Mis Textos:** `pestanas/textos.php`
*   **Palabras:** `pestanas/palabras.php`
*   **Biblioteca:** `pestanas/biblioteca.php`
*   **Prácticas:** `pestanas/practicas.php`
*   **Subir Texto:** `pestanas/subir_texto.php`
*   **Lectura:** `pestanas/lectura.php`

## Archivos JavaScript relacionados
*   `pestanas/js/global.js`: Este script se incluye al final del archivo y es fundamental para la interactividad de las pestañas. Probablemente contiene la lógica para mostrar y ocultar los `panel-pestana` basándose en la pestaña activa, así como otras funciones globales específicas de las pestañas.

## Funcionalidad Clave
*   **Organización del Contenido:** Centraliza la inclusión de los diferentes módulos de la aplicación para usuarios logueados.
*   **Sistema de Pestañas:** Trabaja en conjunto con `php/menu_logueado.php` (que define los botones de las pestañas) y `pestanas/js/global.js` (que maneja la lógica de visualización) para crear una interfaz de usuario basada en pestañas.
*   **Carga de Módulos:** Cada pestaña carga su propio archivo PHP, lo que permite una modularidad y una gestión más sencilla del código para cada sección de la aplicación.
