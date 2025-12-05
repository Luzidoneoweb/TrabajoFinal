<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$results = [];

// Test 1: Conexión
try {
    require_once dirname(__FILE__) . '/pestanas/php/conexionLogin.php';
    $results['conexionLogin'] = ['status' => 'success'];
} catch (Exception $e) {
    $results['conexionLogin'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// Test 2: Menu logueado
try {
    ob_start();
    include dirname(__FILE__) . '/php/menu_logueado.php';
    ob_end_clean();
    $results['menu_logueado'] = ['status' => 'success'];
} catch (Exception $e) {
    $results['menu_logueado'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// Test 3: Progreso
try {
    ob_start();
    include dirname(__FILE__) . '/pestanas/progreso.php';
    ob_end_clean();
    $results['progreso'] = ['status' => 'success'];
} catch (Exception $e) {
    $results['progreso'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// Test 4: Textos
try {
    ob_start();
    include dirname(__FILE__) . '/pestanas/textos.php';
    ob_end_clean();
    $results['textos'] = ['status' => 'success'];
} catch (Exception $e) {
    $results['textos'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// Test 5: Palabras
try {
    ob_start();
    include dirname(__FILE__) . '/pestanas/palabras.php';
    ob_end_clean();
    $results['palabras'] = ['status' => 'success'];
} catch (Exception $e) {
    $results['palabras'] = ['status' => 'error', 'error' => $e->getMessage()];
}

echo json_encode($results, JSON_PRETTY_PRINT);
?>
