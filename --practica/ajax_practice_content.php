<?php
session_start();
require_once '../db/conexion.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'No autorizado']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Obtener parámetros
$texto_id = isset($_POST['texto_id']) ? intval($_POST['texto_id']) : null;
$modo = isset($_POST['modo']) ? $_POST['modo'] : 'seleccion';

// Si no hay texto_id, retornar error
if (!$texto_id) {
    echo json_encode(['success' => false, 'error' => 'ID de texto no proporcionado']);
    exit();
}

// Obtener las palabras guardadas para este texto específico
$stmt = $conn->prepare("
    SELECT sw.id, sw.word, sw.translation, sw.context, t.title, t.content 
    FROM saved_words sw
    INNER JOIN texts t ON sw.text_id = t.id
    WHERE sw.user_id = ? AND sw.text_id = ?
    ORDER BY RAND()
    LIMIT 10
");
$stmt->bind_param("ii", $user_id, $texto_id);
$stmt->execute();
$result = $stmt->get_result();
$palabras = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();
$conn->close();

// Obtener el título del texto
$titulo_texto = !empty($palabras) ? $palabras[0]['title'] : 'Texto';

if (empty($palabras)) {
    echo json_encode([
        'success' => false,
        'error' => 'No hay palabras guardadas para este texto',
        'titulo' => $titulo_texto
    ]);
    exit();
}

// Devolver datos en JSON
echo json_encode([
    'success' => true,
    'titulo' => $titulo_texto,
    'modo' => $modo,
    'texto_id' => $texto_id,
    'palabras' => $palabras
]);
?>
