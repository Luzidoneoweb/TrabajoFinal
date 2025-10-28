<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php'; // Ruta absoluta corregida

header('Content-Type: application/json');
$response = ['success' => false, 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['error'] = 'Usuario no autenticado.';
    echo json_encode($response);
    exit();
}

$user_id = $_SESSION['user_id'];
$titulo = $_POST['titulo'] ?? '';
$contenido = $_POST['contenido'] ?? '';
$is_public = isset($_POST['texto_publico']) ? 1 : 0;
$category_id = $_POST['categoria'] ?? null;

if (empty($contenido)) {
    $response['error'] = 'El contenido del texto no puede estar vacío.';
    echo json_encode($response);
    exit();
}

// Generar título si está vacío
if (empty($titulo)) {
    $words = explode(' ', $contenido);
    $titulo = implode(' ', array_slice($words, 0, 3));
    if (empty($titulo)) {
        $titulo = 'Sin título';
    }
}

try {
    $stmt = $conn->prepare("INSERT INTO texts (user_id, title, content, is_public, category_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issii", $user_id, $titulo, $contenido, $is_public, $category_id);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['id'] = $conn->insert_id;
    } else {
        $response['error'] = 'Error al insertar el texto: ' . $stmt->error;
    }

    $stmt->close();
} catch (Exception $e) {
    $response['error'] = 'Excepción: ' . $e->getMessage();
} finally {
    $conn->close();
}

echo json_encode($response);
?>
