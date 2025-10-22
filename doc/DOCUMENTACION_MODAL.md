# Documentación del Componente Modal de Autenticación

## 📋 Descripción General

El modal de autenticación es un componente clave en **MiApp** que permite a los usuarios iniciar sesión o registrarse de manera interactiva sin recargar la página. Proporciona una experiencia de usuario fluida y segura para la gestión de cuentas.

## 🏗️ Arquitectura del Componente

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3 (modal.css), JavaScript (auth_auntentif.js)
- **Backend**: PHP (login.php, registros.php, seguridad.php, auto_login.php, logout.php, verificar_sesion.php)
- **Base de Datos**: MySQL (para usuarios y tokens de "recordarme")

### Estructura
El modal se implementa como un componente modular que se puede cargar dinámicamente (como se ve en `test_modal.html` al cargar desde `modal_login.php`). Utiliza un enfoque de pestañas para alternar entre las vistas de "Iniciar sesión" y "Crear cuenta".

## 📁 Archivos Relacionados

```
proyecto/
├── test_modal.html                               # Archivo de prueba para el modal
├── css/
│   └── modal.css                                 # Estilos específicos del modal
├── js/
│   └── login_registos/
│       └── auth_auntentif.js                     # Lógica JavaScript para el modal
└── php/
    └── login_seguridad/
        ├── modal_login.php                       # Estructura HTML del modal (PHP)
        ├── login.php                             # Lógica de inicio de sesión
        ├── registros.php                         # Lógica de registro de usuarios
        ├── seguridad.php                         # Funciones de seguridad (hashing, validación, tokens)
        ├── auto_login.php                        # Gestión de auto-login con cookies
        ├── logout.php                            # Cierre de sesión
        └── verificar_sesion.php                  # Verificación de estado de sesión
```

## 🔧 Componentes Principales

### 1. **`modal_login.php`** - Estructura HTML del Modal
- **Propósito**: Define la estructura visual del modal de autenticación.
- **Funcionalidades**:
  - Contenedor principal (`#authModal`) con un fondo (`.auth-modal__backdrop`) y un panel (`.auth-modal__panel`).
  - Botón de cierre (`.auth-close`).
  - Título (`<h2>Acceder / Registrar`).
  - Pestañas (`.auth-tabs`) para "Iniciar sesión" y "Crear cuenta" (`.auth-tab`).
  - Vistas (`.auth-view`) para cada formulario: `loginView` y `registerView`.
  - Formularios de login y registro con campos para email/usuario, contraseña, y opción "Recordarme".
  - Mensajes de estado (`.auth-msg`) para feedback al usuario.
  - Botones para mostrar/ocultar contraseña (`.toggle-password`).

### 2. **`css/modal.css`** - Estilos del Modal
- **Propósito**: Proporciona el diseño y la apariencia del modal.
- **Características**:
  - Posicionamiento fijo y superposición (`position: fixed`, `z-index: 1000`).
  - Efecto de desenfoque de fondo (`backdrop-filter: blur(4px)`).
  - Animaciones de entrada (`fadeIn` para el fondo, `slideIn` para el panel).
  - Estilos para pestañas activas, campos de entrada, botones y mensajes de error/éxito.
  - Diseño responsive para adaptarse a diferentes tamaños de pantalla.
  - Iconos de "ojo" para mostrar/ocultar contraseña (usando `Material Symbols Outlined`).

### 3. **`js/login_registos/auth_auntentif.js`** - Lógica Frontend del Modal
- **Propósito**: Gestiona la interactividad del modal, el envío de formularios y la validación frontend.
- **Funcionalidades**:
  - **Abrir/Cerrar Modal**: Maneja los eventos de clic en el botón de apertura, cierre y el fondo.
  - **Cambio de Pestañas**: Alterna entre las vistas de "Iniciar sesión" y "Crear cuenta".
  - **Mensajes de Feedback**: Función `showMsg` para mostrar mensajes de éxito o error.
  - **Validación de Contraseña**: Función `strongPassword` para verificar la complejidad de la contraseña.
  - **Formulario de Login**:
    - Envío asíncrono (`fetch`) a `php/login_seguridad/login.php`.
    - Muestra mensajes de "Comprobando...", éxito o error.
    - Recarga la página o llama a `verificarEstadoSesion()` tras un login exitoso.
  - **Formulario de Registro**:
    - Envío asíncrono (`fetch`) a `php/login_seguridad/registros.php`.
    - Validaciones frontend para nombre de usuario, email y contraseñas.
    - Muestra mensajes de "Creando cuenta...", éxito o error.
    - Tras un registro exitoso, cambia automáticamente a la pestaña de login y pre-rellena el email.
  - **Mostrar/Ocultar Contraseña**: Alterna el tipo de input de `password` a `text` y cambia el icono del "ojo".

