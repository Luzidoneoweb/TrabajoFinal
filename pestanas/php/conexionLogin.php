<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once dirname(__FILE__) . '/../../db/conexion.php';
//require_once '../php/login_seguridad/seguridad.php';