<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/php/login_seguridad/seguridad.php'; ?>
 <!-- <?php //include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/php/loading_message.php'; ?> 
<link rel="stylesheet" href="pestanas/css/loading_message.css">
<script src="pestanas/js/loading_message.js"></script> -->

<div class="contenedor-textos">
    <div id="notificacion-flotante" class="notificacion-flotante">
        <p id="notificacion-mensaje"></p>
    </div>
    <div class="encabezado-textos">
        <p class="contador-textos">...textos encontrados</p>
        <div class="acciones-grupo">
            <div class="desplegable-acciones">
                <button class="btn-desplegable">Acciones en lote <span class="icono-flecha">▼</span></button>
                <div class="contenido-desplegable">
                    <a href="#">Marcar como leído</a>
                    <a href="#">Marcar como no leído</a>
                    <a href="#">Hacer público</a>
                    <a href="#">Hacer privado</a>
                    <a href="#" id="btn-eliminar-textos">Eliminar</a>
                </div>
            </div>
            <button class="btn-publicos">Textos públicos</button>
        </div>
    </div>

    <div class="lista-textos">
    </div>

    <div class="visor-texto">
        <!-- Aquí se mostrará el contenido del texto seleccionado -->
    </div>
</div>

<script src="pestanas/js/global.js"></script>
<!-- Scripts de traducción (debe cargarse antes de texto.js) -->
<script src="traducion_api/lectura-translation-functions.js"></script>
<script src="pestanas/js/texto.js"></script>
