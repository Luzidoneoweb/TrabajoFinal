<?php
// Script de prueba para el endpoint de categorías
echo "<h2>Prueba del endpoint get_categoria.php</h2>";

// Simular la petición
$url = 'http://localhost/trabajoFinal/php/pestanas/php/get_categoria.php';
echo "<p>Probando URL: " . $url . "</p>";

// Usar file_get_contents para probar
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Content-Type: application/json'
    ]
]);

$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    echo "<p style='color: red;'>Error al acceder al endpoint</p>";
} else {
    echo "<p style='color: green;'>✓ Respuesta recibida:</p>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
    
    // Decodificar JSON
    $data = json_decode($response, true);
    if ($data) {
        echo "<h3>Datos decodificados:</h3>";
        echo "<pre>" . print_r($data, true) . "</pre>";
    } else {
        echo "<p style='color: red;'>Error al decodificar JSON</p>";
    }
}
?>
