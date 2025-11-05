<?php
session_start();
require_once 'conexion.php';
require_once 'content_functions.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit();
}

if (!isset($_POST['text_id']) || !isset($_POST['content']) || !isset($_POST['translation'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit();
}

$user_id = $_SESSION['user_id'];
$text_id = intval($_POST['text_id']);
$content = trim($_POST['content']);
$translation = trim($_POST['translation']);

if (empty($content) || empty($translation)) {
    echo json_encode(['error' => 'Contenido y traducción son requeridos']);
    exit();
}

// Verificar que el texto pertenece al usuario o es público
global $pdo; // Asegúrate de que la conexión PDO esté disponible

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

// Guardar la traducción del contenido
$result = saveContentTranslation($text_id, $content, $translation);

if ($result['success']) {
    echo json_encode(['success' => true, 'message' => 'Traducción de contenido guardada correctamente']);
} else {
    echo json_encode(['error' => $result['error']]);
}
?>
