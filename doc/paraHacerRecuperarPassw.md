# Plan para la Funcionalidad de Recuperación de Contraseña

Este documento detalla el plan para implementar la funcionalidad de "Recuperar Contraseña" en el modal de autenticación, basándose en la estructura de código existente.

## 📋 Descripción General

Se añadirá una funcionalidad que permitirá a los usuarios solicitar un restablecimiento de contraseña a través de su email. El proceso se gestionará completamente dentro del modal de autenticación, utilizando nuevas vistas para la solicitud y el establecimiento de la nueva contraseña.

## 🏗️ Arquitectura del Componente

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3 (modal.css), JavaScript (auth_auntentif.js)
- **Backend**: PHP (nuevos scripts para la gestión de tokens y restablecimiento)
- **Base de Datos**: MySQL (nueva tabla para tokens de recuperación)

### Estructura
El modal de autenticación (`modal_login.php`) se extenderá para incluir dos nuevas vistas:
1.  **Solicitud de Recuperación**: Un formulario para que el usuario introduzca su email.
2.  **Establecimiento de Nueva Contraseña**: Un formulario para que el usuario introduzca y confirme su nueva contraseña, activado mediante un token recibido por email.

## 📁 Archivos Relacionados (Nuevos y Modificados)

```
proyecto/
├── php/
│   └── login_seguridad/
│       ├── modal_login.php                       # Modificado: Añadir nuevas vistas y enlaces
│       ├── request_password_reset.php            # Nuevo: Generar y enviar tokens de recuperación
│       └── reset_password.php                    # Nuevo: Validar token y actualizar contraseña
├── js/
│   └── login_registos/
│       └── auth_auntentif.js                     # Modificado: Lógica para nuevas vistas y formularios
└── db/
    └── (se necesitará un script para crear la tabla `password_resets`)
```

## 🔧 Componentes Principales y Modificaciones

### 1. `php/login_seguridad/modal_login.php` - Estructura HTML del Modal

*   **Añadir un enlace/botón de "Recuperar Contraseña"**:
    *   Dentro del `loginView`, añadir un enlace o botón que, al hacer clic, cambie a la nueva vista `forgotPasswordView`.
    ```html
    <!-- Dentro de loginView, después del formulario de login -->
    <div class="auth-form__actions">
        <a href="#" id="forgotPasswordLink" class="auth-link">¿Olvidaste tu contraseña?</a>
    </div>
    ```
*   **Crear una nueva vista para la solicitud de recuperación (`forgotPasswordView`)**:
    *   Contendrá un formulario para que el usuario introduzca su email.
    ```html
    <!-- Nueva vista para solicitar recuperación de contraseña -->
    <div id="forgotPasswordView" class="auth-view" style="display: none;">
        <h3>Recuperar Contraseña</h3>
        <form id="forgotPasswordForm">
            <div class="auth-form__group">
                <label for="forgotEmail">Email:</label>
                <input type="email" id="forgotEmail" name="email" required>
            </div>
            <button type="submit" class="auth-button">Enviar enlace de recuperación</button>
            <p id="forgotPasswordMsg" class="auth-msg"></p>
            <a href="#" id="backToLoginLink" class="auth-link">Volver a Iniciar Sesión</a>
        </form>
    </div>
    ```
*   **Crear una nueva vista para establecer la nueva contraseña (`resetPasswordView`)**:
    *   Contendrá un formulario para introducir y confirmar la nueva contraseña, y un campo oculto para el token.
    ```html
    <!-- Nueva vista para establecer la nueva contraseña -->
    <div id="resetPasswordView" class="auth-view" style="display: none;">
        <h3>Establecer Nueva Contraseña</h3>
        <form id="resetPasswordForm">
            <input type="hidden" name="token" id="resetToken"> <!-- Campo oculto para el token -->
            <div class="auth-form__group">
                <label for="newPassword">Nueva Contraseña:</label>
                <input type="password" id="newPassword" name="new_password" required>
                <span class="toggle-password material-symbols-outlined">visibility_off</span>
            </div>
            <div class="auth-form__group">
                <label for="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                <input type="password" id="confirmNewPassword" name="confirm_new_password" required>
                <span class="toggle-password material-symbols-outlined">visibility_off</span>
            </div>
            <button type="submit" class="auth-button">Cambiar Contraseña</button>
            <p id="resetPasswordMsg" class="auth-msg"></p>
        </form>
    </div>
    ```

### 2. `js/login_registos/auth_auntentif.js` - Lógica Frontend del Modal

*   **Manejar el cambio de vistas**:
    *   Añadir `eventListener` al `#forgotPasswordLink` para mostrar `forgotPasswordView` y ocultar otras.
    *   Añadir `eventListener` al `#backToLoginLink` para volver a `loginView`.
