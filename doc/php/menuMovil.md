# Documentación del archivo `php/menuMovil.php`

## Descripción
El archivo `menuMovil.php` es un fragmento de código PHP que se incluye en `index.php`. Su única función es proporcionar el botón HTML para activar el menú de navegación móvil.

## Estructura HTML
El archivo contiene un único elemento `<button>` con las siguientes características:
*   **Clase:** `boton-menu-movil`
*   **ID:** `botonMenuMovil`
*   **Atributo `aria-label`:** "Abrir menú móvil" (para accesibilidad)
*   **Contenido:** Tres elementos `<span>` vacíos, que comúnmente se utilizan para crear el icono de "hamburguesa" de los menús móviles mediante CSS.

## Archivos relacionados
*   `index.php`: Este archivo incluye `menuMovil.php` dentro de la sección del encabezado principal.
*   `js/global.js` (o un archivo similar): Es muy probable que un script JavaScript (como `js/global.js`) esté asociado a este botón para manejar su funcionalidad, como abrir y cerrar el menú móvil al hacer clic.
*   `css/floating-menu.css` (o un archivo similar): Los estilos para el botón y el menú móvil en sí probablemente se definen en un archivo CSS.
