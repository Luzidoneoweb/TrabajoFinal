<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Endpoint para obtener el número de palabras de un texto específico
if (isset($_GET['get_word_count']) && isset($_GET['text_id'])) {
    $text_id = intval($_GET['text_id']);
    
    $stmt = $conn->prepare("SELECT COUNT(*) as word_count FROM saved_words WHERE user_id = ? AND text_id = ?");
    $stmt->bind_param("ii", $user_id, $text_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    
    echo json_encode(['word_count' => intval($data['word_count'])]);
    $stmt->close();
    $conn->close();
    exit();
}

// Endpoint para obtener las palabras guardadas de un texto específico
if (isset($_GET['get_words_by_text']) && isset($_GET['text_id'])) {
    $text_id = intval($_GET['text_id']);
    
    $stmt = $conn->prepare("SELECT sw.word, sw.translation, sw.context, sw.text_id, t.title as text_title FROM saved_words sw LEFT JOIN texts t ON sw.text_id = t.id WHERE sw.user_id = ? AND sw.text_id = ? ORDER BY sw.created_at DESC");
    $stmt->bind_param("ii", $user_id, $text_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $words = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'words' => $words]);
    $stmt->close();
    $conn->close();
    exit();
}

// Procesar eliminación de palabra individual
if (isset($_POST['delete_word'])) {
    $word_to_delete = $_POST['word_to_delete'];
    $stmt = $conn->prepare("DELETE FROM saved_words WHERE user_id = ? AND word = ?");
    $stmt->bind_param("is", $user_id, $word_to_delete);
    if ($stmt->execute()) {
        $success_message = "Palabra eliminada correctamente.";
    } else {
        $error_message = "Error al eliminar la palabra.";
    }
    $stmt->close();
}

// Procesar acción en lote para eliminar palabras seleccionadas via AJAX
if (isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_POST['selected_words'])) {
    $deleted_count = 0;
    $errors = [];
    
    foreach ($_POST['selected_words'] as $word_info) {
        list($word, $text_id) = explode('|', $word_info);
        $stmt = $conn->prepare("DELETE FROM saved_words WHERE user_id = ? AND word = ? AND (text_id = ? OR (text_id IS NULL AND ? = 0))");
        $stmt->bind_param("isii", $user_id, $word, $text_id, $text_id);
        if ($stmt->execute()) {
            $deleted_count++;
        } else {
            $errors[] = "Error eliminando: $word";
        }
        $stmt->close();
    }
    
    if (empty($errors)) {
        echo json_encode(['success' => true, 'message' => "$deleted_count palabra(s) eliminada(s) correctamente."]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar algunas palabras.']);
    }
    exit();
}

// Obtener palabras guardadas del usuario, con título del texto
$stmt = $conn->prepare("SELECT sw.word, sw.translation, sw.context, sw.created_at, sw.text_id, t.title as text_title FROM saved_words sw LEFT JOIN texts t ON sw.text_id = t.id WHERE sw.user_id = ? ORDER BY t.title, sw.created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$words = $result->fetch_all(MYSQLI_ASSOC);

// Agrupar palabras por texto
$words_by_text = [];
foreach ($words as $word) {
    $title = $word['text_title'] ?? 'Sin texto asociado';
    $words_by_text[$title][] = $word;
}
?>
