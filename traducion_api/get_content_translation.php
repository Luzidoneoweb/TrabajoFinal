<?php
session_start();
require_once 'conexion.php';
require_once 'content_functions.php';

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

// Obtener la traducción del contenido
$translation = getContentTranslation($text_id);

if ($translation) {
    // El nuevo formato JSON siempre devuelve un array de traducciones
    echo json_encode([
        'success' => true,
        'text_id' => $text_id,
        'title' => $text_data['title'],
        'content' => $text_data['content'],
        'translation' => $translation,
        'format' => 'json', // Siempre json con el nuevo getContentTranslation
        'source' => 'database'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'text_id' => $text_id,
        'title' => $text_data['title'],
        'content' => $text_data['content'],
        'translation' => null,
        'needs_translation' => true
    ]);
}
?>
