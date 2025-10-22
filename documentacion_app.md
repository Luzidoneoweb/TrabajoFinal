# Documentación de la Aplicación "MiApp
Este documento describe el diseño y funcionamiento actual de la aplicación web "MiApp"
## 1. Estructura General del Proyecto
La aplicación sigue una estructura de archivos organizada para separar las diferentes capas de la aplicación:
- **`index.php`**: El punto de entrada principal de la aplicación. Incluye los archivos CSS, JavaScript y PHP necesarios para la interfaz de usuario y la lógica de negocio.
- \*\*`css/`
- \*\*`js/`
  - `global.js`: Lógica global de la aplicación, manejo de estado de sesión, cambio de pestañas, etc.
  - `login_registos/auth_auntentif.js`: Lógica para el modal de login y registro, incluyendo la alternancia de visibilidad de contraseña.
- **`php/`**: Contiene los scripts PHP para la lógica del servidor.
  - `login_seguridad/`: Scripts relacionados con la autenticación y seguridad.
    - `seguridad.php`: Funciones de seguridad (limpieza de input, hashing de contraseñas, etc.).
    - `login.php`: Maneja la lógica de inicio de sesión.
    - `registros.php`: Maneja la lógica de registro de nuevos usuarios.
    - `verificar_sesion.php`: Verifica el estado de la sesión del usuario.
    - `logout.php`: Cierra la sesión del usuario.
    - `auto_login.php`: Maneja la lógica de auto-login mediante cookies.
    - `modal_login.php`: Contenido HTML del modal de login/registro.
  - `pestanas/`: Contiene los archivos PHP para el contenido de las pestañas de usuario logueado.
    - `biblioteca.php`, `practicas.php`, `progreso.php`, `textos.php`, `vocabulario.php`: Contenido de las respectivas pestañas.
    - `css/pestanas.css`: Estilos para las pestañas.
  - `conten_logueado.php`: Contenedor principal para el contenido cuando el usuario está logueado.
  - `menu_logueado.php`: Menú de navegación para usuarios logueados.
  - `menuMovil.php`: Menú de navegación para dispositivos móviles.
- **`db/`**: Contiene scripts SQL para la base de datos.
  - `conexion.php`: Script de conexión a la base de datos.
  - `proyecto.sql`, `create_remember_tokens_table.sql`: Esquemas y actualizaciones de la base de datos.
- **`img/`**: Contiene imágenes de la aplicación.

## 2. Sistema de Autenticación

La aplicación implementa un sistema de autenticación  que incluye:

- **Modal de Login/Registro (`modal_login.php`, `auth_auntentif.js`)**: Un modal  que permite a los usuarios iniciar sesión o registrarse.
   Los botones "Iniciar sesión" y "Crear cuenta" alternan entre las vistas de login y registro dentro del modal.
  - **Validación de Formularios**: El JavaScript (`auth_auntentif.js`) realiza validaciones básicas en el cliente (ej. formato de email, coincidencia de contraseñas, fortaleza de contraseña).
  - **Comunicación Asíncrona**: Los formularios envían datos al servidor (`login.php`, `registros.php`) mediante `fetch` (AJAX) para evitar recargas de página.
  - **Feedback al Usuario**: Se muestran mensajes de éxito o error dentro del modal.
  - **Visibilidad de Contraseña**: Un botón de "ojo" permite alternar la visibilidad de la contraseña. Se utilizan iconos de Material Icons (`visibility_off` y `visibility`) que cambian dinámicamente.
- **Seguridad en el Servidor (`seguridad.php`, `login.php`, `registros.php`):
  - **Limpieza de Input**: Se utiliza `limpiar_input()` para prevenir ataques XSS.
  - **Hashing de Contraseñas**: Las contraseñas se almacenan hasheadas en la base de datos utilizando `password_hash()` y se verifican con `password_verify()`.
  - **Gestión de Sesiones**: Se utilizan sesiones PHP para mantener el estado de autenticación del usuario.
  - **Función "Recordarme"**: Los usuarios pueden optar por ser recordados. Esto genera un par de tokens (selector y validador) que se almacenan en una cookie y en la base de datos (el validador hasheado). El sistema verifica estos tokens para auto-loguear al usuario en futuras visitas.
- **Verificación de Sesión (`verificar_sesion.php`): Un script PHP que comprueba si el usuario está logueado y devuelve el estado de la sesión.
- **Auto-Login (`auto_login.php`)**: Intenta loguear al usuario automáticamente si existe una cookie de "recordarme" válida.
- **Cierre de Sesión (`logout.php`)**: Invalida la sesión y las cookies de "recordarme".

## 3. Interfaz de Usuario (UI) y Navegación

La aplicación presenta una interfaz dinámica que se adapta al estado de autenticación del usuario:

- **Estado No Logueado**:
  - Se muestra la `navegacionPrincipal` con enlaces a secciones informativas (Inicio, Características, Testimonios, Precios, Acerca).
  - Sección `paginaInicio` visible, que incluye una sección hero con un eslogan y una demo de traducción, espacios publicitarios, y secciones de características, testimonios, precios y "acerca de".
  - El botón "Iniciar Sesión" (`#botonLogin`) abre el modal de autenticación.
- **Estado Logueado**:
  - Se oculta la `navegacionPrincipal` y la `paginaInicio`.
  - Se muestra la `navegacionUsuario` (definida en `php/menu_logueado.php`) con opciones como "Biblioteca", "Prácticas", "Progreso", "Textos", "Vocabulario" y "Cerrar Sesión".
  - Se muestra el `contenidoLogueado` (definido en `php/conten_logueado.php`), que carga dinámicamente el contenido de las pestañas.
  - **Navegación por Pestañas**: Al hacer clic en una pestaña, el JavaScript (`global.js`) activa la pestaña correspondiente y muestra su panel de contenido. Por defecto, se activa la pestaña "Progreso" al iniciar sesión.
- **Menú Móvil (`php/menuMovil.php`)**: Un menú adaptable para dispositivos móviles que se activa mediante un botón (`#botonMenuMovil`).



## . Archivos Clave y su Rol

- **`index.php`**: Orquestador principal, carga todos los componentes.
- **`php/login_seguridad/modal_login.php`**: Estructura HTML del modal de autenticación.
- **`js/login_registos/auth_auntentif.js`**: Lógica interactiva del modal (tabs, formularios, visibilidad de contraseña).
- **`js/global.js`**: Lógica de la aplicación (manejo de sesión, cambio de UI, navegación por pestañas).
- **`php/login_seguridad/login.php`**: Procesa el inicio de sesión.
- **`php/login_seguridad/registros.php`**: Procesa el registro de usuarios.
- **`css/modal.css`**: Estilos del modal de autenticación, incluyendo los iconos de visibilidad.
- **`php/login_seguridad/seguridad.php`**: Funciones de seguridad reutilizables.
- **`db/conexion.php`**: Conexión a la base de datos.

visión general del diseño y funcionamiento de la aplicación "MiApp" hasta la fecha.21/10/2025
