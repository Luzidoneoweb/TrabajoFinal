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

?>
