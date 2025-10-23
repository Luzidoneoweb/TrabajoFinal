<?php
// verificar_sesion.php
session_start();
header('Content-Type: application/json; charset=utf-8');

$response = [
    'logged_in' => false,
    'username' => null,
    'user_id' => null
];

if (isset($_SESSION['user_id'])) {
    $response['logged_in'] = true;
    $response['user_id'] = $_SESSION['user_id'];
    
    // Obtener el nombre de usuario de la base de datos
    // Usar configuración de producción
    // $host = "sql206.infinityfree.com";
    // $user = "if0_39209868";
    // $pass = "xRe9fa3aAy";
    // $dbname = "if0_39209868_proyecto";
    //   // Obtener el nombre de usuario de la base de datos
      $host = "localhost";
      $user = "root";
      $pass = "";
      $dbname = "traductor_app";
    $mysqli = new mysqli($host, $user, $pass, $dbname);
    if (!$mysqli->connect_errno) {
        $mysqli->set_charset('utf8mb4');
        $stmt = $mysqli->prepare("SELECT username FROM users WHERE id = ? LIMIT 1");
        if ($stmt) {
            $stmt->bind_param("i", $_SESSION['user_id']);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                $response['username'] = $row['username'];
            }
            $stmt->close();
        }
    } else {
        // Log error en producción (opcional)
        error_log("Error de conexión a BD en verificar_sesion.php: " . $mysqli->connect_error);
    }
    $mysqli->close();
}

echo json_encode($response);
?>
