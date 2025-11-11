<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Iniciando test de includes...\n\n";

echo "1. Probando palabras.php:\n";
try {
    ob_start();
    require_once __DIR__ . '/pestanas/palabras.php';
    $content = ob_get_clean();
    echo "Longitud de contenido: " . strlen($content) . "\n";
    if (strlen($content) > 0) {
        echo "Primeros 100 caracteres: " . substr($content, 0, 100) . "\n";
    } else {
        echo "ADVERTENCIA: Contenido vacío\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n2. Probando progreso.php:\n";
try {
    ob_start();
    require_once __DIR__ . '/pestanas/progreso.php';
    $content = ob_get_clean();
    echo "Longitud de contenido: " . strlen($content) . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n3. Probando textos.php:\n";
try {
    ob_start();
    require_once __DIR__ . '/pestanas/textos.php';
    $content = ob_get_clean();
    echo "Longitud de contenido: " . strlen($content) . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\nFin del test.\n";
?>
