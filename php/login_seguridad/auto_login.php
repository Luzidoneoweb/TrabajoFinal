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

// No hay lógica de auto-login con "recordarme"

echo json_encode($response);
?>
