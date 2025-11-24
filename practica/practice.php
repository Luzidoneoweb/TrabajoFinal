<?php
session_start();
require_once 'db/connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

// Manejar guardado de progreso de práctica
if (isset($_POST['guardar_progreso_practica'])) {
$id_usuario = $_SESSION['user_id'];
    $modo = $_POST['modo'] ?? '';
    $total_palabras = intval($_POST['total_palabras'] ?? 0);
    $respuestas_correctas = intval($_POST['respuestas_correctas'] ?? 0);
    $respuestas_incorrectas = intval($_POST['respuestas_incorrectas'] ?? 0);
    $precision = floatval($_POST['precision'] ?? 0);

    $stmt = $conn->prepare("INSERT INTO practice_progress (user_id, mode, total_words, correct_answers, incorrect_answers, accuracy) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isiiid", $id_usuario, $modo, $total_palabras, $respuestas_correctas, $respuestas_incorrectas, $precision);
    $success = $stmt->execute();
$stmt->close();
$conn->close();
    
    echo json_encode(['success' => $success]);
    exit;
}

// Manejar otras peticiones de práctica si las hay
echo json_encode(['success' => false, 'error' => 'Acción no reconocida']);
?>
