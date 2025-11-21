# Documentación del archivo `php/login_seguridad/seguridad.php`

## Descripción
El archivo `seguridad.php` contiene un conjunto de funciones PHP esenciales para la seguridad de la aplicación, incluyendo la gestión de sesiones, limpieza y validación de datos de entrada, hashing y verificación de contraseñas, y la implementación de la funcionalidad "recordarme" (remember me) mediante tokens seguros.

## Funcionalidades Clave

### 1. Gestión de Sesiones
*   `session_start()`: Inicia o reanuda una sesión PHP. Es la primera línea del archivo, asegurando que las variables de sesión estén disponibles para su uso en toda la aplicación.

### 2. Limpieza y Validación de Datos
*   `limpiar_input($data)`:
    *   **Propósito:** Limpia una cadena de entrada para prevenir ataques comunes como XSS (Cross-Site Scripting).
    *   **Proceso:**
        *   `trim()`: Elimina espacios en blanco del principio y final de la cadena.
        *   `stripslashes()`: Elimina las barras invertidas de una cadena (útil para datos que provienen de formularios y han sido "escapados" automáticamente).
        *   `htmlspecialchars()`: Convierte caracteres especiales a entidades HTML, lo que es crucial para mostrar datos de usuario de forma segura en una página web.
*   `validar_email($email)`:
    *   **Propósito:** Valida si una cadena tiene un formato de correo electrónico válido.
    *   **Uso:** Utiliza `filter_var()` con `FILTER_VALIDATE_EMAIL`, una función robusta de PHP para la validación de emails.
*   `validar_password($password)`:
    *   **Propósito:** Valida si una contraseña cumple con criterios de seguridad específicos.
    *   **Criterios:** Requiere un mínimo de 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial. Utiliza una expresión regular (`preg_match`) para hacer cumplir estos requisitos.

### 3. Hashing y Verificación de Contraseñas
*   `hash_password($password)`:
    *   **Propósito:** Genera un hash seguro de una contraseña.
    *   **Uso:** Emplea `password_hash()` con `PASSWORD_DEFAULT`, que utiliza el algoritmo de hashing más fuerte disponible y gestiona automáticamente la sal (salt) para cada hash, lo que es fundamental para la seguridad.
*   `verificar_password($password, $hash)`:
    *   **Propósito:** Verifica si una contraseña proporcionada coincide con un hash almacenado.
    *   **Uso:** Utiliza `password_verify()`, la función recomendada para comparar contraseñas con sus hashes de forma segura, protegiendo contra ataques de temporización.

### 4. Funcionalidad "Recordarme" (Remember Me)
*   `generate_remember_token_pair()`:
    *   **Propósito:** Genera un par de tokens (selector y validador) para la funcionalidad "recordarme".
    *   **Generación:** Utiliza `random_bytes()` para crear cadenas aleatorias criptográficamente seguras, que luego se codifican en hexadecimal. El selector se almacena en la cookie y en la base de datos, mientras que el validador se almacena en la cookie y su hash en la base de datos.
*   `hash_validator($validator)`:
    *   **Propósito:** Hashea el validador antes de almacenarlo en la base de datos.
    *   **Uso:** Similar a `hash_password`, utiliza `password_hash()` para asegurar que el validador no se almacene en texto plano.
*   `set_remember_cookie($selector, $validator, $expires_at)`:
    *   **Propósito:** Establece la cookie "remember_me" en el navegador del usuario.
    *   **Configuración de la cookie:**
        *   `expires`: Define la fecha de expiración de la cookie.
        *   `path`: La cookie estará disponible en todo el dominio.
        *   `secure`: `true` asegura que la cookie solo se envíe a través de conexiones HTTPS.
        *   `httponly`: `true` hace que la cookie no sea accesible a través de JavaScript, mitigando ataques XSS.
        *   `samesite`: `Lax` proporciona protección contra CSRF (Cross-Site Request Forgery).
*   `delete_remember_cookie()`:
    *   **Propósito:** Elimina la cookie "remember_me" del navegador del usuario.
    *   **Mecanismo:** Establece la fecha de expiración de la cookie en el pasado, lo que hace que el navegador la elimine inmediatamente.

## Archivos relacionados
*   Este archivo es incluido por `index.php` y probablemente por otros scripts PHP que requieren funciones de seguridad, como los de inicio de sesión y registro (`php/login_seguridad/login.php`, `php/login_seguridad/registros.php`) y el de auto-login (`php/login_seguridad/auto_login.php`).
