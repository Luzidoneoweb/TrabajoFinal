<?php
// auto_login.php
require_once 'seguridad.php';
header('Content-Type: application/json; charset=utf-8');

$host = " localhost ";
$user = "root";
$pass = "";
$dbname = "proyecto" ;
// $host = "sql206.infinityfree.com";
//     $user = "if0_39209868";
//     $pass = "xRe9fa3aAy";
//     $dbname = "if0_39209868_proyecto";

$response = [
    'logged_in' => false,
    'username' => null,
    'user_id' => null
];

// Si ya hay una sesión activa, no es necesario el auto-login
if (isset($_SESSION['user_id'])) {
    $response['logged_in'] = true;
    $response['user_id'] = $_SESSION['user_id'];
    $response['username'] = $_SESSION['username'];
    echo json_encode($response);
    exit;
}

// Verificar si existe la cookie de "recordarme"
if (isset($_COOKIE['remember_me'])) {
    list($selector, $validator) = explode(':', $_COOKIE['remember_me']);

    if (empty($selector) || empty($validator)) {
        delete_remember_cookie(); // Cookie mal formada
        echo json_encode($response);
        exit;
    }

    $mysqli = new mysqli($host, $user, $pass, $dbname);
    if ($mysqli->connect_errno) {
        // En caso de error de DB, simplemente no loguear automáticamente
        error_log("Error de conexión a la base de datos en auto_login: " . $mysqli->connect_error);
        delete_remember_cookie();
        echo json_encode($response);
        exit;
    }
    $mysqli->set_charset('utf8mb4');

    $stmt = $mysqli->prepare("SELECT rt.user_id, rt.hashed_validator, rt.expires_at, u.username, u.email 
                              FROM remember_tokens rt 
                              JOIN users u ON rt.user_id = u.id 
                              WHERE rt.selector = ? LIMIT 1");
    $stmt->bind_param("s", $selector);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($row = $res->fetch_assoc()) {
        // Verificar si el token ha expirado
        if (strtotime($row['expires_at']) < time()) {
            // Token expirado, eliminar de la DB y la cookie
            $delete_stmt = $mysqli->prepare("DELETE FROM remember_tokens WHERE selector = ?");
            $delete_stmt->bind_param("s", $selector);
            $delete_stmt->execute();
            $delete_stmt->close();
            delete_remember_cookie();
        } elseif (password_verify($validator, $row['hashed_validator'])) {
            // Token válido, solo devolver el identificador (email) sin iniciar sesión
            $response['remembered_identifier'] = $row['email'];
            // No se inicia sesión automáticamente aquí
        } else {
            // Validator no coincide, token inválido, eliminar de la DB y la cookie
            $delete_stmt = $mysqli->prepare("DELETE FROM remember_tokens WHERE selector = ?");
            $delete_stmt->bind_param("s", $selector);
            $delete_stmt->execute();
            $delete_stmt->close();
            delete_remember_cookie();
        }
    } else {
        // Selector no encontrado, token inválido, eliminar la cookie
        delete_remember_cookie();
    }
    $stmt->close();
    $mysqli->close();
}

echo json_encode($response);
?>
