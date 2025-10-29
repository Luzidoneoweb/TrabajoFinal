<?php
require_once '../../../db/conexion.php';

header('Content-Type: application/json');

$response = ['success' => false, 'data' => [], 'error' => ''];

try {
    $stmt = $pdo->query("SELECT id, title, title_translation, content, content_translation, is_public, category_id, created_at FROM texts ORDER BY created_at DESC");
    $texts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['data'] = $texts;

} catch (PDOException $e) {
    $response['error'] = "Error al obtener los textos: " . $e->getMessage();
}

echo json_encode($response);
?>
