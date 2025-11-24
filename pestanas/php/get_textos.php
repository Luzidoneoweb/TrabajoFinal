<?php
session_start(); // Iniciar la sesión
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

header('Content-Type: application/json');

$response = ['success' => false, 'data' => [], 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    // Esto no debería ocurrir si la página textos.php ya verifica el login,
    // pero es una buena práctica de seguridad.
    $response['error'] = "Usuario no autenticado.";
    echo json_encode($response);
    exit();
}

$user_id = (int)$_SESSION['user_id'];

try {
    // Obtener textos del usuario logueado que tienen palabras guardadas
    $stmt = $pdo->prepare("
        SELECT DISTINCT t.id, t.title, t.title_translation, t.content, t.content_translation, t.is_public, t.category_id, t.created_at
        FROM texts t
        JOIN saved_words sw ON t.id = sw.text_id
        WHERE t.user_id = :user_id AND sw.user_id = :user_id_sw
        ORDER BY t.created_at DESC
    ");
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindValue(':user_id_sw', $user_id, PDO::PARAM_INT); // Asegurar que las palabras guardadas también son del usuario
    $stmt->execute();
    $texts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['data'] = $texts;

} catch (PDOException $e) {
    $response['error'] = "Error al obtener los textos para práctica: " . $e->getMessage();
}

echo json_encode($response);
?>
