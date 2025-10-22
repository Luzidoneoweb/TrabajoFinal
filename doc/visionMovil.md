# Visión Móvil: Funcionamiento del Menú y las Pestañas

Este documento explica cómo se implementa y funciona el menú de navegación y las pestañas en la vista móvil de la aplicación, asegurando una experiencia de usuario responsiva.

## 1. Componentes Principales

Los archivos clave que intervienen en el funcionamiento del menú móvil y las pestañas son:

*   **`index.php`**: Archivo principal que incluye los componentes de navegación y contenido.
*   **`php/menu_logueado.php`**: Contiene la navegación de usuario (`#navegacionUsuario`) con los botones de las pestañas.
*   **`php/menuMovil.php`**: Contiene el botón del menú móvil (`#botonMenuMovil`).
*   **`php/conten_logueado.php`**: Contiene los paneles de contenido de cada pestaña (`.panel-pestana`).
*   **`js/global.js`**: Contiene la lógica JavaScript para alternar el menú móvil y cambiar entre pestañas.
*   **`css/estilo.css`**: Define los estilos responsivos y el comportamiento visual del menú y las pestañas.

## 2. Estructura HTML (Relevante para Móvil)

### Botón del Menú Móvil (`php/menuMovil.php`)

```html
<button class="boton-menu-movil" id="botonMenuMovil" aria-label="Abrir menú móvil">
    <span></span>
    <span></span>
    <span></span>
</button>
```
Este botón es visible solo en pantallas pequeñas (definido en `css/estilo.css`).

### Navegación de Usuario (`php/menu_logueado.php`)

```html
<nav class="navegacion-usuario oculto" id="navegacionUsuario">
    <div class="pestanas-aplicacion">
        <button class="pestana activa" data-pestana="progreso">Progreso</button>
        <button class="pestana" data-pestana="textos">Mis Textos</button>
        <!-- ... más botones de pestañas ... -->
    </div>
    <div class="info-usuario">
        <span class="nombre-usuario">Usuario</span>
        <button class="boton-cerrar-sesion" id="botonCerrarSesion">Cerrar Sesión</button>
    </div>
</nav>
```
Esta navegación contiene los botones de las pestañas y la información del usuario. Por defecto, está oculta en móvil y se muestra al activar el menú.

## 3. Lógica JavaScript (`js/global.js`)

El archivo `js/global.js` maneja la interactividad:

*   **`botonMenuMovil.addEventListener('click', ...)`**:
    *   Detecta si el usuario está logueado (simulado por la visibilidad de `navegacionUsuario`).
    *   Alterna la clase `menu-abierto` en `navegacionUsuario` (si está logueado) o `navegacionPrincipal` (si no lo está). Esta clase es la que controla la visibilidad del menú en CSS.
*   **`pestana.addEventListener('click', ...)`**:
    *   Al hacer clic en un botón de pestaña, llama a `cambiarPestana()` para mostrar el contenido correspondiente.
    *   Cierra automáticamente el menú móvil (`navegacionUsuario.classList.remove('menu-abierto')`) después de seleccionar una pestaña, mejorando la usabilidad.
*   **`document.addEventListener('DOMContentLoaded', ...)`**:
    *   Inicializa el estado `usuarioLogueado` basándose en la visibilidad inicial de `navegacionUsuario` en el HTML.

## 4. Estilos Responsivos (`css/estilo.css`)

Las media queries son cruciales para la adaptación móvil:

*   **`@media (max-width: 768px)`**:
    *   **`.boton-menu-movil`**: Se establece `display: flex` para hacerlo visible.
    *   **`.navegacion-principal` y `.navegacion-usuario`**:
        *   Se posicionan absolutamente (`position: absolute; top: 100%; left: 0; right: 0;`).
        *   Se ocultan por defecto (`transform: translateY(-100%); opacity: 0; visibility: hidden;`).
        *   La clase `.menu-abierto` (activada por JavaScript) las hace visibles (`transform: translateY(0); opacity: 1; visibility: visible;`).
        *   Se configuran con `flex-direction: column`, `padding: 1rem`, `box-shadow` para un diseño de menú desplegable vertical.
        *   Para `.navegacion-usuario.menu-abierto`, se añade `display: flex`, `height: auto`, `max-height: 80vh` y `overflow-y: auto` para asegurar que el contenido sea visible y desplazable si es largo.
    *   **`.pestanas-aplicacion`**: Se establece `flex-direction: column` y `width: 100%` para que las pestañas se apilen verticalmente y ocupen todo el ancho disponible. También se le añade `display: flex`.
    *   **`.pestana`**: Se le da `width: 100%` y `display: block` para que cada botón de pestaña ocupe su propia línea.
    *   **`.info-usuario`**: También se configura con `flex-direction: column` y `align-items: stretch` para apilar sus elementos verticalmente.

## 5. Flujo de Interacción en Móvil

1.  En un dispositivo móvil, el menú de navegación principal y de usuario están ocultos, y el `#botonMenuMovil` es visible.
2.  Al hacer clic en `#botonMenuMovil`, `js/global.js` detecta el estado de `usuarioLogueado`.
3.  Si `usuarioLogueado` es `true`, se añade/elimina la clase `menu-abierto` a `#navegacionUsuario`. Si es `false`, se hace lo mismo con `#navegacionPrincipal`.
4.  Las reglas CSS en `estilo.css` hacen que el menú correspondiente se deslice hacia abajo y se haga visible.
5.  Dentro del menú de usuario, las pestañas se muestran como una lista vertical.
6.  Al hacer clic en una pestaña, `js/global.js` cambia el contenido del panel y cierra el menú móvil automáticamente.

Este diseño asegura que la navegación sea intuitiva y funcional tanto en pantallas grandes como en dispositivos móviles.
