<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/php/conexionLogin.php';


header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (function_exists('ob_get_length')) { 
    while (ob_get_level() > 0) { 
        ob_end_clean(); 
    } 
}

error_log("ajax_user_texts.php - Inicio de petición");

if (!isset($_SESSION['user_id'])) {
    error_log("ajax_user_texts.php - Usuario no autenticado");
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

$user_id = $_SESSION['user_id'];
error_log("ajax_user_texts.php - User ID: " . $user_id);

// Modo API JSON para práctica: listar textos con palabras guardadas
if (strtoupper($_SERVER['REQUEST_METHOD']) === 'POST' && isset($_POST['action']) && $_POST['action'] === 'list') {
    error_log("ajax_user_texts.php - Procesando acción list");
    
    $texts = [];

    try {
        // Textos propios que tienen palabras guardadas
        $query1 = "SELECT DISTINCT t.id, t.title, t.title_translation, t.user_id, 'own' as text_type 
                   FROM texts t 
                   INNER JOIN saved_words sw ON t.id = sw.text_id 
                   WHERE t.user_id = :user_id AND sw.user_id = :user_id2 
                   ORDER BY t.created_at DESC 
                   LIMIT 500";
        
        error_log("ajax_user_texts.php - Ejecutando query para textos propios");
        $stmt1 = $pdo->prepare($query1);
        $stmt1->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt1->bindValue(':user_id2', $user_id, PDO::PARAM_INT);
        $stmt1->execute();
        
        $ownTexts = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        $ownCount = count($ownTexts);
        error_log("ajax_user_texts.php - Textos propios encontrados: " . $ownCount);
        $texts = array_merge($texts, $ownTexts);

        // Textos públicos con palabras guardadas
        $query2 = "SELECT DISTINCT t.id, t.title, t.title_translation, t.user_id, 'public' as text_type 
                   FROM texts t 
                   INNER JOIN saved_words sw ON t.id = sw.text_id 
                   WHERE sw.user_id = :user_id AND t.is_public = 1 AND t.user_id != :user_id2 
                   ORDER BY t.title ASC 
                   LIMIT 500";
        
        error_log("ajax_user_texts.php - Ejecutando query para textos públicos");
        $stmt2 = $pdo->prepare($query2);
        $stmt2->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt2->bindValue(':user_id2', $user_id, PDO::PARAM_INT);
        $stmt2->execute();
        
        $pubTexts = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        $pubCount = count($pubTexts);
        error_log("ajax_user_texts.php - Textos públicos encontrados: " . $pubCount);
        $texts = array_merge($texts, $pubTexts);

        error_log("ajax_user_texts.php - Total textos: " . count($texts));
        echo json_encode(['success' => true, 'texts' => $texts]);
        exit();
    } catch (PDOException $e) {
        error_log("ajax_user_texts.php - Excepción: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        exit();
    }
}

// Fallback - devolver error
echo json_encode(['success' => false, 'message' => 'Parámetro inválido']);
?>
