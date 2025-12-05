 <!-- Contenido de la aplicación - visible cuando está logueado -->
  <?php // Inicializar sesión y conexión
error_reporting(E_ALL);
ini_set('display_errors', '1');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Inicializar conexión para los archivos incluidos
try {
    require_once dirname(__FILE__) . '/../pestanas/php/conexionLogin.php';
} catch (Exception $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode(['error' => 'Conexión fallida: ' . $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]);
    exit;
}

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
