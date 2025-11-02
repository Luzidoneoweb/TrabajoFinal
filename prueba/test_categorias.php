<?php
// Script de prueba para verificar categorías
require_once 'db/conexion.php';

echo "<h2>Prueba de conexión y categorías</h2>";

// Verificar conexión
if ($conn->connect_error) {
    echo "<p style='color: red;'>Error de conexión: " . $conn->connect_error . "</p>";
} else {
    echo "<p style='color: green;'>✓ Conexión exitosa</p>";
}

// Verificar tabla categories
$result = $conn->query("SHOW TABLES LIKE 'categories'");
if ($result->num_rows > 0) {
    echo "<p style='color: green;'>✓ Tabla 'categories' existe</p>";
    
    // Mostrar categorías
    $stmt = $conn->prepare("SELECT id, name FROM categories ORDER BY name ASC");
    $stmt->execute();
    $result = $stmt->get_result();
    
    echo "<h3>Categorías disponibles:</h3>";
    echo "<ul>";
    while ($row = $result->fetch_assoc()) {
        echo "<li>ID: " . $row['id'] . " - Nombre: " . $row['name'] . "</li>";
    }
    echo "</ul>";
    
    if ($result->num_rows == 0) {
        echo "<p style='color: orange;'>⚠ No hay categorías en la base de datos</p>";
    }
} else {
    echo "<p style='color: red;'>✗ Tabla 'categories' no existe</p>";
}

$conn->close();
?>
