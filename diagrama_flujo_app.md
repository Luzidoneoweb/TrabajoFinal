# Diagrama de Flujo de la Aplicación MiApp

Este documento describe el flujo principal de la aplicación MiApp, centrándose en la interacción del usuario y el estado de autenticación.

## 1. Inicio de la Aplicación

La aplicación comienza cargando el archivo `index.php`. Durante este proceso, se realizan las siguientes acciones:
*   Se incluyen los archivos CSS (`css/global_estilos.css`, `pestanas/css/global_pestanas.css`, `pestanas/css/loading_message.css`) y JavaScript (`js/global.js`, `js/login_registos/auth_auntentif.js`, `pestanas/js/global.js`, `pestanas/js/loading_message.js`) esenciales para la interfaz y la funcionalidad básica.
*   Se ejecuta el script PHP `php/login_seguridad/seguridad.php` para verificar el estado de la sesión del usuario.

## 2. Verificación de Sesión

El flujo de la aplicación se bifurca en función de si el usuario ha iniciado sesión o no:

### 2.1. Usuario NO Logueado

Si el usuario no ha iniciado sesión, se muestra la interfaz de bienvenida y las funcionalidades para usuarios no autenticados:
*   Se muestra la sección `paginaInicio`, que incluye:
    *   Una sección "hero" principal con un título y subtítulo.
    *   Espacios publicitarios.
    *   Una sección de "características" (`seccion-caracteristicas`).
    *   Una sección de "testimonios" (`seccion-testimonios`).
    *   Una sección de "precios" (`seccion-precios`).
    *   Una sección "acerca de" (`seccion-acerca`).
*   Se muestra la `navegacionPrincipal` en el encabezado, con enlaces a las secciones mencionadas.
*   El botón "Iniciar Sesión" (`botonLogin`) está visible. Al hacer clic en él, se abre el modal de inicio de sesión/registro (`modal_login.php`).

### 2.2. Usuario Logueado

Si el usuario ha iniciado sesión, la aplicación presenta la interfaz de usuario autenticado:
*   Se oculta la `paginaInicio` y la `navegacionPrincipal`.
*   Se muestra el `contenedorBotonCerrarSesion`, que incluye la información del usuario (nombre de usuario) y un botón para cerrar la sesión (`botonCerrarSesion`).
*   El contenido principal para usuarios logueados se carga dinámicamente en el `div` con ID `contenidoLogueado`. Este contenido está compuesto por las diferentes pestañas de la aplicación, como:
    *   Biblioteca (`pestanas/biblioteca.php`)
    *   Lectura (`pestanas/lectura.php`)
    *   Palabras (`pestanas/palabras.php`)
    *   Prácticas (`pestanas/practicas.php`)
    *   Progreso (`pestanas/progreso.php`)
    *   Subir Texto (`pestanas/subir_texto.php`)

## 3. Funcionalidades Adicionales y Comunes

Independientemente del estado de la sesión, la aplicación incluye las siguientes funcionalidades:
*   **Modal de Login/Registro:** El archivo `php/login_seguridad/modal_login.php` se incluye para gestionar la autenticación y el registro de usuarios.
*   **Menú Móvil:** El archivo `php/menuMovil.php` se incluye para proporcionar una navegación adaptada a dispositivos móviles.
*   **Mensajes de Carga:** La aplicación utiliza `pestanas/js/loading_message.js` y `pestanas/css/loading_message.css` para mostrar mensajes de carga mientras se obtiene contenido dinámico.

## Diagrama de Flujo (Representación Textual)

```mermaid
graph TD
    A[Inicio de la Aplicación] --> B{Cargar index.php};
    B --> C[Incluir CSS y JS esenciales];
    C --> D[Ejecutar seguridad.php (Verificar Sesión)];
    D -- Usuario NO Logueado --> E[Mostrar paginaInicio y navegacionPrincipal];
    E --> F[Botón "Iniciar Sesión"];
    F --> G[Abrir modal_login.php];
    G --> H[Registro/Login de Usuario];
    D -- Usuario Logueado --> I[Ocultar paginaInicio y navegacionPrincipal];
    I --> J[Mostrar info usuario y botón Cerrar Sesión];
    J --> K[Cargar contenido dinámico en contenidoLogueado (Pestañas)];
    K --> L[Funcionalidades de Pestañas (Lectura, Práctica, etc.)];
    H --> M[Funcionalidades Comunes (Menú Móvil, Mensajes de Carga)];
    L --> M;
    M --> N[Fin de la Interacción];
