<?php
session_start();
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit();
}

if (!isset($_POST['text_id']) || !isset($_POST['title']) || !isset($_POST['title_translation'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit();
}

$user_id = $_SESSION['user_id'];
$text_id = intval($_POST['text_id']);
$title = trim($_POST['title']);
$title_translation = trim($_POST['title_translation']);

if (empty($title) || empty($title_translation)) {
    echo json_encode(['error' => 'Título y traducción son requeridos']);
    exit();
}

// Verificar que el texto pertenece al usuario o es público
global $pdo;

try {
    $stmt = $pdo->prepare("SELECT id FROM texts WHERE id = ? AND (user_id = ? OR is_public = 1)");
    $stmt->execute([$text_id, $user_id]);
    
    if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['error' => 'Texto no encontrado o no autorizado']);
        exit();
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error verificando autorización: ' . $e->getMessage()]);
    exit();
}

// Actualizar la traducción del título en la tabla texts
try {
    $stmt = $pdo->prepare("UPDATE texts SET title_translation = ? WHERE id = ?");
    $stmt->execute([$title_translation, $text_id]);
    
    echo json_encode(['success' => true, 'message' => 'Traducción del título guardada correctamente']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al guardar la traducción del título: ' . $e->getMessage()]);
}
?>

