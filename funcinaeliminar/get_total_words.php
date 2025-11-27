<?php
session_start(); // Iniciar la sesión
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

header('Content-Type: application/json');

$response = ['success' => false, 'total_words' => 0, 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['error'] = "Usuario no autenticado.";
    echo json_encode($response);
    exit();
}

$user_id = (int)$_SESSION['user_id'];

try {
    // Obtener el total de palabras guardadas por el usuario
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM saved_words WHERE user_id = :user_id");
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['total_words'] = (int)($result['total'] ?? 0);

} catch (PDOException $e) {
    $response['error'] = "Error al obtener el total de palabras: " . $e->getMessage();
}

echo json_encode($response);
?>
