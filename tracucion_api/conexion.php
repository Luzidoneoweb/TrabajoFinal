<?php
// Configuración de producción
// $host = "sql206.infinityfree.com";
// $user = "if0_39209868";        // Cambia si tienes otro usuario
// $password = "xRe9fa3aAy";        // Cambia si tienes contraseña
// $database = "if0_39209868_proyecto";
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "proyecto" ;


try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Conexión fallida: " . $e->getMessage());
}
