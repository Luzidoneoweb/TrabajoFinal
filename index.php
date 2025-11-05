<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiApp - Aprende idiomas leyendo</title>
    <link rel="stylesheet" href="css/global_estilos.css">
    <link rel="stylesheet" href="pestanas/css/global_pestanas.css" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <?php require_once 'php/login_seguridad/seguridad.php'; ?>
    <!-- Encabezado principal de la aplicación  -->
    <header class="encabezado-principal">
        <div class="contenedor-encabezado">
            <!-- Logo de la aplicación -->
            <div class="logo ">
                <img src="img/aprenderIngles.png" alt="Logo MiApp" class="imagen-logo">
                <span class="texto-logo">MiProyecto</span>
            </div>

            
            <div id="contenedorBotonCerrarSesion" class="oculto">
            <div class="info-usuario">
                    <span class="nombre-usuario"></span>
                </div>
                <button class="boton-cerrar-sesion" id="botonCerrarSesion">Cerrar Sesión</button>
            </div>
            <!--  Navegación principal - visible cuando no está logueado -->
            <nav class="navegacion-principal oculto" id="navegacionPrincipal">
                <ul class="lista-menu">
                    <li><a href="#inicio" class="enlace-menu">Inicio</a></li>
                    <li><a href="#caracteristicas" class="enlace-menu">Características</a></li>
                    <li><a href="#testimonios" class="enlace-menu">Testimonios</a></li>
                    <li><a href="#precios" class="enlace-menu">Precios</a></li>
                    <li><a href="#acerca" class="enlace-menu">Acerca</a></li>
                </ul>
                <button class="boton-login" id="botonLogin">Iniciar Sesión</button>
            </nav>
             
             <?php include 'php/menuMovil.php'; ?>

             

          
            
           
    </header>

    <!-- Contenido principal de la aplicación -->
     <?php include 'php/menu_logueado.php'; ?>
    <main class="contenido-principal" style="padding-top: 70px;">
        <!-- Página de inicio - visible cuando no está logueado -->
        <section class="pagina-inicio oculto" id="paginaInicio">
            <!-- Sección hero principal -->
            <section class="seccion-hero">
                <div class="contenedor-hero">
                    <div class="contenido-hero">
                        <h1 class="titulo-principal">aAprende idiomas leyendo lo que te gusta</h1>
                        <p class="subtitulo">Haz clic en las palabras para traducirlas y practica con tarjetas de memoria</p>
                        <button class="boton-comenzar">Comenzar a Aprender</button>
                    </div>
                    <div class="demo-traduccion">
                        <div class="texto-ejemplo">
                            <p>Lee en inglés, entiende en español. <span class="palabra-destacada">Sin pausas.</span> Traducción instantánea mientras lees.</p>
                        </div>
                        <div class="tarjeta-traduccion">
                            <span class="traduccion">Demo</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Espacios publicitarios -->
            <section class="espacios-publicidad">
                <div class="contenedor-publicidad">
                    <div class="anuncio anuncio-1">
                        <p>Espacio Publicitario 1</p>
                        <span>Banner 728x90</span>
                    </div>
                    <div class="anuncio anuncio-2">
                        <p>Espacio Publicitario 2</p>
                        <span>Banner 300x250</span>
                    </div>
                    <div class="anuncio anuncio-3">
                        <p>Espacio Publicitario 3</p>
                        <span>Banner 728x90</span>
                    </div>
                </div>
            </section>

            <!-- Sección de características -->
            <section class="seccion-caracteristicas" id="caracteristicas">
                <div class="contenedor-caracteristicas">
                    <h2 class="titulo-seccion">¿Cómo funciona?</h2>
                    <div class="grid-caracteristicas">
                        <div class="tarjeta-caracteristica">
                            <h3>Haz clic para traducir</h3>
                            <p>Simplemente haz clic en palabras o frases en cualquier texto para traducirlas.</p>
                        </div>
                        <div class="tarjeta-caracteristica">
                            <h3>Practica con tarjetas</h3>
                            <p>Todas las palabras que traduzcas se guardan y puedes practicarlas cuando quieras.</p>
                        </div>
                        <div class="tarjeta-caracteristica">
                            <h3>Contexto inteligente</h3>
                            <p>Explicaciones contextuales de palabras y frases usando inteligencia artificial.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sección de testimonios -->
            <section class="seccion-testimonios" id="testimonios">
                <div class="contenedor-testimonios">
                    <h2 class="titulo-seccion">Lo que dicen nuestros usuarios</h2>
                    <div class="grid-testimonios">
                        <div class="tarjeta-testimonio">
                            <p>"Esta aplicación ha revolucionado mi forma de aprender idiomas. Es increíblemente útil."</p>
                            <cite>- María García</cite>
                        </div>
                        <div class="tarjeta-testimonio">
                            <p>"La mejor herramienta para aprender vocabulario en contexto. Muy recomendada."</p>
                            <cite>- Juan Pérez</cite>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sección de precios -->
            <section class="seccion-precios" id="precios">
                <div class="contenedor-precios">
                    <h2 class="titulo-seccion">Planes ////</h2>
                    <div class="grid-precios">
                        <div class="tarjeta-precio">
                            <h3>Gratuito</h3>
                            <div class="precio">0<span>///</span></div>
                            <ul class="lista-beneficios">
                                <li>Traducciones ilimitadas de palabras</li>
                                <li>10 traducciones de frases por día</li>
                                <li>Tarjetas de memoria básicas</li>
                            </ul>
                            <button class="boton-plan">Comenzar Gratis</button>
                        </div>
                        <div class="tarjeta-precio destacada">
                            <h3>Premium</h3>
                            <div class="precio">0<span>////</span></div>
                            <ul class="lista-beneficios">
                                <li>Traducciones ilimitadas</li>
                                <li>Explicaciones contextuales</li>
                                <li>Tarjetas avanzadas</li>
                                <li>Sin anuncios</li>
                            </ul>
                            <button class="boton-plan">Elegir miApp</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sección acerca de -->
            <section class="seccion-acerca" id="acerca">
                <div class="contenedor-acerca">
                    <h2 class="titulo-seccion">Acerca de MiApp</h2>
                    <p class="descripcion-acerca">
                        MiApp es una plataforma innovadora diseñada para hacer el aprendizaje de idiomas más natural y efectivo. 
                        Creemos que la mejor manera de aprender un idioma es a través de la lectura de contenido que realmente te interesa.
                    </p>
                </div>
            </section>
        </section>
        <!-- Contenido de usuario logueado Pestañas-->
        <section id="contenidoLogueado" class="oculto">
            <?php include 'php/conten_logueado.php'; ?>
        </section>

    <!-- Pie de página -->
    <footer class="pie-pagina">
        <div class="contenedor-pie">
            <p>&copy; 2024 MiApp. Todos los derechos reservados.</p>
            <div class="enlaces-pie">
                <a href="#privacidad">Privacidad</a>
                <a href="#terminos">Términos</a>
                <a href="#contacto">Contacto</a>
            </div>
        </div>
    </footer>
    
    <?php include 'php/login_seguridad/modal_login.php'; ?>

    <!-- JavaScript para funcionalidad básica -->
    <script src="js/global.js"></script>
    <script src="js/login_registos/auth_auntentif.js"></script>
    
</body>
</html>
