 <!-- Contenido de la aplicación - visible cuando está logueado -->
  <?php // Inicializar sesión si es necesario
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// Nota: Las conexiones a BD se hacen en los archivos específicos (progreso.php, textos.php, etc.)
// No incluirlas aquí para evitar errores de credenciales innecesarias

     ?>

    <script src="pestanas/js/loading_message.js" ></script> 
  <?php include dirname(__FILE__) . '/menu_logueado.php'; ?>
        <section class="contenido-aplicacion" id="contenidoAplicacion">
             
        <!-- Pestaña: Progreso -->
            <div class="panel-pestana activo" id="panelProgreso">
            
            <div class="contenido-panel">
            <?php include dirname(__FILE__) . '/../pestanas/progreso.php'; ?>
            </div>
            </div>

            <!-- Pestaña: Mis Textos -->
            <div class="panel-pestana" id="panelTextos">
            <div class="contenido-panel">
            <?php include dirname(__FILE__) . '/../pestanas/textos.php'; ?>
            </div>
            </div>

            <!-- Pestaña: Palabras -->
            <div class="panel-pestana" id="panelPalabras">
            <div class="contenido-panel">
            <?php include dirname(__FILE__) . '/../pestanas/palabras.php'; ?>
            </div>
            </div>

            

            <!-- Pestaña: Biblioteca -->
            <div class="panel-pestana" id="panelBiblioteca">
            <div class="contenido-panel">
            <?php include dirname(__FILE__) . '/../pestanas/biblioteca.php'; ?>
            </div>
            </div>

            <!-- Pestaña: Prácticas -->
            <div class="panel-pestana" id="panelPracticas">
            <div class="contenido-panel">
            <?php include dirname(__FILE__) . '/../pestanas/practicas.php'; ?>
            </div>
            </div>

            <!-- Pestaña: Subir Texto -->
            <div class="panel-pestana" id="panelSubirTexto">
            <div class="contenido-panel">
            <?php include dirname(__FILE__) . '/../pestanas/subir_texto.php'; ?>
            </div>
            </div>

            <!-- Pestaña: Lectura -->
            <div class="panel-pestana" id="panelLectura">
            <div class="contenido-panel">
            <?php include dirname(__FILE__) . '/../pestanas/lectura.php'; ?>
            </div>
            </div>
        </section>
        </main>
