<?php
session_start();
require_once '../db/conexion.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit();
}

if (!isset($_POST['text_id']) || !isset($_POST['content_translation'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit();
}

$user_id = $_SESSION['user_id'];
$text_id = intval($_POST['text_id']);
$content_translation = trim($_POST['content_translation']);

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

// Actualizar la traducción completa del contenido en la tabla texts
try {
    $stmt = $pdo->prepare("UPDATE texts SET content_translation = ? WHERE id = ?");
    $result = $stmt->execute([$content_translation, $text_id]);
    
    if ($result) {
        $rowsAffected = $stmt->rowCount();
        echo json_encode([
            'success' => true, 
            'message' => 'Traducción completa guardada correctamente',
            'rows_affected' => $rowsAffected
        ]);
    } else {
        echo json_encode(['error' => 'Error al ejecutar la actualización']);
    }
} catch (PDOException $e) {
    error_log("Error al guardar traducción completa: " . $e->getMessage());
    echo json_encode(['error' => 'Error al guardar la traducción completa: ' . $e->getMessage()]);
}
?>

