<div class="lectura" id="panelLectura" aria-label="Lector de texto">
    <div class="contenedor-lectura">
        <!-- Encabezado de lectura -->
        <header class="encabezado-lectura">
            <h1 class="titulo-lectura"></h1>
            <div class="progreso-lectura" aria-label="Progreso">
                <div class="barra-progreso"><span class="progreso" style="width:0%"></span></div>
                <span class="porcentaje" aria-live="polite">0%</span>
            </div>
        </header>

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

            <button class="btn-volver" onclick="window.cambiarPestana('textos')">Volver a Mis Textos</button>
        </footer>
    </div>
</div>

<!-- Script para la lógica de carga y visualización de la lectura -->
<script src="pestanas/js/lectura.js"></script>
