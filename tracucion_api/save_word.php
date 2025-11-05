<?php
session_start();
require_once 'conexion.php';

if (!isset($_SESSION['user_id'])) {
    echo "Debes iniciar sesión.";
    exit();
}

if (!isset($_POST['word']) || !isset($_POST['translation'])) {
    echo "Faltan datos.";
    exit();
}

$user_id = $_SESSION['user_id'];
$word = $_POST['word'];
$translation = $_POST['translation'];

// Puedes guardar contexto, por ahora se deja vacío
$context = '';

global $pdo; // Asegúrate de que la conexión PDO esté disponible

try {
    $stmt = $pdo->prepare("INSERT INTO saved_words (user_id, word, translation, context) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $word, $translation, $context]);
    echo "Palabra guardada correctamente.";
} catch (PDOException $e) {
    echo "Error al guardar la palabra: " . $e->getMessage();
}
?>
