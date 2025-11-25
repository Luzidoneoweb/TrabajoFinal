<?php
// login.php
require_once 'seguridad.php';
ob_start(); // Iniciar el búfer de salida
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "proyecto";
// $host = "sql206.infinityfree.com";
//     $user = "if0_39209868";
//     $pass = "xRe9fa3aAy";
//     $dbname = "if0_39209868_proyecto";

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    ob_end_clean(); // Limpiar el búfer antes de enviar JSON
    echo json_encode(['success'=>false,'message'=>'Método no permitido']); 
    exit;
}

$identifier = limpiar_input($_POST['identifier'] ?? '');
$password = limpiar_input($_POST['password'] ?? ''); // Aplicar limpiar_input a la contraseña

// Validar entrada
if(empty($identifier) || empty($password)){
    ob_end_clean(); // Limpiar el búfer antes de enviar JSON
    echo json_encode(['success'=>false,'message'=>'Credenciales inválidas']); 
    exit;
}


$mysqli = new mysqli($host, $user, $pass, $dbname);
if($mysqli->connect_errno){ 
    ob_end_clean(); // Limpiar el búfer antes de enviar JSON
    echo json_encode(['success'=>false,'message'=>'Error de conexión a la base de datos']); 
    exit; 
}
$mysqli->set_charset('utf8mb4');

$stmt = $mysqli->prepare("SELECT id, password, username, email, is_admin FROM users WHERE username=? OR email=? LIMIT 1");
$stmt->bind_param("ss", $identifier, $identifier);
$stmt->execute();
$res = $stmt->get_result();

if($row = $res->fetch_assoc()){
    if(verificar_password($password, $row['password'])){
        // Login exitoso
        session_regenerate_id(true);
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['email'] = $row['email'];
        $_SESSION['is_admin'] = (bool)$row['is_admin'];
        

        ob_end_clean(); // Limpiar el búfer antes de enviar JSON
        echo json_encode([
            'success' => true,
            'message' => 'Login correcto',
            'username' => $row['username']
        ]);
    } else {
        // Contraseña incorrecta
        ob_end_clean(); // Limpiar el búfer antes de enviar JSON
        echo json_encode(['success'=>false,'message'=>'Contraseña incorrecta']);
    }
} else {
    // Usuario no encontrado
    ob_end_clean(); // Limpiar el búfer antes de enviar JSON
    echo json_encode(['success'=>false,'message'=>'Usuario no encontrado']);
}

$stmt->close();
$mysqli->close();
