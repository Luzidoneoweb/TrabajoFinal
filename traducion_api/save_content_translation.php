<?php
session_start();
require_once '../db/conexion.php';

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
    $stmt = $pdo->prepare("SELECT id, content_translation FROM texts WHERE id = ? AND (user_id = ? OR is_public = 1)");
    $stmt->execute([$text_id, $user_id]);
    $text_data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$text_data) {
        echo json_encode(['error' => 'Texto no encontrado o no autorizado']);
        exit();
    }
    
    // Cargar las traducciones existentes o crear un array vacío
    $translations = [];
    if (!empty($text_data['content_translation'])) {
        $decoded = json_decode($text_data['content_translation'], true);
        if (is_array($decoded)) {
            $translations = $decoded;
        }
    }
    
    // Agregar o actualizar la traducción de esta frase
    $translations[] = [
        'content' => $content,
        'translation' => $translation
    ];
    
    // Guardar el array actualizado como JSON
    $json_translations = json_encode($translations, JSON_UNESCAPED_UNICODE);
    
    $stmt = $pdo->prepare("UPDATE texts SET content_translation = ? WHERE id = ?");
    $stmt->execute([$json_translations, $text_id]);
    
    echo json_encode(['success' => true, 'message' => 'Traducción de contenido guardada correctamente']);
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al guardar traducción: ' . $e->getMessage()]);
    exit();
}
?>
