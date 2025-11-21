# Documentación del archivo `js/global.js`

## Descripción
El archivo `global.js` contiene funciones y lógica JavaScript que son fundamentales para la interactividad y el comportamiento general de la aplicación. Se encarga de gestionar el estado de la sesión del usuario, actualizar la interfaz de usuario en función de si el usuario está logueado o no, manejar la navegación entre pestañas y otras funcionalidades globales.

## Variables Globales
*   `usuarioLogueado`: Booleano que indica si el usuario ha iniciado sesión.
*   `rememberedIdentifier`: Almacena el nombre de usuario recordado (si aplica).
*   `encabezadoPrincipal`: Referencia al elemento DOM del encabezado principal.
*   `contenidoPrincipal`: Referencia al elemento DOM del contenido principal.
*   `alturaEncabezadoPrincipal`: Almacena la altura del encabezado principal para ajustar el `padding-top` del contenido.

## Funciones Clave

### 1. `window.verificarEstadoSesion()`
*   **Propósito:** Verifica el estado de la sesión del usuario con el servidor y actualiza la interfaz de usuario.
*   **Funcionamiento:**
    *   Realiza una petición `fetch` a `php/login_seguridad/verificar_sesion.php`.
    *   Actualiza `usuarioLogueado` y `window.rememberedIdentifier` según la respuesta del servidor.
    *   Actualiza el nombre de usuario visible en la interfaz.
    *   Llama a `mostrarInterfazLogueada()` o `mostrarInterfazNoLogueada()` según el estado de la sesión.
    *   Incluye manejo de errores para problemas de red o del servidor.

### 2. `window.toggleEncabezadoPrincipal(ocultar)`
*   **Propósito:** Alterna la visibilidad del encabezado principal y ajusta el `padding-top` del contenido principal.
*   **Parámetro:** `ocultar` (booleano) - si es `true`, oculta el encabezado; si es `false`, lo muestra.

### 3. `mostrarInterfazLogueada()`
*   **Propósito:** Muestra los elementos de la interfaz de usuario destinados a usuarios logueados y oculta los de no logueados.
*   **Acciones:** Oculta `navegacionPrincipal` y `paginaInicio`, muestra `navegacionUsuario` y `contenidoAplicacion`, y muestra el botón de cerrar sesión en el encabezado.

### 4. `mostrarInterfazNoLogueada()`
*   **Propósito:** Muestra los elementos de la interfaz de usuario destinados a usuarios no logueados y oculta los de logueados.
*   **Acciones:** Muestra `navegacionPrincipal` y `paginaInicio`, oculta `navegacionUsuario` y `contenidoAplicacion`, y oculta el botón de cerrar sesión en el encabezado.

### 5. `cerrarSesion()`
*   **Propósito:** Cierra la sesión del usuario.
*   **Funcionamiento:**
    *   Realiza una petición `fetch` (POST) a `php/login_seguridad/logout.php`.
    *   Si la petición es exitosa, actualiza `usuarioLogueado` a `false`, limpia `rememberedIdentifier` y llama a `mostrarInterfazNoLogueada()`.
    *   Incluye manejo de errores para asegurar que la sesión se cierre localmente incluso si hay problemas de red o del servidor.

## Event Listeners y Lógica de Inicialización
*   **`DOMContentLoaded`:**
    *   Llama a `verificarEstadoSesion()` al cargar el DOM.
    *   Maneja la activación de pestañas basada en parámetros de URL (`?tab=`) o en `localStorage` (`activeTabAfterRedirect`), con "progreso" como pestaña por defecto.
*   **`load`:**
    *   Ajusta el `padding-top` del `contenidoPrincipal` para compensar la altura del encabezado principal, asegurando que el contenido no quede oculto debajo del encabezado.
*   **Botones de Cerrar Sesión:**
    *   Asigna la función `cerrarSesion` a todos los elementos con la clase `boton-cerrar-sesion`.
*   **Menú Móvil:**
    *   El `botonMenuMovil` alterna la clase `menu-abierto` en `navegacionUsuario` o `navegacionPrincipal` (dependiendo del estado de `usuarioLogueado`) para mostrar/ocultar el menú móvil.
*   **Navegación Suave:**
    *   Los enlaces con la clase `enlace-menu` (en la navegación principal) implementan un desplazamiento suave (`scrollIntoView({ behavior: 'smooth' })`) a la sección correspondiente de la página. También cierran el menú principal si está abierto.

## Archivos relacionados
*   `index.php`: Incluye este script.
*   `php/login_seguridad/verificar_sesion.php`: Endpoint PHP para verificar el estado de la sesión.
*   `php/login_seguridad/logout.php`: Endpoint PHP para cerrar la sesión.
*   `php/menuMovil.php`: Contiene el botón del menú móvil.
*   `php/menu_logueado.php`: Contiene la navegación para usuarios logueados.
*   `php/conten_logueado.php`: Contiene el contenido de las pestañas para usuarios logueados.
*   `pestanas/js/global.js`: Este archivo también se llama `global.js` pero está en el directorio `pestanas/js/`. Es importante diferenciarlo, ya que este `js/global.js` es el global de la aplicación, mientras que el otro es global para las pestañas.
