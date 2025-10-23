<?php
// login.php
require_once 'seguridad.php';
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
    echo json_encode(['success'=>false,'message'=>'Método no permitido']); 
    exit;
}

$identifier = limpiar_input($_POST['identifier'] ?? '');
$password = limpiar_input($_POST['password'] ?? ''); // Aplicar limpiar_input a la contraseña

// Validar entrada
if(empty($identifier) || empty($password)){
    echo json_encode(['success'=>false,'message'=>'Credenciales inválidas']); 
    exit;
}


$mysqli = new mysqli($host, $user, $pass, $dbname);
if($mysqli->connect_errno){ 
    echo json_encode(['success'=>false,'message'=>'Error de conexión a la base de datos']); 
    exit; 
}
$mysqli->set_charset('utf8mb4');

$stmt = $mysqli->prepare("SELECT id, password, username, email FROM users WHERE username=? OR email=? LIMIT 1");
$stmt->bind_param("ss", $identifier, $identifier);
$stmt->execute();
$res = $stmt->get_result();

if($row = $res->fetch_assoc()){
    if(verificar_password($password, $row['password'])){
        // Login exitoso
        session_regenerate_id(true);
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['email'] = $row['email']; // Usar el email de la DB
        

        // Si el usuario marcó "Recordarme"
        $remember_me = isset($_POST['remember']) && $_POST['remember'] === 'on';
        if ($remember_me) {
            $token_pair = generate_remember_token_pair();
            $selector = $token_pair['selector'];
            $validator = $token_pair['validator'];
            $hashed_validator = hash_validator($validator);
            $expires_at = date('Y-m-d H:i:s', strtotime('+30 days')); // Token válido por 30 días

            // Eliminar tokens antiguos para este usuario (opcional, para limpiar)
            $delete_old_tokens_stmt = $mysqli->prepare("DELETE FROM remember_tokens WHERE user_id = ?");
            $delete_old_tokens_stmt->bind_param("i", $row['id']);
            $delete_old_tokens_stmt->execute();
            $delete_old_tokens_stmt->close();

            // Guardar el nuevo token en la base de datos
            $insert_token_stmt = $mysqli->prepare("INSERT INTO remember_tokens (user_id, selector, hashed_validator, expires_at) VALUES (?, ?, ?, ?)");
            $insert_token_stmt->bind_param("isss", $row['id'], $selector, $hashed_validator, $expires_at);
            $insert_token_stmt->execute();
            $insert_token_stmt->close();

            // Establecer la cookie de "recordarme"
            set_remember_cookie($selector, $validator, $expires_at);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Login correcto',
            'username' => $row['username']
        ]);
    } else {
        // Contraseña incorrecta
        echo json_encode(['success'=>false,'message'=>'Contraseña incorrecta']);
    }
} else {
    // Usuario no encontrado
    echo json_encode(['success'=>false,'message'=>'Usuario no encontrado']);
}

$stmt->close();
$mysqli->close();
