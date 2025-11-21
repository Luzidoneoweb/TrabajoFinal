# Documentación del archivo `index.php`

## Descripción
El archivo `index.php` es el punto de entrada principal de la aplicación. Se encarga de cargar la estructura HTML básica de la página, incluir los archivos CSS y JavaScript globales, y gestionar la visualización del contenido según el estado de autenticación del usuario (logueado o no logueado).

## Archivos CSS incluidos
*   `css/global_estilos.css`: Estilos globales de la aplicación.
*   `pestanas/css/global_pestanas.css`: Estilos globales específicos para las pestañas de la aplicación.
*   `https://fonts.googleapis.com/icon?family=Material+Icons`: Iconos de Material Design de Google.

## Archivos PHP incluidos
*   `php/login_seguridad/seguridad.php`: Este archivo se incluye al principio y probablemente gestiona la seguridad de la sesión, verificando si el usuario está autenticado.
*   `php/menuMovil.php`: Incluye el menú de navegación para dispositivos móviles.
*   `php/menu_logueado.php`: Incluye el menú de navegación que se muestra cuando el usuario está logueado.
*   `php/conten_logueado.php`: Incluye el contenido principal que se muestra cuando el usuario está logueado (probablemente el sistema de pestañas).
*   `php/login_seguridad/modal_login.php`: Incluye el modal de inicio de sesión/registro.

## Archivos JavaScript incluidos
*   `js/global.js`: Contiene funciones JavaScript globales utilizadas en toda la aplicación.
*   `js/login_registos/auth_auntentif.js`: Gestiona la autenticación de usuarios, incluyendo el inicio y cierre de sesión, y la lógica de registro.

## Estructura y Lógica Principal
1.  **Cabecera (`<head>`):** Define metadatos, título de la página e incluye los archivos CSS.
2.  **Cuerpo (`<body>`):**
    *   Incluye `php/login_seguridad/seguridad.php` para la gestión de la sesión.
    *   **Encabezado principal (`<header>`):** Contiene el logo, un contenedor para el botón de cerrar sesión (oculto por defecto), la navegación principal (oculta por defecto para usuarios no logueados) y el menú móvil.
    *   **Contenido principal (`<main>`):**
        *   **Página de inicio (`#paginaInicio`):** Visible cuando el usuario no está logueado. Contiene secciones como "Hero", "Espacios publicitarios", "Características", "Testimonios", "Precios" y "Acerca de MiApp".
        *   **Contenido de usuario logueado (`#contenidoLogueado`):** Visible cuando el usuario está logueado. Incluye `php/conten_logueado.php`, que a su vez gestiona las diferentes pestañas de la aplicación.
    *   **Pie de página (`<footer>`):** Contiene información de copyright y enlaces de privacidad/términos.
    *   **Modal de inicio de sesión (`php/login_seguridad/modal_login.php`):** Se incluye al final del `<body>`.
    *   **Scripts JavaScript:** Incluye `js/global.js` y `js/login_registos/auth_auntentif.js` para la interactividad de la página.

## Funcionalidades Clave
*   **Autenticación:** La aplicación distingue entre usuarios logueados y no logueados, mostrando diferentes interfaces.
*   **Navegación:** Proporciona un menú principal y un menú móvil.
*   **Contenido Dinámico:** El contenido principal cambia dinámicamente según el estado de autenticación del usuario.
*   **Traducción y Aprendizaje:** La sección de inicio sugiere funcionalidades de traducción y práctica de idiomas.
