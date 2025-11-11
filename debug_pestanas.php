<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

echo "<h1>DEBUG - Verificando includes de pestañas</h1>";
echo "<p>Directorio actual: " . __DIR__ . "</p>";
echo "<hr>";

$files = [
    'progreso' => __DIR__ . '/pestanas/progreso.php',
    'textos' => __DIR__ . '/pestanas/textos.php',
    'palabras' => __DIR__ . '/pestanas/palabras.php',
    'biblioteca' => __DIR__ . '/pestanas/biblioteca.php',
    'practicas' => __DIR__ . '/pestanas/practicas.php',
    'subir_texto' => __DIR__ . '/pestanas/subir_texto.php',
    'lectura' => __DIR__ . '/pestanas/lectura.php',
];

foreach ($files as $nombre => $ruta) {
    echo "<h3>$nombre.php</h3>";
    echo "<p>Ruta: $ruta</p>";
    
    if (file_exists($ruta)) {
        echo "<p style='color: green;'>✓ Archivo existe</p>";
        echo "<p>Tamaño: " . filesize($ruta) . " bytes</p>";
        echo "<p>Legible: " . (is_readable($ruta) ? 'Sí' : 'No') . "</p>";
        
        // Intentar incluir y capturar salida
        ob_start();
        try {
            include $ruta;
            $content = ob_get_clean();
            echo "<p style='color: green;'>✓ Include exitoso</p>";
            echo "<p>Longitud de contenido: " . strlen($content) . " caracteres</p>";
            if (strlen($content) > 0) {
                echo "<p>Primeros 200 caracteres:</p>";
                echo "<pre>" . htmlspecialchars(substr($content, 0, 200)) . "</pre>";
            } else {
                echo "<p style='color: orange;'>⚠ Contenido vacío</p>";
            }
        } catch (Exception $e) {
            ob_end_clean();
            echo "<p style='color: red;'>✗ Error: " . $e->getMessage() . "</p>";
        }
    } else {
        echo "<p style='color: red;'>✗ Archivo NO existe</p>";
    }
    
    echo "<hr>";
}
?>
