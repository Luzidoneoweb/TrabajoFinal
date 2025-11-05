<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/php/login_seguridad/seguridad.php'; ?>

<div class="lectura" aria-label="Lector de texto">
    <div class="contenedor-lectura">
        <!-- Encabezado de lectura -->
        <div class="encabezado-lectura">
            <button class="btn-volver" onclick="window.cambiarPestana('textos')" aria-label="Volver a Mis Textos">&#x2190;</button>
            <div class="titulos-lectura-contenedor">
                <h1 class="titulo-lectura"></h1>
                <h1 class="titulo-lectura-traduccion">Traducion Titulo</h1> <!-- Nuevo h1 para la traducción del título -->
            </div>
            <div class="progreso-lectura" aria-label="Progreso">
                <div class="barra-progreso"><span class="progreso" style="width:0%"></span></div>
                <span class="porcentaje" aria-live="polite">0%</span>
            </div>
               <aside class="acciones-laterales1" aria-label="Acciones">
            <button class="accion-lateral accion-notas" title="Notas">
                <span class="icono">📝</span>
                <span class="etiqueta">Notas</span>
            </button>
            <button class="accion-lateral accion-vocab" title="Vocabulario">
                <span class="icono">🔤</span>
                <span class="etiqueta">Vocabulario</span>
            </button>
        </aside>
</div>
        <!-- Encabezado secundario de lectura (oculto por defecto) -->
        <div class="encabezado-secundario-lectura oculto" aria-label="Controles de lectura secundarios">
            <button class="btn-volver-secundario" aria-label="Volver a la lectura normal">&#x2190;</button>
            <span class="titulo-secundario-lectura">Modo de Lectura</span>
            <div class="controles-secundarios">
                <button class="accion-lateral accion-notas-secundario" title="Notas">
                    <span class="icono">📝</span>
                </button>
                <button class="accion-lateral accion-vocab-secundario" title="Vocabulario">
                    <span class="icono">🔤</span>
                </button>
            </div>
        </div>

        <!-- Área de frases -->
        <div class="zona-frases">
            <!-- Frase original: se genera dinámicamente por JavaScript -->
            <div class="frase frase-original" aria-label="Frase original">
                <div class="contenido-texto">
                    <p></p>
                </div>
            </div>
            <!-- Línea de traducción: debajo de cada frase original, máximo 20 palabras -->
            <!-- Esta línea siempre existe, incluso si está vacía inicialmente -->
            <div class="frase-traduccion-original" aria-label="Traducción de la frase original">
                <p class="texto-traduccion-original"></p>
            </div>
            <!-- Traducción completa resaltada (opcional) -->
            <div class="frase frase-traduccion" aria-label="Traducción resaltada">
                <p class="texto-traduccion"></p>
            </div>
        </div>

        <!-- Botones flotantes laterales (despliegan hacia la izquierda) -->
        <aside class="acciones-laterales" aria-label="Acciones">
            <button class="accion-lateral accion-notas" title="Notas">
                <span class="icono">📝</span>
                <span class="etiqueta">Notas</span>
            </button>
            <button class="accion-lateral accion-vocab" title="Vocabulario">
                <span class="icono">🔤</span>
                <span class="etiqueta">Vocabulario</span>
            </button>
        </aside>

        <!-- Controles inferiores -->
        <footer class="controles-lectura">
            <div class="paginacion" aria-label="Paginación">
                <button class="btn-pagina btn-anterior" title="Anterior" aria-label="Anterior">◀ Anterior</button>
                <span class="estado-pagina">1 / 1</span>
                <button class="btn-pagina btn-siguiente" title="Siguiente" aria-label="Siguiente">Siguiente ▶</button>
            </div>

            <button class="btn-play" title="Reproducir / Detener" aria-label="Reproducir o detener"></button>

        </footer>
    </div>
</div>

<!-- Scripts del sistema de voz -->
<script src="lector/electron-voice-integration.js"></script>
<script src="lector/reading-engine.js"></script>
<!-- Script para la lógica de carga y visualización de la lectura -->
<script src="pestanas/js/lectura.js"></script>
