 <!-- Contenido de la aplicación - visible cuando está logueado -->
  
        <section class="contenido-aplicacion" id="contenidoAplicacion">
             
        <!-- Pestaña: Progreso -->
            <div class="panel-pestana activo" id="panelProgreso">
              
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/progreso.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Mis Textos -->
            <div class="panel-pestana" id="panelTextos">
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/textos.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Palabras -->
            <div class="panel-pestana" id="panelPalabras">
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/palabras.php'; ?>
                </div>
            </div>

           

            <!-- Pestaña: Biblioteca -->
            <div class="panel-pestana" id="panelBiblioteca">
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/biblioteca.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Prácticas -->
            <div class="panel-pestana" id="panelPracticas">
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/practicas.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Subir Texto -->
            <div class="panel-pestana" id="panelSubirTexto">
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/subir_texto.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Lectura -->
            <div class="panel-pestana" id="panelLectura">
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/lectura.php'; ?>
                </div>
            </div>
        </section>
    </main>
    <script src="pestanas/js/global.js"></script>
