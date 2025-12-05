<?php
header('Content-Type: application/json');

$currentFile = __FILE__;
$phpDir = dirname(__FILE__) . '/php';
$pestanasDir = dirname(__FILE__) . '/pestanas';

$checks = [
    'current_file' => $currentFile,
    'php_dir' => $phpDir,
    'php_dir_exists' => is_dir($phpDir),
    'pestanas_dir' => $pestanasDir,
    'pestanas_dir_exists' => is_dir($pestanasDir),
    'conten_logueado' => $phpDir . '/conten_logueado.php',
    'conten_logueado_exists' => file_exists($phpDir . '/conten_logueado.php'),
    'menu_logueado' => $phpDir . '/menu_logueado.php',
    'menu_logueado_exists' => file_exists($phpDir . '/menu_logueado.php'),
    'conexionLogin' => $pestanasDir . '/php/conexionLogin.php',
    'conexionLogin_exists' => file_exists($pestanasDir . '/php/conexionLogin.php'),
    'server_document_root' => $_SERVER['DOCUMENT_ROOT'],
];

echo json_encode($checks, JSON_PRETTY_PRINT);
?>
