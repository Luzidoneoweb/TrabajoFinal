# Documentación del archivo `php/menu_logueado.php`

## Descripción
El archivo `menu_logueado.php` es un fragmento de código PHP que se incluye en `index.php`. Define la estructura de navegación principal para los usuarios que han iniciado sesión en la aplicación. Consiste en un conjunto de botones que actúan como pestañas para diferentes secciones de la aplicación.

## Estructura HTML
El archivo contiene un elemento `<nav>` con la clase `navegacion-usuario` y el ID `navegacionUsuario`. Dentro de este, hay un `div` con la clase `pestanas-aplicacion` que contiene los botones de las pestañas:

*   **Botones de Pestaña:**
    *   `<button class="pestana" data-pestana="progreso">Progreso</button>`
    *   `<button class="pestana" data-pestana="textos">Mis Textos</button>`
    *   `<button class="pestana" data-pestana="palabras">Palabras</button>`
    *   `<button class="pestana" data-pestana="biblioteca">Biblioteca</button>`
    *   `<button class="pestana" data-pestana="practicas">Practicar</button>`
    *   `<button class="pestana" data-pestana="subirTexto">⬆Subir </button>`
    Cada botón tiene un atributo `data-pestana` que probablemente se utiliza en JavaScript para identificar qué contenido debe mostrarse al hacer clic en la pestaña.

*   **Botón de Cerrar Sesión Móvil:**
    *   Dentro de un `div` con la clase `cerrarsesionmovil`, se encuentra un botón `<button class="boton-cerrar-sesion" id="botonCerrarSesion">Cerrar Sesión</button>`. Este botón es una duplicación del botón de cerrar sesión principal, diseñado para ser visible en el menú móvil.

## Funcionalidad
Este menú permite a los usuarios logueados navegar entre las diferentes secciones de la aplicación, como su progreso, textos subidos, palabras guardadas, la biblioteca de textos, la sección de prácticas y la opción para subir nuevos textos.

## Archivos relacionados
*   `index.php`: Este archivo incluye `menu_logueado.php` en la sección del encabezado principal.
*   `js/global.js`: Es muy probable que este archivo JavaScript contenga la lógica para manejar el cambio de pestañas (la función `cambiarPestana`) y la funcionalidad del botón de cerrar sesión.
*   `php/conten_logueado.php`: Este archivo (incluido en `index.php` después de `menu_logueado.php`) contendrá el contenido real de cada pestaña, que se mostrará u ocultará mediante JavaScript.
*   `pestanas/css/global_pestanas.css`: Este archivo CSS probablemente define los estilos para las pestañas y su comportamiento visual.
