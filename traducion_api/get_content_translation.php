<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit();
}

if (!isset($_GET['text_id'])) {
    echo json_encode(['error' => 'ID de texto requerido']);
    exit();
}

$user_id = $_SESSION['user_id'];
$text_id = intval($_GET['text_id']);

// Verificar que el texto pertenece al usuario o es público
global $pdo; // Asegúrate de que la conexión PDO esté disponible

try {
    $stmt = $pdo->prepare("SELECT id, title, content FROM texts WHERE id = ? AND (user_id = ? OR is_public = 1)");
    $stmt->execute([$text_id, $user_id]);
    $text_data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$text_data) {
        echo json_encode(['error' => 'Texto no encontrado o no autorizado']);
        exit();
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error verificando autorización: ' . $e->getMessage()]);
    exit();
}

// Obtener las traducciones desde texts.content_translation como JSON
// Si no hay traducciones, devolver array vacío
try {
    $translation = [];
    
    $stmt = $pdo->prepare("SELECT content_translation FROM texts WHERE id = ?");
    $stmt->execute([$text_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result && !empty($result['content_translation'])) {
        $contentTranslation = $result['content_translation'];
        $decoded = json_decode($contentTranslation, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $translation = $decoded;
        }
    }
    
    // Siempre devolver éxito con array de traducciones (puede estar vacío)
    echo json_encode([
        'success' => true,
        'text_id' => $text_id,
        'title' => $text_data['title'],
        'content' => $text_data['content'],
        'translation' => $translation,
        'needs_translation' => empty($translation)
    ]);
} catch (PDOException $e) {
    // En caso de error, devolver respuesta JSON válida sin traducciones
    echo json_encode([
        'success' => true,
        'text_id' => $text_id,
        'title' => $text_data['title'],
        'content' => $text_data['content'],
        'translation' => [],
        'needs_translation' => true
    ]);
}
?>
