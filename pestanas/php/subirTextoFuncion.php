<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/php/conexionLogin.php';


header('Content-Type: application/json; charset=utf-8');
$response = ['success' => false, 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    $response['error'] = 'Usuario no autenticado.';
    echo json_encode($response);
    exit();
}

$user_id = (int)$_SESSION['user_id'];
$titulo = $_POST['titulo'] ?? '';
$contenido = $_POST['contenido'] ?? '';
$is_public = isset($_POST['texto_publico']) ? 1 : 0;
$category_id = isset($_POST['categoria']) && $_POST['categoria'] !== '' ? (int)$_POST['categoria'] : null;

if (trim($contenido) === '') {
    http_response_code(400);
    $response['error'] = 'El contenido del texto no puede estar vacío.';
    echo json_encode($response);
    exit();
}

// Generar título si está vacío
if (trim($titulo) === '') {
    $words = preg_split('/\s+/', trim($contenido));
    $titulo = implode(' ', array_slice($words, 0, 3)) ?: 'Sin título';
}

try {
    $stmt = $pdo->prepare('INSERT INTO texts (user_id, title, content, is_public, category_id) VALUES (:user_id, :title, :content, :is_public, :category_id)');
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindValue(':title', $titulo, PDO::PARAM_STR);
    $stmt->bindValue(':content', $contenido, PDO::PARAM_STR);
    $stmt->bindValue(':is_public', $is_public, PDO::PARAM_INT);
    if ($category_id === null) {
        $stmt->bindValue(':category_id', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['id'] = (int)$pdo->lastInsertId();
    } else {
        http_response_code(500);
        $response['error'] = 'No se pudo insertar el texto';
    }
} catch (PDOException $e) {
    http_response_code(500);
    $response['error'] = 'Excepción: ' . $e->getMessage();
}

echo json_encode($response);
?>
