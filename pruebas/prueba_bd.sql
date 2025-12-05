<?php
// Configuración de producción
$host = "sql206.infinityfree.com";
$user = "if0_39209868";      
$pass = "xRe9fa3aAy";
$dbname = "if0_39209868_proyecto";

// Conexión mysqli
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

// Verifica que la BD esté seleccionada
if (!$conn->select_db($dbname)) {
    die("Error al seleccionar la BD: " . $conn->error);
}

// Conexión PDO (opcional)
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Log pero no detiene si PDO falla, ya que usamos mysqli
}
?>
