<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';
//require_once '../php/login_seguridad/seguridad.php';