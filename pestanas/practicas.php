<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/php/login_seguridad/seguridad.php'; ?>

<div class="contenedor-principal-practicas">
    
    <div class="tarjeta-practicar-vocabulario">
        <h2 class="titulo-practicar-vocabulario">Practicar Vocabulario</h2>

        <div class="grupo-botones-modo">
            <button class="boton-modo" data-modo="seleccion-multiple">Selección múltiple</button>
            <button class="boton-modo" data-modo="escribir-palabra">Escribir palabra</button>
            <button class="boton-modo" data-modo="escribir-frases">Escribir frases</button>
        </div>

        <h3 class="subtitulo-elegir-texto">Elige un texto para practicar palabras:</h3>

        <div class="selector-texto-practica">
            <select id="selectorTextosPractica" class="select-estilizado">
                <option value="">Selecciona un texto...</option>
                <!-- Opciones de textos se cargarán aquí dinámicamente -->
            </select>
        </div>

        <div class="info-textos-practica">
            <p>Mis textos: Textos que has subido tú</p>
            <p>Textos públicos: Textos de otros usuarios que has leído y guardado palabras</p>
        </div>
    </div>
</div>

<script src="pestanas/js/practicas.js"></script>