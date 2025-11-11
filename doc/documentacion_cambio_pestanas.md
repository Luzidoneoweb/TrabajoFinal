# Funcionamiento del Cambio de Pestañas en la Aplicación

La aplicación utiliza una combinación de PHP, JavaScript y CSS para gestionar la interfaz de usuario con pestañas, permitiendo la navegación entre diferentes secciones de contenido sin recargar la página completa.

## 1. Estructura General (PHP y HTML)

El archivo principal `index.php` es el punto de entrada de la aplicación. Este archivo incluye varios componentes PHP que construyen la estructura básica de la página:

*   **`php/login_seguridad/seguridad.php`**: Se incluye al principio para iniciar la sesión PHP y proporcionar funciones de seguridad.
*   **`php/menu_logueado.php`**: Este archivo genera la barra de navegación superior que contiene los botones de las pestañas (por ejemplo, "Progreso", "Mis Textos", "Palabras"). Cada botón tiene un atributo `data-pestana` que identifica la pestaña a la que corresponde (ej. `data-pestana="progreso"`).
*   **`php/conten_logueado.php`**: Este archivo es el contenedor principal para el contenido de las pestañas. Incluye todos los archivos PHP de las pestañas individuales (ej. `pestanas/progreso.php`, `pestanas/textos.php`, `pestanas/palabras.php`). Cada contenido de pestaña se envuelve en un `div` con la clase `panel-pestana` y un `id` específico (ej. `id="panelProgreso"`).

**Ejemplo de `php/conten_logueado.php`:**

```php
<section class="contenido-aplicacion" id="contenidoAplicacion">
    <!-- Pestaña: Progreso -->
    <div class="panel-pestana activo" id="panelProgreso">
        <div class="contenido-panel">
            <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/progreso.php'; ?>
        </div>
    </div>

    <!-- Pestaña: Palabras -->
    <div class="panel-pestana" id="panelPalabras">
        <div class="contenido-panel">
            <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/palabras.php'; ?>
        </div>
    </div>
    <!-- ... otras pestañas ... -->
</section>
```

## 2. Estilos CSS

Los estilos CSS, definidos principalmente en `css/estilo.css` y `pestanas/css/global.css`, controlan la apariencia y la visibilidad de las pestañas y sus paneles:

*   La clase `.panel-pestana` tiene `display: none;` por defecto, lo que oculta todos los paneles de contenido.
*   La clase `.panel-pestana.activo` tiene `display: block;`, lo que hace visible el panel de contenido activo.
*   De manera similar, los botones de las pestañas tienen una clase `.pestana` y la clase `.pestana.activa` para resaltar visualmente la pestaña seleccionada.

## 3. Lógica JavaScript (`js/global.js`)

El archivo `js/global.js` contiene la lógica principal para la verificación de sesión y el cambio de pestañas:

*   **`window.verificarEstadoSesion()`**: Esta función asíncrona se ejecuta al cargar la página (`DOMContentLoaded`). Realiza una petición `fetch` a `php/login_seguridad/verificar_sesion.php` para determinar si el usuario está logueado.
    *   Si `data.logged_in` es `true`, llama a `mostrarInterfazLogueada()`.
    *   Si `data.logged_in` es `false`, llama a `mostrarInterfazNoLogueada()`.
*   **`mostrarInterfazLogueada()`**: Esta función se encarga de mostrar los elementos de la interfaz de usuario para usuarios autenticados y ocultar los de usuarios no autenticados. Específicamente:
    *   Añade la clase `oculto` a `navegacionPrincipal` y `paginaInicio`.
    *   Remueve la clase `oculto` de `navegacionUsuario` y `contenidoAplicacion`.
*   **`mostrarInterfazNoLogueada()`**: Realiza la operación inversa a `mostrarInterfazLogueada()`.
*   **`window.cambiarPestana(nombrePestana)`**: Esta es la función central para el cambio de pestañas.
    1.  Remueve la clase `activa` de todos los botones de pestaña (`.pestana`).
    2.  Oculta todos los paneles de contenido (`.panel-pestana`) removiendo la clase `activo`.
    3.  Si `nombrePestana` no es 'lectura', busca el botón de pestaña correspondiente (`[data-pestana="${nombrePestana}"]`) y le añade la clase `activa`.
    4.  Busca el panel de contenido correspondiente por su `id` (ej. `panelProgreso` para `nombrePestana="progreso"`) y le añade la clase `activo` para hacerlo visible.
    5.  Maneja clases especiales para la pestaña de lectura (ej. `lectura-activa` en el `body` para ocultar el scroll).
*   **Event Listeners para las pestañas**: Los botones de las pestañas en `php/menu_logueado.php` tienen un `event listener` adjunto que, al hacer clic, llama a `window.cambiarPestana()` con el `data-pestana` del botón.

## 4. Flujo de Carga y Activación

1.  Cuando la página `index.php` carga, PHP incluye todos los componentes, generando el HTML inicial.
2.  `js/global.js` se ejecuta. Al `DOMContentLoaded`, llama a `verificarEstadoSesion()`.
3.  `verificarEstadoSesion()` determina el estado de autenticación del usuario.
4.  Basado en el estado de autenticación, se llama a `mostrarInterfazLogueada()` o `mostrarInterfazNoLogueada()`, que ajustan la visibilidad de las secciones principales de la interfaz.
5.  Si el usuario está logueado, `mostrarInterfazLogueada()` hace visible la sección `<section id="contenidoLogueado">` (que contiene todos los paneles de las pestañas) y la navegación de usuario.
6.  Por defecto, `js/global.js` llama a `window.cambiarPestana('progreso')` para activar la pestaña "Progreso" al cargar la interfaz logueada.
7.  Cuando el usuario hace clic en un botón de pestaña, se llama a `window.cambiarPestana()` para actualizar las clases `activa` y `activo`, mostrando el contenido de la pestaña seleccionada y ocultando las demás.
