<?php
session_start();
require_once '../db/conexion.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (function_exists('ob_get_length')) { while (ob_get_level()>0) { ob_end_clean(); } }

// Log para debugging
error_log("ajax_textos_usuario.php - Inicio de la petición");

if (!isset($_SESSION['user_id'])) {
error_log("ajax_textos_usuario.php - Usuario no autenticado");
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

$id_usuario = $_SESSION['user_id'];
error_log("ajax_textos_usuario.php - User ID: " . $id_usuario);

try {
    // Modo para listar textos con palabras guardadas
    if (strtoupper($_SERVER['REQUEST_METHOD']) === 'POST' && isset($_POST['accion']) && $_POST['accion'] === 'listar') {
        // Consulta simplificada: obtener textos que tienen palabras guardadas
        $stmt = $conn->prepare(
            "SELECT DISTINCT t.id, t.title, t.title_translation, t.user_id, 
             CASE WHEN t.user_id = ? THEN 'propio' ELSE 'publico' END as tipo_texto 
             FROM texts t 
             INNER JOIN saved_words sw ON t.id = sw.text_id 
             WHERE sw.user_id = ? 
             ORDER BY t.title ASC"
        );
        
        if (!$stmt) {
            error_log("ajax_user_texts.php - Error preparando statement: " . $conn->error);
            echo json_encode(['success' => false, 'message' => 'Error de base de datos']);
            exit();
        }
        
        $stmt->bind_param('ii', $id_usuario, $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        $textos = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        error_log("ajax_user_texts.php - Se encontraron " . count($textos) . " textos para el usuario " . $id_usuario);
        echo json_encode(['success' => true, 'textos' => $textos]);
        $conn->close();
        exit();
    }

} catch (Exception $e) {
    error_log("ajax_user_texts.php - Excepción: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}
?>
