# Documentación del archivo `js/login_registos/auth_auntentif.js`

## Descripción
El archivo `auth_auntentif.js` es un script JavaScript que gestiona la interfaz y la lógica de autenticación de usuarios (inicio de sesión y registro) a través de un modal. Se encarga de abrir y cerrar el modal, cambiar entre las vistas de login y registro, validar los datos de entrada y enviar las peticiones al servidor sin recargar la página.

## Estructura y Elementos DOM
El script se ejecuta como una IIFE (Immediately Invoked Function Expression) para encapsular sus variables y evitar conflictos globales. Al inicio, obtiene referencias a los siguientes elementos del DOM:
*   `modal`: El contenedor principal del modal de autenticación (`#authModal`).
*   `btnOpen`: Botón para abrir el modal (`#botonLogin`).
*   `btnClose`: Botón para cerrar el modal (`#authClose`).
*   `backdrop`: El fondo oscuro detrás del modal (`#authBackdrop`).
*   `tabs`: Pestañas para alternar entre login y registro (`.auth-tab`).
*   `views`: Vistas de contenido para login y registro (`.auth-view`).
*   `loginForm`: Formulario de inicio de sesión (`#loginForm`).
*   `registerForm`: Formulario de registro (`#registerForm`).

## Funcionalidades Clave

### 1. Apertura y Cierre del Modal
*   **`btnOpen` click:** Muestra el modal. Si `window.rememberedIdentifier` (definido en `js/global.js`) tiene un valor, lo rellena en el campo de identificador del formulario de login y pone el foco en el campo de contraseña.
*   **`btnClose` click:** Oculta el modal.
*   **`backdrop` click:** Oculta el modal al hacer clic fuera de él.

### 2. Cambio de Pestañas (Login/Registro)
*   Los elementos con la clase `auth-tab` (pestañas) controlan la visibilidad de las vistas (`.auth-view`). Al hacer clic en una pestaña, se activa esa pestaña y se muestra la vista correspondiente, ocultando las demás.

### 3. `showMsg(el, msg, ok=false)`
*   **Propósito:** Función auxiliar para mostrar mensajes de estado (éxito o error) dentro del modal.
*   **Parámetros:**
    *   `el`: El elemento DOM donde se mostrará el mensaje (ej. `#loginMsg`, `#registerMsg`).
    *   `msg`: El texto del mensaje.
    *   `ok`: Booleano opcional; si es `true`, el mensaje se muestra como éxito (clase `success`), de lo contrario, como error (clase `error`).

### 4. `strongPassword(pwd)`
*   **Propósito:** Valida si una contraseña cumple con los criterios de seguridad.
*   **Criterios:** Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial. Utiliza una expresión regular.

### 5. Lógica de Inicio de Sesión (LOGIN)
*   **`loginForm` submit:**
    *   Previene el envío por defecto del formulario.
    *   Muestra un mensaje de "Comprobando...".
    *   Envía los datos del formulario a `php/login_seguridad/login.php` mediante una petición `fetch` (POST).
    *   Si la respuesta del servidor indica éxito (`json.success`), muestra un mensaje de éxito, llama a `window.verificarEstadoSesion()` (definida en `js/global.js`) para actualizar la interfaz y cierra el modal. Si `verificarEstadoSesion` no está disponible, recarga la página.
    *   Si hay un error, muestra el mensaje de error recibido del servidor.

### 6. Lógica de Registro (REGISTER)
*   **`registerForm` submit:**
    *   Previene el envío por defecto del formulario.
    *   Realiza validaciones del lado del cliente para:
        *   Nombre de usuario no vacío.
        *   Formato de email válido.
        *   Coincidencia de contraseñas.
        *   Contraseña segura (`strongPassword`).
    *   Si las validaciones pasan, muestra un mensaje de "Creando cuenta...".
    *   Envía los datos del formulario a `php/login_seguridad/registros.php` mediante una petición `fetch` (POST).
    *   Si la respuesta del servidor indica éxito (`json.success`), muestra un mensaje de éxito y, después de un breve retraso, cambia la vista al formulario de login, rellenando el email y poniendo el foco en la contraseña.
    *   Si hay un error, muestra el mensaje de error recibido del servidor.

### 7. Alternar Visibilidad de Contraseña
*   Los elementos con la clase `toggle-password` (iconos de ojo) permiten alternar el tipo de los campos de contraseña entre `password` y `text`, mostrando u ocultando el texto de la contraseña. También cambian el icono de visibilidad.

## Archivos relacionados
*   `index.php`: Incluye este script y el modal de autenticación (`php/login_seguridad/modal_login.php`).
*   `js/global.js`: Define `window.verificarEstadoSesion` y `window.rememberedIdentifier`, con los que este script interactúa.
*   `php/login_seguridad/modal_login.php`: Contiene la estructura HTML del modal de autenticación, incluyendo los formularios de login y registro.
*   `php/login_seguridad/login.php`: Endpoint PHP que procesa las peticiones de inicio de sesión.
*   `php/login_seguridad/registros.php`: Endpoint PHP que procesa las peticiones de registro de nuevos usuarios.