### 4. **Scripts PHP de `login_seguridad/`** - Lógica Backend de Autenticación

#### **`seguridad.php`**
- **Propósito**: Contiene funciones de seguridad reutilizables.
- **Funciones Clave**:
  - `limpiar_input()`: Limpia y sanea los datos de entrada.
  - `validar_email()`: Valida el formato de un email.
  - `validar_password()`: Verifica la complejidad de la contraseña (regex).
  - `hash_password()`: Genera un hash seguro de la contraseña.
  - `verificar_password()`: Compara una contraseña con su hash.
  - `generate_remember_token_pair()`: Genera selector y validador para tokens de "recordarme".
  - `hash_validator()`: Hashea el validador para almacenamiento en DB.
  - `set_remember_cookie()`: Establece la cookie de "recordarme" (segura, httponly, samesite).
  - `delete_remember_cookie()`: Elimina la cookie de "recordarme".
  - `registrar_intento_login()`: Registra intentos de login (exitosos/fallidos) en un archivo de log.
  - `verificar_intentos_fallidos()`: Previene ataques de fuerza bruta limitando intentos fallidos.

#### **`login.php`**
- **Propósito**: Procesa las solicitudes de inicio de sesión.
- **Funcionalidades**:
  - Recibe credenciales (identificador y contraseña).
  - Valida la entrada y verifica intentos fallidos.
  - Consulta la base de datos para encontrar al usuario por username o email.
  - Verifica la contraseña hasheada.
  - Si es exitoso:
    - Regenera el ID de sesión.
    - Almacena `user_id`, `username` y `email` en `$_SESSION`.
    - Registra el intento de login.
    - Si "Recordarme" está activado, genera y guarda un nuevo token en `remember_tokens` y establece la cookie.
  - Si falla: Registra el intento fallido y devuelve un mensaje de error.

#### **`registros.php`**
- **Propósito**: Procesa las solicitudes de registro de nuevos usuarios.
- **Funcionalidades**:
  - Recibe nombre de usuario, email, contraseña y confirmación de contraseña.
  - Valida la entrada (email, longitud de username, complejidad de contraseña, coincidencia de contraseñas).
  - Verifica si el email o nombre de usuario ya existen en la base de datos.
  - Si es válido:
    - Hashea la contraseña.
    - Inserta el nuevo usuario en la tabla `users`.
    - Devuelve un mensaje de éxito.
  - Si falla: Devuelve un mensaje de error específico.

#### **`auto_login.php`**
- **Propósito**: Gestiona el inicio de sesión automático mediante cookies de "recordarme".
- **Funcionalidades**:
  - Verifica si ya hay una sesión activa.
  - Si existe la cookie `remember_me`:
    - Extrae selector y validador.
    - Consulta la base de datos para encontrar el token.
    - Verifica la validez del token (no expirado, validador coincide).
    - Si es válido:
      - Inicia sesión (`$_SESSION`).
      - Rota el token (genera uno nuevo, actualiza DB y cookie) para mayor seguridad.
    - Si es inválido o expirado: Elimina el token de la DB y la cookie.

#### **`logout.php`**
- **Propósito**: Cierra la sesión del usuario.
- **Funcionalidades**:
  - Limpia todas las variables de sesión (`$_SESSION`).
  - Destruye la cookie de sesión.
  - Destruye la sesión.
  - Elimina la cookie de "recordarme" si existe.
  - Devuelve una respuesta JSON de éxito.

