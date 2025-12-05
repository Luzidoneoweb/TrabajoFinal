<?php
require_once dirname(__FILE__) . '/../../db/conexion.php';

header('Content-Type: application/json; charset=utf-8');

$response = ['success' => false, 'categories' => [], 'error' => ''];

try {
    $stmt = $pdo->query('SELECT id, name FROM categories ORDER BY name ASC');
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['categories'] = $categories;
} catch (PDOException $e) {
    http_response_code(500);
    $response['error'] = 'Error al obtener categorías: ' . $e->getMessage();
}

echo json_encode($response);
?>
