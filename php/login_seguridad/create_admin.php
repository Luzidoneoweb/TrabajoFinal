<?php
require_once __DIR__ . '/../../db/conexion.php'; // Ajusta la ruta según sea necesario

$username = 'luz';
$email = 'luz@idoneoweb.es';
$password_raw = 'Holamundo25__';
$is_admin = 1; // 1 para administrador

// Hashear la contraseña
$password_hashed = password_hash($password_raw, PASSWORD_DEFAULT);

// Preparar la consulta SQL para insertar o actualizar el usuario
$sql = "INSERT INTO `users` (`username`, `email`, `password`, `is_admin`)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        `username` = VALUES(`username`),
        `email` = VALUES(`email`),
        `password` = VALUES(`password`),
        `is_admin` = VALUES(`is_admin`);";

// Preparar la declaración
if ($stmt = $conn->prepare($sql)) {
    // Vincular parámetros
    $stmt->bind_param("sssi", $username, $email, $password_hashed, $is_admin);

    // Ejecutar la declaración
    if ($stmt->execute()) {
        echo "Usuario administrador '{$username}' insertado/actualizado correctamente.";
    } else {
        echo "Error al insertar/actualizar usuario: " . $stmt->error;
    }

    // Cerrar la declaración
    $stmt->close();
} else {
    echo "Error al preparar la consulta: " . $conn->error;
}

// Cerrar la conexión
$conn->close();
?>
