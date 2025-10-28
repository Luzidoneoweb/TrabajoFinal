<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php'; // Ruta absoluta corregida

header('Content-Type: application/json');

$response = ['success' => false, 'categories' => []];

try {
    $stmt = $conn->prepare("SELECT id, name FROM categories ORDER BY name ASC");
    $stmt->execute();
    $result = $stmt->get_result();

    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    $response['success'] = true;
    $response['categories'] = $categories;

} catch (Exception $e) {
    $response['error'] = $e->getMessage();
} finally {
    $conn->close();
}

echo json_encode($response);
?>
