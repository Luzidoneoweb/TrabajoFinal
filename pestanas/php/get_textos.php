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
    // Asegurar que solo se obtienen textos del usuario logueado
    $stmt = $pdo->prepare("SELECT id, title, title_translation, content, content_translation, is_public, category_id, created_at FROM texts WHERE user_id = :user_id ORDER BY created_at DESC");
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $texts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['data'] = $texts;
    // $response['user_id'] = $user_id; // Para debugging - Eliminado para limpiar consola

} catch (PDOException $e) {
    $response['error'] = "Error al obtener los textos: " . $e->getMessage();
}

echo json_encode($response);
?>
