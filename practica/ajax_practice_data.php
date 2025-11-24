<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Endpoint para obtener el número de palabras de un texto específico
if (isset($_GET['get_word_count']) && isset($_GET['text_id'])) {
    $text_id = intval($_GET['text_id']);
    
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as word_count FROM saved_words WHERE user_id = :user_id AND text_id = :text_id");
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':text_id', $text_id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(['word_count' => $data['word_count']]);
        exit();
    } catch (PDOException $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['error' => 'Error en la base de datos']);
        exit();
    }
}

// Obtener palabras guardadas del usuario para práctica
try {
    $stmt = $pdo->prepare("SELECT word, translation, context FROM saved_words WHERE user_id = :user_id ORDER BY RAND()");
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $words = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['words' => $words]);
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['error' => 'Error en la base de datos']);
}
?>
