 <!-- Contenido de la aplicación - visible cuando está logueado -->
        <section class="contenido-aplicacion" id="contenidoAplicacion">
            <!-- Pestaña: Progreso -->
            <div class="panel-pestana activo" id="panelProgreso">
                <div class="encabezado-panel">
                    <h2>Mi Progreso</h2>
                </div>
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajofinal/php/pestanas/progreso.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Mis Textos -->
            <div class="panel-pestana" id="panelTextos">
                <div class="encabezado gi-panel">
                    <h2>Mis Textos</h2>
                    <button class="boton-subir-texto">
                        <span class="texto-ingles">Upload text</span>
                        <span class="texto-espanol">Subir texto</span>
                    </button>
                </div>
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajofinal/php/pestanas/textos.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Palabras -->
            <div class="panel-pestana" id="panelPalabras">
                <div class="encabezado-panel">
                    <h2>Palabras</h2>
                    <button class="boton-practicar">Practicar</button>
                </div>
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajofinal/php/pestanas/palabras.php'; ?>
                </div>
            </div>

           

            <!-- Pestaña: Biblioteca -->
            <div class="panel-pestana" id="panelBiblioteca">
                <div class="encabezado-panel">
                    <h2>Biblioteca</h2>
                    <input type="search" placeholder="Buscar textos..." class="buscador-biblioteca">
                </div>
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajofinal/php/pestanas/biblioteca.php'; ?>
                </div>
            </div>

            <!-- Pestaña: Prácticas -->
            <div class="panel-pestana" id="panelPracticas">
                <div class="encabezado-panel">
                    <h2>Prácticas</h2>
                    <button class="boton-practicar">Iniciar Práctica</button>
                </div>
                <div class="contenido-panel">
                    <?php include $_SERVER['DOCUMENT_ROOT'] . '/trabajofinal/php/pestanas/practicas.php'; ?>
                </div>
            </div>
            </div>
        </section>
    </main>
