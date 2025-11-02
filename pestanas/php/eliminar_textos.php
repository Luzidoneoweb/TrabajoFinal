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

    // Preparar la consulta DELETE usando PDO
    // Usamos un marcador de posición para cada ID para evitar inyección SQL
    $placeholders = implode(',', array_fill(0, count($ids_a_eliminar), '?'));
    $sql = "DELETE FROM texts WHERE id IN ($placeholders) AND user_id = ?";

    $stmt = $pdo->prepare($sql);

    if ($stmt === false) {
        throw new Exception('Error al preparar la consulta: ' . implode(" ", $pdo->errorInfo()));
    }

    // Combinar los IDs de los textos y el user_id en un solo array para bindear
    $params = array_merge($ids_a_eliminar, [$user_id]);

    // Ejecutar la consulta
    if ($stmt->execute($params)) {
        if ($stmt->rowCount() > 0) {
            $response = ['success' => true, 'message' => $stmt->rowCount() . ' texto(s) eliminado(s) correctamente.'];
        } else {
            $response = ['success' => false, 'error' => 'No se encontraron textos para eliminar o no tienes permiso para eliminarlos.'];
        }
    } else {
        throw new Exception('Error al ejecutar la eliminación: ' . implode(" ", $stmt->errorInfo()));
    }

} catch (Exception $e) {
    // Capturar cualquier excepción y devolver un error JSON
    error_log('Error en eliminar_textos.php: ' . $e->getMessage());
    $response = ['success' => false, 'error' => $e->getMessage()];
}

ob_end_clean(); // Limpiar el búfer de salida antes de enviar la respuesta JSON
echo json_encode($response);
exit();
?>
