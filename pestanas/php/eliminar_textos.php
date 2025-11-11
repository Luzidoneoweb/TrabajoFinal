<?php
// Asegurarse de que no se imprima nada antes de la respuesta JSON
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0); // Desactivar la visualización de errores para no romper el JSON

header('Content-Type: application/json');

// Incluir el archivo de seguridad para verificar la sesión (ya inicia session_start())
require_once '../../php/login_seguridad/seguridad.php';
// Incluir el archivo de conexión a la base de datos
require_once '../../db/conexion.php'; 

$response = ['success' => false, 'error' => 'Un error desconocido ha ocurrido.'];

try {
    // Verificar si el usuario está logueado
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Usuario no autenticado.');
    }

    $user_id = $_SESSION['user_id'];

    // Obtener los IDs de los textos a eliminar del cuerpo de la solicitud JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['ids']) || !is_array($data['ids']) || empty($data['ids'])) {
        throw new Exception('No se proporcionaron IDs de textos para eliminar.');
    }

    $ids_a_eliminar = $data['ids'];

    // Iniciar una transacción para asegurar la atomicidad
    $pdo->beginTransaction();

    try {
        // 1. Eliminar palabras asociadas a los textos
        $placeholders_words = implode(',', array_fill(0, count($ids_a_eliminar), '?'));
        $sql_delete_words = "DELETE FROM saved_words WHERE text_id IN ($placeholders_words) AND user_id = ?";
        $stmt_words = $pdo->prepare($sql_delete_words);

        if ($stmt_words === false) {
            throw new Exception('Error al preparar la consulta de eliminación de palabras: ' . implode(" ", $pdo->errorInfo()));
        }

        $params_words = array_merge($ids_a_eliminar, [$user_id]);
        $stmt_words->execute($params_words);
        $words_deleted_count = $stmt_words->rowCount();

        // 2. Eliminar los textos
        $placeholders_texts = implode(',', array_fill(0, count($ids_a_eliminar), '?'));
        $sql_delete_texts = "DELETE FROM texts WHERE id IN ($placeholders_texts) AND user_id = ?";
        $stmt_texts = $pdo->prepare($sql_delete_texts);

        if ($stmt_texts === false) {
            throw new Exception('Error al preparar la consulta de eliminación de textos: ' . implode(" ", $pdo->errorInfo()));
        }

        $params_texts = array_merge($ids_a_eliminar, [$user_id]);
        $stmt_texts->execute($params_texts);
        $texts_deleted_count = $stmt_texts->rowCount();

        if ($texts_deleted_count > 0) {
            $pdo->commit(); // Confirmar la transacción
            $response = [
                'success' => true,
                'message' => "$texts_deleted_count texto(s) y $words_deleted_count palabra(s) asociada(s) eliminado(s) correctamente."
            ];
        } else {
            $pdo->rollBack(); // Revertir si no se eliminaron textos
            $response = ['success' => false, 'error' => 'No se encontraron textos para eliminar o no tienes permiso para eliminarlos.'];
        }

    } catch (Exception $e) {
        $pdo->rollBack(); // Revertir la transacción en caso de error
        error_log('Error en eliminar_textos.php: ' . $e->getMessage());
        $response = ['success' => false, 'error' => $e->getMessage()];
    }

} catch (Exception $e) {
    // Capturar cualquier excepción y devolver un error JSON
    error_log('Error en eliminar_textos.php (fuera de transacción): ' . $e->getMessage());
    $response = ['success' => false, 'error' => $e->getMessage()];
}

ob_end_clean(); // Limpiar el búfer de salida antes de enviar la respuesta JSON
echo json_encode($response);
exit();
?>