*   **Manejar el envío del formulario de solicitud de recuperación (`#forgotPasswordForm`)**:
    *   Capturar `submit` del formulario.
    *   Obtener el email.
    *   Enviar `fetch` a `php/login_seguridad/request_password_reset.php`.
    *   Mostrar `showMsg` con feedback al usuario (ej. "Si el email existe, recibirás un enlace...").
*   **Manejar la activación de `resetPasswordView`**:
    *   Al cargar la página, el JavaScript debe verificar los parámetros de la URL (ej. `?action=reset_password&token=XYZ`).
    *   Si se detecta `action=reset_password` y un `token`, el modal se abrirá automáticamente, se mostrará `resetPasswordView`, y el valor del `token` se asignará al campo oculto `#resetToken`.
*   **Manejar el envío del formulario de restablecimiento (`#resetPasswordForm`)**:
    *   Capturar `submit` del formulario.
    *   Obtener `new_password`, `confirm_new_password` y `token` (del campo oculto).
    *   Realizar validaciones frontend (coincidencia, fortaleza de contraseña).
    *   Enviar `fetch` a `php/login_seguridad/reset_password.php`.
    *   Mostrar `showMsg` con feedback. Si es exitoso, cambiar a `loginView` y mostrar un mensaje de éxito.

### 3. Nuevos Scripts PHP en `php/login_seguridad/`

#### a. `request_password_reset.php`
*   **Propósito**: Recibir el email, generar un token y enviar el enlace de recuperación.
*   **Funcionalidades**:
    1.  **Validar email**: Usar `limpiar_input()` y `validar_email()` de `seguridad.php`. Verificar que el email existe en la tabla `users`.
    2.  **Generar token**: Crear un token seguro (ej. `bin2hex(random_bytes(32))`).
    3.  **Establecer expiración**: Definir un tiempo de validez (ej. 1 hora).
    4.  **Almacenar token**: Guardar `user_id`, token, `expires_at` y `created_at` en la nueva tabla `password_resets`.
    5.  **Enviar email**: Enviar un correo al usuario con un enlace que contenga el token. El enlace apuntaría a la página principal con parámetros de URL (ej. `index.php?action=reset_password&token=XYZ`).
    6.  **Respuesta JSON**: Devolver `{ success: true, message: "..." }` o `{ success: false, message: "..." }`.

#### b. `reset_password.php`
*   **Propósito**: Validar el token y actualizar la contraseña del usuario.
*   **Funcionalidades**:
    1.  **Recibir datos**: Obtener `token`, `new_password` y `confirm_new_password` del `fetch` del frontend.
    2.  **Validar token**:
        *   Buscar el token en la tabla `password_resets`.
        *   Verificar que no ha expirado (`expires_at`).
        *   Verificar que no ha sido usado (`used = FALSE`).
    3.  **Validar contraseñas**: Usar `validar_password()` de `seguridad.php` y verificar que `new_password` y `confirm_new_password` coinciden.
    4.  **Hashear contraseña**: Usar `hash_password()` de `seguridad.php`.
    5.  **Actualizar contraseña**: Actualizar la columna `password` en la tabla `users` para el `user_id` asociado al token.
    6.  **Invalidar token**: Marcar el token como usado (`used = TRUE`) en `password_resets` o eliminarlo.
    7.  **Respuesta JSON**: Devolver `{ success: true, message: "..." }` o `{ success: false, message: "..." }`.

### 4. Modificaciones en la Base de Datos

*   **Nueva tabla `password_resets`**:
    ```sql
    CREATE TABLE password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        used BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    ```
    *   `user_id`: Clave foránea a la tabla `users`.
    *   `token`: El token único generado para la recuperación.
    *   `expires_at`: Marca de tiempo de cuándo expira el token.
    *   `created_at`: Marca de tiempo de cuándo se creó el token.
    *   `used`: Un flag para indicar si el token ya ha sido utilizado, previniendo su reutilización.

### 5. Consideraciones Adicionales

*   **Configuración de Email**: Es fundamental tener un sistema de envío de correos configurado en el servidor PHP para que `request_password_reset.php` pueda enviar los enlaces de recuperación.
*   **Seguridad**:
    *   Implementar límites de tasa para las solicitudes de recuperación de contraseña para prevenir ataques de denegación de servicio o enumeración de usuarios.
    *   Asegurarse de que los tokens sean criptográficamente seguros y de un solo uso.
    *   Siempre usar HTTPS.
*   **Experiencia de Usuario**:
    *   Mensajes claros y concisos en cada paso.
    *   Manejo de errores robusto para guiar al usuario.
    *   Considerar un mensaje genérico al enviar el email de recuperación (ej. "Si el email existe en nuestra base de datos, recibirás un enlace de recuperación en breve") para evitar dar pistas sobre la existencia de cuentas.

Este documento servirá como una guía completa para la futura implementación de la funcionalidad de recuperación de contraseña.
