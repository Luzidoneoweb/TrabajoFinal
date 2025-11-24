<?php
// seguridad.php - Funciones de seguridad para la aplicación
session_start();

// Función para limpiar datos de entrada
function limpiar_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Función para validar email
function validar_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Función para validar contraseña segura
function validar_password($password) {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
    return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/', $password);
}

// Función para generar hash de contraseña
function hash_password($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Función para verificar contraseña
function verificar_password($password, $hash) {
    return password_verify($password, $hash);
}

// Función para generar un par selector/validator para el token de "recordarme"
function generate_remember_token_pair() {
    $selector = bin2hex(random_bytes(12)); // 24 caracteres hexadecimales
    $validator = bin2hex(random_bytes(24)); // 48 caracteres hexadecimales
    return ['selector' => $selector, 'validator' => $validator];
}

// Función para hashear el validator antes de almacenarlo en la DB
function hash_validator($validator) {
    return password_hash($validator, PASSWORD_DEFAULT);
}

// Función para establecer la cookie de "recordarme"
function set_remember_cookie($selector, $validator, $expires_at) {
    $cookie_value = $selector . ':' . $validator;
    // La cookie expira en el timestamp de $expires_at
    setcookie('remember_me', $cookie_value, [
        'expires' => strtotime($expires_at),
        'path' => '/',
        'domain' => '', // Deja vacío para el dominio actual o especifica tu dominio
        'secure' => false, // false en desarrollo (HTTP), true en producción (HTTPS)
        'httponly' => true, // No accesible por JavaScript
        'samesite' => 'Lax' // Protección CSRF
    ]);
}

// Función para eliminar la cookie de "recordarme"
function delete_remember_cookie() {
    setcookie('remember_me', '', [
        'expires' => time() - 3600, // Expira en el pasado
        'path' => '/',
        'domain' => '',
        'secure' => false, // false en desarrollo (HTTP), true en producción (HTTPS)
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

?>
