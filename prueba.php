<?php
$host = 'sql206.infinityfree.com'; // O usa la dirección remota si es necesario
$dbname = 'if0_39209868_proyecto';
$username = 'if0_39209868';
$password = 'xRe9fa3aAy';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    echo 'Conexión exitosa a la base de datos';
} catch (PDOException $e) {
    echo 'Error al conectar: ' . $e->getMessage();
}
?>
<h1>Prueba de conexión</h1>
