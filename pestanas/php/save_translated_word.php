<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit();
}

if (isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!isset($_POST['selected_words']) || !is_array($_POST['selected_words'])) {
        echo json_encode(['success' => false, 'message' => 'No se han recibido palabras para eliminar.']);
        exit();
    }

    $user_id = $_SESSION['user_id'];
    $deleted_count = 0;
    $errors = [];

    foreach ($_POST['selected_words'] as $word_data) {
        list($word, $text_id_str) = explode('|', $word_data, 2);
        $text_id = (int)$text_id_str; // Convertir a entero

        // Si text_id es 0, significa que no hay texto asociado (NULL en la DB)
        $text_id_for_query = ($text_id === 0) ? null : $text_id;

        try {
            if ($text_id_for_query === null) {
                $stmt = $conn->prepare("DELETE FROM saved_words WHERE user_id = ? AND word = ? AND text_id IS NULL");
                $stmt->bind_param("is", $user_id, $word);
            } else {
                $stmt = $conn->prepare("DELETE FROM saved_words WHERE user_id = ? AND word = ? AND text_id = ?");
                $stmt->bind_param("isi", $user_id, $word, $text_id_for_query);
            }
            
            if ($stmt->execute()) {
                $deleted_count += $stmt->affected_rows;
            } else {
                $errors[] = "Error al eliminar la palabra '{$word}' (text_id: {$text_id_str}): " . $stmt->error;
            }
            $stmt->close();
        } catch (Exception $e) {
            $errors[] = "Excepción al eliminar la palabra '{$word}' (text_id: {$text_id_str}): " . $e->getMessage();
        }
    }

    if (empty($errors)) {
        echo json_encode(['success' => true, 'message' => "{$deleted_count} palabras eliminadas correctamente."]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Se eliminaron algunas palabras, pero hubo errores: ' . implode('; ', $errors), 'errors' => $errors]);
    }
    $conn->close();
    exit();
}

// Lógica para obtener todas las palabras (para cargar la lista inicial)
if (isset($_GET['get_all_words']) && $_GET['get_all_words'] === 'true') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Usuario no autenticado']);
        exit();
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT sw.word, sw.translation, sw.context, sw.created_at, sw.text_id, t.title as text_title FROM saved_words sw LEFT JOIN texts t ON sw.text_id = t.id WHERE sw.user_id = ? ORDER BY t.title, sw.created_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $words = $result->fetch_all(MYSQLI_ASSOC);

    $words_by_text = [];
    $total_words_saved = 0;
    foreach ($words as $word) {
        $title = $word['text_title'] ?? 'Sin texto asociado';
        $words_by_text[$title][] = $word;
        $total_words_saved++;
    }

    echo json_encode(['success' => true, 'words_by_text' => $words_by_text, 'total_words_saved' => $total_words_saved]);
    $conn->close();
    exit();
}

// Lógica para guardar una palabra (existente)
if (!isset($_POST['word']) || !isset($_POST['translation'])) {
    echo json_encode(['error' => 'Datos incompletos para guardar/actualizar']);
    exit();
}

$user_id = $_SESSION['user_id'];
$word = trim($_POST['word']);
$translation = trim($_POST['translation']);
$context = isset($_POST['context']) ? trim($_POST['context']) : '';

$text_id = null;
if (isset($_POST['text_id']) && is_numeric($_POST['text_id'])) {
    $text_id = intval($_POST['text_id']);
} elseif (isset($_GET['text_id']) && is_numeric($_GET['text_id'])) {
    $text_id = intval($_GET['text_id']);
} elseif (isset($_SERVER['HTTP_REFERER'])) {
    if (preg_match('/[?&]text_id=(\d+)/', $_SERVER['HTTP_REFERER'], $matches)) {
        $text_id = intval($matches[1]);
    }
}

// Si text_id es 0, se considera NULL para la base de datos
$text_id_for_db = ($text_id === 0) ? null : $text_id;

if (empty($word) || empty($translation)) {
    echo json_encode(['error' => 'Palabra y traducción son requeridas']);
    exit();
}

try {
    // Verificar si la palabra ya existe para este usuario y texto
    // Se ajusta la consulta para manejar text_id IS NULL correctamente
    $stmt = $conn->prepare("SELECT id FROM saved_words WHERE user_id = ? AND word = ? AND (text_id = ? OR (text_id IS NULL AND ? IS NULL))");
    $stmt->bind_param("isis", $user_id, $word, $text_id_for_db, $text_id_for_db);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Actualizar traducción existente
        $stmt = $conn->prepare("UPDATE saved_words SET translation = ?, context = ?, text_id = ?, created_at = NOW() WHERE user_id = ? AND word = ? AND (text_id = ? OR (text_id IS NULL AND ? IS NULL))");
        $stmt->bind_param("sssisis", $translation, $context, $text_id_for_db, $user_id, $word, $text_id_for_db, $text_id_for_db);
    } else {
        // Insertar nueva palabra
        $stmt = $conn->prepare("INSERT INTO saved_words (user_id, word, translation, context, text_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("isssi", $user_id, $word, $translation, $context, $text_id_for_db);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Palabra guardada correctamente']);
    } else {
        echo json_encode(['error' => 'Error al guardar la palabra']);
    }
    
    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>