#### **`verificar_sesion.php`**
- **Propósito**: Verifica el estado actual de la sesión del usuario.
- **Funcionalidades**:
  - Comprueba si `$_SESSION['user_id']` está establecido.
  - Si está logueado, consulta la base de datos para obtener el nombre de usuario.
  - Devuelve un JSON indicando `logged_in`, `user_id` y `username`.

## 🎯 Flujo de Interacción del Modal

1. **Apertura**: El usuario hace clic en un botón (ej. `#botonLogin` en `test_modal.html`) que activa la visualización del modal.
2. **Carga (Opcional)**: En `test_modal.html`, el modal puede ser cargado dinámicamente desde `php/login_seguridad/modal_login.php` usando `fetch`.
3. **Navegación por Pestañas**: El usuario puede alternar entre "Iniciar sesión" y "Crear cuenta" haciendo clic en las pestañas.
4. **Formulario de Login**:
   - El usuario introduce sus credenciales.
   - El JavaScript (`auth_auntentif.js`) envía los datos a `php/login_seguridad/login.php`.
   - El PHP valida y autentica al usuario, gestionando sesiones y tokens de "recordarme".
   - El JavaScript actualiza la UI o recarga la página según la respuesta.
5. **Formulario de Registro**:
   - El usuario introduce sus datos para crear una cuenta.
   - El JavaScript valida los datos y los envía a `php/login_seguridad/registros.php`.
   - El PHP valida los datos, verifica duplicados y crea el nuevo usuario en la base de datos.
   - El JavaScript, tras un registro exitoso, redirige al usuario a la pestaña de login.
6. **Cierre**: El usuario puede cerrar el modal haciendo clic en el botón de cierre o en el fondo.
7. **Auto-login**: Si el usuario marcó "Recordarme", `auto_login.php` gestiona la persistencia de la sesión a través de cookies seguras.
8. **Verificación de Sesión**: `verificar_sesion.php` se usa para comprobar el estado de la sesión en cualquier momento.
9. **Cierre de Sesión**: `logout.php` se encarga de terminar la sesión y eliminar las cookies de persistencia.

## 🎨 Patrones de Diseño

### Frontend
- **Modularidad**: Separación de HTML (PHP), CSS y JavaScript.
- **Event Delegation**: Uso de `addEventListener` para manejar eventos de forma eficiente.
- **Validación Frontend**: Mejora la experiencia del usuario con feedback instantáneo.

### Backend
- **Separación de Responsabilidades**: Cada script PHP tiene una función específica (login, registro, seguridad, etc.).
- **Seguridad**:
  - Limpieza de inputs (`limpiar_input`).
  - Hashing de contraseñas (`password_hash`, `password_verify`).
  - Protección contra fuerza bruta (`registrar_intento_login`, `verificar_intentos_fallidos`).
  - Tokens de "recordarme" seguros (selector/validador, hasheo, rotación de tokens, cookies seguras).
  - Regeneración de ID de sesión.
- **Manejo de Errores**: Respuestas JSON consistentes para el frontend.

## 🚀 Características Clave

- **Interfaz de Usuario Moderna**: Diseño limpio y responsive con animaciones.
- **Experiencia de Usuario Fluida**: Autenticación sin recarga de página.
- **Seguridad Robusta**:
  - Hashing de contraseñas.
  - Protección contra ataques de fuerza bruta.
  - Gestión segura de "Recordarme" con rotación de tokens.
  - Cookies seguras (HTTPS, HttpOnly, SameSite).
- **Validación Completa**: Tanto en el lado del cliente como en el servidor.
- **Modular y Reutilizable**: Componentes bien definidos para fácil integración.

## 📝 Convenciones de Código

- **HTML**: Semántico, con atributos `aria-*` para accesibilidad.
- **CSS**: Metodología BEM para clases (`auth-modal__panel`, `auth-tab--active`).
- **JavaScript**: camelCase para variables y funciones.
- **PHP**: snake_case para nombres de archivos y funciones.
- **Comentarios**: Claros y descriptivos para cada sección y función.

---

*Documento generado automáticamente - Última actualización: Octubre 2025*
