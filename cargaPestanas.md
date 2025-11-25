# Funcionamiento del Cambio y Carga de Pestañas

El sistema de pestañas se basa en una combinación de PHP para la estructura inicial y JavaScript para la interactividad dinámica y la carga de contenido.

## 1. Carga Inicial y Verificación de Sesión

*   **`index.php`**: Es el punto de entrada de la aplicación.
*   **`js/global.js`**:
    *   Al cargar la página (`DOMContentLoaded`), se ejecuta `window.verificarEstadoSesion()`.
    *   Esta función realiza una petición `fetch` a `php/login_seguridad/verificar_sesion.php` para comprobar si el usuario está logueado.
    *   Si el usuario está logueado (`data.logged_in` es `true`), se llama a `mostrarInterfazLogueada()`.

## 2. Inicialización de la Interfaz Logueada

*   **`js/global.js` (`mostrarInterfazLogueada()`):**
    *   Oculta los elementos de la interfaz de usuario no logueado (`navegacionPrincipal`, `paginaInicio`).
    *   Muestra los elementos de la interfaz de usuario logueado (`contenidoAplicacion`, `contenedorBotonCerrarSesion`).
    *   La parte crucial es la llamada a `window.inicializarInterfazLogueadaPestanas()`.

## 3. Carga Dinámica del Contenido Principal y Scripts Base

*   **`pestanas/js/global.js` (`window.inicializarInterfazLogueadaPestanas()`):**
    *   Esta función se ejecuta solo una vez para evitar recargas innecesarias.
    *   **Petición AJAX a `php/conten_logueado.php`**: Realiza un `fetch` a `php/conten_logueado.php`. El contenido HTML devuelto por este archivo se inserta en el `div` con ID `contenidoLogueado` (que se encuentra en `index.php` o en el archivo principal que incluye `js/global.js`).
    *   **`php/conten_logueado.php`**: Este archivo PHP es fundamental. No solo contiene la estructura de los paneles de las pestañas (`panelProgreso`, `panelTextos`, etc.), sino que también incluye (`include`) los archivos PHP específicos de cada pestaña (ej. `pestanas/progreso.php`, `pestanas/textos.php`). Esto significa que el contenido *inicial* de todas las pestañas se carga en el DOM de una sola vez cuando el usuario se loguea, aunque solo una pestaña sea visible. También incluye `php/menu_logueado.php` que contiene los botones de navegación de las pestañas.
    *   **Carga de Scripts Base**: Después de insertar el HTML de `php/conten_logueado.php`, esta función adjunta dinámicamente varios scripts JavaScript al `body`. Estos scripts son esenciales para la funcionalidad general de las pestañas y sus contenidos:
        *   `pestanas/js/loading_message.js` (incluido directamente en `conten_logueado.php`): Maneja los mensajes de carga.
        *   `pestanas/js/cargar_biblioteca.js`: Para la funcionalidad de la biblioteca.
        *   `pestanas/js/text-utils.js`: Utilidades para el manejo de texto.
        *   `traducion_api/lectura-translation-functions.js`: Funciones de traducción.
        *   `pestanas/js/texto.js`: Funcionalidad relacionada con los textos del usuario.
    *   **Inicialización de Event Listeners**: Llama a `inicializarPestanas()` para configurar los `event listeners` en los botones de las pestañas.
    *   **Activación de Pestaña Inicial**: Determina qué pestaña debe activarse por defecto (priorizando un parámetro `tab` en la URL, luego un valor en `localStorage`, y finalmente "progreso") y llama a `window.cambiarPestana()` para mostrarla.

## 4. Estructura del Menú de Pestañas

*   **`php/menu_logueado.php`**: Este archivo, incluido por `php/conten_logueado.php`, define la barra de navegación de las pestañas. Contiene una serie de botones (`<button class="pestana" data-pestana="nombrePestana">`) que actúan como los controles para cambiar entre las diferentes vistas. El atributo `data-pestana` es crucial, ya que identifica la pestaña a la que corresponde cada botón.

## 5. Manejo del Cambio de Pestañas (`window.cambiarPestana`)

*   **`pestanas/js/global.js` (`window.cambiarPestana(nombrePestana)`):**
    *   Esta es la función central que gestiona la visibilidad de las pestañas y la carga de scripts específicos.
    *   **Detención de Procesos Activos**: Si la función de lectura de textos está activa (`window.MotorLectura`), la detiene para evitar conflictos.
    *   **Gestión de Clases CSS**:
        *   Remueve la clase `activa` de todos los botones de pestañas (`.pestana`).
        *   Remueve la clase `activo` de todos los paneles de contenido (`.panel-pestana`).
        *   Añade la clase `activa` al botón de la pestaña seleccionada (si no es la pestaña "lectura", que se activa de otra manera).
        *   Añade la clase `activo` al panel de contenido correspondiente (`#panel[NombrePestana]`).
    *   **Lógica Específica por Pestaña**:
        *   **Pestaña "Lectura"**: Añade la clase `lectura-activa` al `body`, oculta el scroll de la página y carga dinámicamente scripts adicionales específicos para la lectura (ej. `lector/electron-voice-integration.js`, `lector/reading-engine.js`, `pestanas/js/lectura.js`, `pestanas/js/modalFinalizacion.js`). Muestra un mensaje de carga y llama a `cargarContenidoLectura()`.
        *   **Pestaña "Subir Texto"**: Carga el script `pestanas/js/subir_texto.js` si no está cargado y llama a `inicializarSubirTexto()`.
        *   **Pestaña "Prácticas"**: Carga el script `practica/js/practice-functions.js` si no está cargado y llama a `iniciarPracticaUI()`.
    *   **Cierre de Menú Móvil**: Cierra el menú móvil si está abierto después de seleccionar una pestaña.
    *   **Mensaje de Carga**: La función `cambiarPestana` no oculta el mensaje de carga automáticamente; cada script específico de la pestaña es responsable de ocultarlo cuando su contenido esté completamente cargado.

## 6. Inicialización de Event Listeners de Pestañas

*   **`pestanas/js/global.js` (`inicializarPestanas()`):**
    *   Esta función se encarga de añadir `event listeners` a todos los elementos con la clase `pestana`.
    *   Cuando se hace clic en una pestaña, se obtiene su atributo `data-pestana` y se llama a `window.cambiarPestana()` con ese nombre.

En resumen, el sistema carga el contenido principal de forma asíncrona (a través de `php/conten_logueado.php`), luego inicializa los botones de las pestañas y, al hacer clic en ellos, gestiona la visibilidad de los paneles y carga dinámicamente los scripts y el contenido específico de cada pestaña según sea necesario, optimizando así el rendimiento al cargar solo lo que se necesita.
