<?php
// Limpiar cualquier buffer anterior
if (ob_get_level() > 0) {
    ob_end_clean();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/php/conexionLogin.php';


// Headers ANTES de cualquier output
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Validar sesión
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

$user_id = intval($_SESSION['user_id']);

// Obtener palabras guardadas de un texto específico
if (isset($_GET['get_words_by_text']) && isset($_GET['text_id'])) {
    $text_id = intval($_GET['text_id']);
    
    try {
        $query = "SELECT sw.id, sw.word, sw.translation, sw.context, sw.text_id, t.title as text_title 
                  FROM saved_words sw 
                  LEFT JOIN texts t ON sw.text_id = t.id 
                  WHERE sw.user_id = :user_id AND sw.text_id = :text_id 
                  ORDER BY sw.created_at ASC";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':text_id', $text_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $words = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'words' => $words]);
        exit();
    } catch (PDOException $e) {
        error_log("Exception: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        exit();
    }
}

// Obtener todas las palabras guardadas del usuario (ordenadas por texto y fecha)
if (isset($_GET['get_all_words'])) {
    try {
        $query = "SELECT sw.id, sw.word, sw.translation, sw.context, sw.text_id, t.title as text_title 
                  FROM saved_words sw 
                  LEFT JOIN texts t ON sw.text_id = t.id 
                  WHERE sw.user_id = :user_id 
                  ORDER BY sw.text_id ASC, sw.created_at ASC";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $words = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'words' => $words]);
        exit();
    } catch (PDOException $e) {
        error_log("Exception: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        exit();
    }
}

// Obtener palabras guardadas del usuario para práctica (aleatorias)
if (isset($_GET['get_random_words'])) {
    try {
        $stmt = $pdo->prepare("SELECT word, translation, context FROM saved_words WHERE user_id = :user_id ORDER BY RAND()");
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $words = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'words' => $words]);
        exit();
    } catch (PDOException $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
        exit();
    }
}

// Endpoint para obtener el número de palabras de un texto específico
if (isset($_GET['get_word_count']) && isset($_GET['text_id'])) {
    $text_id = intval($_GET['text_id']);
    
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as word_count FROM saved_words WHERE user_id = :user_id AND text_id = :text_id");
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':text_id', $text_id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'word_count' => $data['word_count']]);
        exit();
    } catch (PDOException $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
        exit();
    }
}

// Por defecto, retornar error
http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Parámetro inválido']);
exit();
?>
