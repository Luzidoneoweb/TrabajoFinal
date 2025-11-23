# Proceso de Login y Carga Dinámica de Contenido

Este documento explica cómo funciona el proceso de inicio de sesión y cómo se muestra el contenido para usuarios logueados en la aplicación.

## 1. Flujo de Inicio de Sesión

El proceso de inicio de sesión se gestiona principalmente a través de un modal y una combinación de JavaScript y PHP.

### Archivos Involucrados:
*   `index.php`: Página principal que incluye el botón de login y el modal.
*   `php/login_seguridad/modal_login.php`: Contiene la estructura HTML del modal de login y registro.
*   `js/login_registos/auth_auntentif.js`: Maneja la lógica del frontend para abrir/cerrar el modal, cambiar entre pestañas de login/registro y enviar las credenciales.
*   `php/login_seguridad/login.php`: Script PHP que procesa las credenciales enviadas, verifica el usuario en la base de datos e inicia la sesión.
*   `php/login_seguridad/verificar_sesion.php`: Script PHP que verifica el estado actual de la sesión del usuario.
*   `js/global.js`: Contiene la función `verificarEstadoSesion()` que se ejecuta al cargar la página y después de un login exitoso para actualizar la interfaz de usuario.

### Pasos del Proceso:

1.  **Activación del Modal:**
    *   En `index.php`, el botón "Iniciar Sesión" (`id="botonLogin"`) es el disparador.
    *   Cuando el usuario hace clic en este botón, el script `js/login_registos/auth_auntentif.js` detecta el evento.
    *   Este script cambia el estilo del modal (`id="authModal"`, incluido desde `php/login_seguridad/modal_login.php`) de `display: none` a `display: block`, haciéndolo visible.

2.  **Envío de Credenciales:**
    *   Dentro del modal, el usuario introduce su email/nombre de usuario y contraseña en el formulario de login (`id="loginForm"`).
    *   Al enviar el formulario, `auth_auntentif.js` intercepta el evento `submit`.
    *   En lugar de una recarga de página, `auth_auntentif.js` realiza una petición `fetch` (AJAX) de tipo `POST` a `php/login_seguridad/login.php`, enviando las credenciales del formulario.

3.  **Verificación en el Servidor:**
    *   `php/login_seguridad/login.php` recibe la petición `POST`.
    *   Incluye `seguridad.php` para funciones de seguridad y limpieza de datos.
    *   Se conecta a la base de datos y busca un usuario que coincida con el `identifier` (email o nombre de usuario) proporcionado.
    *   Si encuentra el usuario, verifica la contraseña proporcionada con la contraseña hasheada almacenada en la base de datos utilizando `verificar_password()`.
    *   Si las credenciales son correctas:
        *   Se regenera el ID de sesión (`session_regenerate_id(true)`).
        *   Se almacenan los datos del usuario (`user_id`, `username`, `email`, `is_admin`) en la variable `$_SESSION`.
        *   Si el usuario marcó "Recordarme", se genera y guarda un token de "recordarme" en la base de datos y se establece una cookie en el navegador.
        *   Devuelve una respuesta JSON con `success: true` y un mensaje de éxito, incluyendo el `username`.
    *   Si las credenciales son incorrectas o el usuario no se encuentra, devuelve una respuesta JSON con `success: false` y un mensaje de error.

4.  **Actualización de la Interfaz de Usuario (Frontend):**
    *   De vuelta en `auth_auntentif.js`, si la respuesta JSON de `login.php` indica `success: true`:
        *   Se muestra un mensaje de éxito en el modal.
        *   Se llama a la función `window.verificarEstadoSesion()`. Esta función es global y está definida en `js/global.js`.
        *   Después de que `verificarEstadoSesion()` actualiza la UI, el modal de login se cierra (`modal.style.display = 'none'`).

## 2. Carga Dinámica del Contenido para Usuarios Logueados

La "carga dinámica" del contenido para usuarios logueados se refiere a la **visibilidad** de un bloque de contenido que ya está presente en el HTML, pero inicialmente oculto.

### Archivos y Elementos Clave:
*   `index.php`: Contiene el `div` `#paginaInicio` (contenido para no logueados) y el `div` `#contenidoLogueado` (contenido para logueados).
*   `php/conten_logueado.php`: Este archivo PHP contiene toda la estructura de pestañas y el contenido específico para usuarios logueados.
*   `js/global.js`: Contiene las funciones `verificarEstadoSesion()`, `mostrarInterfazLogueada()` y `mostrarInterfazNoLogueada()`.

### Pasos del Proceso:

1.  **Inclusión del Contenido Logueado:**
    *   En `index.php`, el `div` con `id="contenidoLogueado"` incluye directamente el archivo `php/conten_logueado.php` mediante `<?php include 'php/conten_logueado.php'; ?>`.
    *   Esto significa que el HTML de `php/conten_logueado.php` **ya está cargado en el DOM** cuando la página `index.php` se renderiza por primera vez, pero el `div` `#contenidoLogueado` tiene la clase `oculto` (`display: none;`), por lo que no es visible.

2.  **Verificación del Estado de Sesión (`verificarEstadoSesion()`):**
    *   Al cargar `index.php`, el script `js/global.js` ejecuta `verificarEstadoSesion()`.
    *   Esta función realiza una petición `fetch` a `php/login_seguridad/verificar_sesion.php`.
    *   `verificar_sesion.php` comprueba si existe una sesión PHP activa y si `$_SESSION['user_id']` está establecido. Devuelve un JSON con `logged_in: true` o `false`.

3.  **Actualización de la Interfaz (`mostrarInterfazLogueada()`):**
    *   Si `verificarEstadoSesion()` determina que el usuario está logueado (`data.logged_in` es `true`), llama a `mostrarInterfazLogueada()`.
    *   La función `mostrarInterfazLogueada()` en `js/global.js` realiza las siguientes acciones:
        *   Añade la clase `oculto` al `div` `#paginaInicio` para ocultar el contenido de la página de inicio.
        *   Elimina la clase `oculto` del `div` `#contenidoLogueado` para mostrar el contenido específico del usuario logueado.
        *   Muestra el botón de cerrar sesión en el encabezado (`#contenedorBotonCerrarSesion`).
        *   Actualiza el nombre de usuario visible en el encabezado.

4.  **Contenido de `php/conten_logueado.php`:**
    *   Este archivo incluye a su vez otros archivos PHP que representan las diferentes pestañas de la aplicación (Progreso, Mis Textos, Palabras, Biblioteca, Prácticas, Subir Texto, Lectura).
    *   Por ejemplo: `<?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/progreso.php'; ?>`.
    *   La navegación entre estas pestañas se gestiona con JavaScript (probablemente en `pestanas/js/global.js`), que alterna la visibilidad de los `div` con clase `panel-pestana` dentro de `#contenidoAplicacion` (que es parte de `php/conten_logueado.php`).

En resumen, el contenido para usuarios logueados no se carga mediante una petición AJAX después del login, sino que ya está presente en el HTML de `index.php` y su visibilidad se controla con JavaScript una vez que se confirma el estado de la sesión.
