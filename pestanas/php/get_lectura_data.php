<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/php/conexionLogin.php';

header('Content-Type: application/json');

$response = ['success' => false, 'data' => null, 'error' => ''];

// Para propósitos de prueba, no se requiere autenticación.
// En un entorno de producción, se debería verificar $_SESSION['user_id']
// y asegurar que el texto pertenece al usuario logueado.

if (!isset($_GET['id'])) {
    $response['error'] = "ID de texto no proporcionado.";
    echo json_encode($response);
    exit();
}

$text_id = (int)$_GET['id'];

try {
    $stmt = $pdo->prepare("SELECT title, title_translation, content, content_translation FROM texts WHERE id = :id");
    $stmt->bindValue(':id', $text_id, PDO::PARAM_INT);
    $stmt->execute();
    $text_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($text_data) {
        $response['success'] = true;
        $response['data'] = $text_data;
    } else {
        $response['error'] = "Texto no encontrado.";
    }

} catch (PDOException $e) {
    $response['error'] = "Error al obtener el texto: " . $e->getMessage();
}

echo json_encode($response);
?>
