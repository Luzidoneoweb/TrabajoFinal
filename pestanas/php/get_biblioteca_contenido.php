<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

header('Content-Type: application/json');

$response = ['success' => false, 'categorias' => [], 'error' => ''];

try {
    // Obtener categorías que tengan textos públicos
    $stmt = $pdo->prepare("
        SELECT DISTINCT c.id, c.name 
        FROM categories c
        INNER JOIN texts t ON c.id = t.category_id
        WHERE t.is_public = 1
        ORDER BY c.name
    ");
    $stmt->execute();
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Para cada categoría, obtener sus textos públicos
    $resultado = [];
    foreach ($categorias as $categoria) {
        $stmt_textos = $pdo->prepare("
            SELECT id, title, title_translation, content, user_id
            FROM texts
            WHERE category_id = :category_id AND is_public = 1
            ORDER BY created_at DESC
        ");
        $stmt_textos->bindValue(':category_id', $categoria['id'], PDO::PARAM_INT);
        $stmt_textos->execute();
        $textos = $stmt_textos->fetchAll(PDO::FETCH_ASSOC);

        $resultado[] = [
            'id' => $categoria['id'],
            'nombre' => $categoria['name'],
            'textos' => $textos
        ];
    }

    $response['success'] = true;
    $response['categorias'] = $resultado;

} catch (PDOException $e) {
    $response['error'] = "Error al obtener categorías: " . $e->getMessage();
}

echo json_encode($response);
?>
