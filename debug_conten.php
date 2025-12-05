<?php
// Debug file - check if conten_logueado.php can be loaded
header('Content-Type: application/json');

try {
    ob_start();
    include dirname(__FILE__) . '/php/conten_logueado.php';
    $content = ob_get_clean();
    
    echo json_encode([
        'success' => true,
        'length' => strlen($content),
        'content' => substr($content, 0, 500) // First 500 chars
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>
