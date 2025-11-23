// SOLO SE CARGA CUANDO USUARIO ESTÁ LOGUEADO
let interfazLogueadaMostrada = false;

async function mostrarInterfazLogueada() {
    // Si ya se mostró antes, no mostrar loading de nuevo
    if (interfazLogueadaMostrada) return;
    
    const navPrincipal = document.getElementById('navegacionPrincipal');
    const pagInicio = document.getElementById('paginaInicio');
    const contLogueado = document.getElementById('contenidoLogueado');
    const btnCerrar = document.getElementById('contenedorBotonCerrarSesion');
    
    if (navPrincipal) navPrincipal.classList.add('oculto');
    if (pagInicio) pagInicio.classList.add('oculto');
    if (btnCerrar) btnCerrar.classList.remove('oculto');

    // Asegurarse de que el contenido logueado esté oculto antes de cargar
    if (contLogueado) contLogueado.classList.add('oculto');

    // Mostrar mensaje de carga antes de la petición (solo la primera vez)
    if (typeof window.showLoadingMessage === 'function') {
        window.showLoadingMessage();
    }

    // Cargar el contenido de contenido_logueado.php dinámicamente
    const contenidoLogueadoDiv = document.getElementById('contenidoLogueado');
    if (contenidoLogueadoDiv) {
        try {
            const response = await fetch('php/conten_logueado.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            contenidoLogueadoDiv.innerHTML = htmlContent;

            // Mostrar el contenido logueado solo después de que se haya cargado
            if (contLogueado) contLogueado.classList.remove('oculto');
            
            // Marcar que la interfaz ya se mostró
            interfazLogueadaMostrada = true;

            // Cargar script de biblioteca después de que el contenido esté en el DOM
            const scriptBiblioteca = document.createElement('script');
            scriptBiblioteca.src = 'pestanas/js/cargar_biblioteca.js';
            scriptBiblioteca.onload = function() {
            if (typeof cargarBiblioteca === 'function') {
            cargarBiblioteca();
            }
            };
            document.body.appendChild(scriptBiblioteca);

             // Cargar scripts para textos
             const scriptTextUtils = document.createElement('script');
             scriptTextUtils.src = 'pestanas/js/text-utils.js';
             document.body.appendChild(scriptTextUtils);

             const scriptLecturaTranslation = document.createElement('script');
             scriptLecturaTranslation.src = 'traducion_api/lectura-translation-functions.js';
             document.body.appendChild(scriptLecturaTranslation);

             const scriptTexto = document.createElement('script');
             scriptTexto.src = 'pestanas/js/texto.js';
             scriptTexto.onload = function() {
                 if (typeof cargarTextos === 'function') {
                     cargarTextos();
                 }
             };
             document.body.appendChild(scriptTexto);

             // Después de que el contenido se haya cargado, inicializamos los event listeners de las pestañas
             inicializarPestanas();
            
            // Comprobar si hay un parámetro 'tab' en la URL o en localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const pestanaParam = urlParams.get('tab');
            const storedPestana = localStorage.getItem('activeTabAfterRedirect');
            
            let pestanaAActivar = 'progreso'; // Por defecto
             
             if (pestanaParam) {
                 pestanaAActivar = pestanaParam;
             } else if (storedPestana) {
                 pestanaAActivar = storedPestana;
                 localStorage.removeItem('activeTabAfterRedirect');
             }
             
             // Activar la pestaña y ocultar loading después
             if (window.cambiarPestana) {
             window.cambiarPestana(pestanaAActivar);
                 // Ocultar loading después de que se active la pestaña
                  setTimeout(() => {
                          if (typeof window.hideLoadingMessage === 'function') {
                          window.hideLoadingMessage();
                      }
                      }, 500);
              } else {
                  // Si no hay cambiarPestana, ocultar loading directamente
              if (typeof window.hideLoadingMessage === 'function') {
                      window.hideLoadingMessage();
                      }
              }

         } catch (error) {
             console.error('Error al cargar el contenido logueado:', error);
             // Ocultar loading en caso de error
             if (typeof window.hideLoadingMessage === 'function') {
                 window.hideLoadingMessage();
             }
         }
    }
}

async function cerrarSesion() {
    await fetch('php/login_seguridad/logout.php', { method: 'POST', credentials: 'include' });
    location.reload(); // Recarga y vuelve al modo no logueado
}


// Resto del código que quitaste de global.js
// Función para mostrar notificaciones flotantes
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    const notificacionFlotante = document.getElementById('notificacion-flotante');
    const notificacionMensaje = document.getElementById('notificacion-mensaje');

    if (!notificacionFlotante || !notificacionMensaje) {
        console.error('Elementos de notificación no encontrados.');
        return;
    }

    notificacionMensaje.textContent = mensaje;
    notificacionFlotante.className = 'notificacion-flotante mostrar'; // Resetear clases y añadir 'mostrar'

    if (tipo === 'exito') {
        notificacionFlotante.classList.add('exito');
    } else if (tipo === 'error') {
        notificacionFlotante.classList.add('error');
    }

    setTimeout(() => {
        notificacionFlotante.classList.remove('mostrar', 'exito', 'error');
    }, duracion);
}
 // Función para cambiar entre pestañas (disponible globalmente)
        window.cambiarPestana = async function cambiarPestana(nombrePestana) {
            // Solo mostrar loading al entrar en lectura directamente
            // Las demás pestañas no muestran loading

            // Detener la lectura si está activa antes de cambiar de pestaña
            if (window.MotorLectura && window.MotorLectura.estado !== 'inactivo') {
                try {
                    window.MotorLectura.detener();
                    // Cancelar explícitamente speechSynthesis para asegurar que se detiene
                    if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                    }
                } catch(e) {
                    console.warn('Error al detener la lectura al cambiar de pestaña:', e);
                }
            }
            
            // Remover clase activa de todas las pestañas
            document.querySelectorAll('.pestana').forEach(pestana => {
                pestana.classList.remove('activa');
            });
            
            // Ocultar todos los paneles
            document.querySelectorAll('.panel-pestana').forEach(panel => {
                panel.classList.remove('activo');
            });
            
            // Remover clase lectura-activa del body si estaba activa
            // Esto restaura el scroll en las demás páginas
            document.body.classList.remove('lectura-activa');
            
            // Restaurar overflow en html y body cuando se sale de lectura
            if (document.documentElement) {
                document.documentElement.style.overflowY = '';
                document.documentElement.style.msOverflowStyle = '';
                document.documentElement.style.scrollbarWidth = '';
            }
            document.body.style.overflowY = '';
            document.body.style.msOverflowStyle = '';
            document.body.style.scrollbarWidth = '';
            
            // Activar la pestaña seleccionada (solo si existe un botón para ella)
            // La pestaña "lectura" no tiene botón en el menú, se accede desde "Mis Textos"
            if (nombrePestana !== 'lectura') {
                const pestanaElemento = document.querySelector(`[data-pestana="${nombrePestana}"]`);
                if (pestanaElemento) {
                    pestanaElemento.classList.add('activa');
                }
            }
            
            // Mostrar el panel correspondiente
            const panelElemento = document.getElementById(`panel${nombrePestana.charAt(0).toUpperCase() + nombrePestana.slice(1)}`);
            if (panelElemento) {
            panelElemento.classList.add('activo');
            
            // Si es el panel de lectura, cargar sus scripts y configurar
            if (panelElemento.id === 'panelLectura') {
            document.body.classList.add('lectura-activa');
            // Ocultar scroll en html y body cuando se activa lectura
            if (document.documentElement) {
            document.documentElement.style.overflowY = 'hidden';
            document.documentElement.style.msOverflowStyle = 'none';
            document.documentElement.style.scrollbarWidth = 'none';
            }
            document.body.style.overflowY = 'hidden';
            document.body.style.msOverflowStyle = 'none';
            document.body.style.scrollbarWidth = 'none';
            
            // Ocultar el contenido de lectura mientras se carga
            const contenedorLectura = panelElemento.querySelector('.contenedor-lectura');
            if (contenedorLectura) {
            contenedorLectura.style.visibility = 'hidden';
            contenedorLectura.style.opacity = '0';
            }

                    // Cargar scripts de lectura si aún no están cargados
                    if (!window.scriptLecturasCargados) {
                    // Cargar dependencias en orden
                        const scriptElectronVoice = document.createElement('script');
                    scriptElectronVoice.src = 'lector/electron-voice-integration.js';
                    document.body.appendChild(scriptElectronVoice);

                        const scriptReadingEngine = document.createElement('script');
                    scriptReadingEngine.src = 'lector/reading-engine.js';
                    document.body.appendChild(scriptReadingEngine);

                        const scriptTextManagement = document.createElement('script');
                    scriptTextManagement.src = 'traducion_api/palabras/text-management.js';
                    document.body.appendChild(scriptTextManagement);

                        const scriptMultiWordSelection = document.createElement('script');
                    scriptMultiWordSelection.src = 'traducion_api/palabras/multi-word-selection.js';
                    document.body.appendChild(scriptMultiWordSelection);

                        const scriptLectura = document.createElement('script');
                    scriptLectura.src = 'pestanas/js/lectura.js';
                    document.body.appendChild(scriptLectura);

                    const scriptModalFinalizacion = document.createElement('script');
                    scriptModalFinalizacion.src = 'pestanas/js/modalFinalizacion.js';
                    document.body.appendChild(scriptModalFinalizacion);

                    window.scriptLecturasCargados = true;
                    }
                    
                    // Mostrar loading cuando se entra a lectura
                    if (window.showLoadingMessage) {
                        window.showLoadingMessage();
                    }
                    
                    // Esperar a que cargarContenidoLectura esté disponible (máximo 5 segundos)
                    let intentosRestantes = 100; // 100 intentos * 50ms = 5000ms
                    const intentarCargarContenido = () => {
                        if (typeof window.cargarContenidoLectura === 'function') {
                            window.cargarContenidoLectura();
                        } else if (intentosRestantes > 0) {
                            intentosRestantes--;
                            setTimeout(intentarCargarContenido, 50);
                        } else {
                            console.error('[global.js] cargarContenidoLectura no disponible después de 5s');
                            if (window.hideLoadingMessage) {
                                window.hideLoadingMessage();
                            }
                        }
                    };
                    intentarCargarContenido();
                }
            } else {
                console.warn(`Panel de pestaña con ID "panel${nombrePestana.charAt(0).toUpperCase() + nombrePestana.slice(1)}" no encontrado.`);
            }

            // Cerrar el menú móvil después de seleccionar una pestaña si está abierto
            const navegacionUsuario = document.getElementById('navegacionUsuario'); // Obtener localmente
            if (navegacionUsuario && navegacionUsuario.classList.contains('menu-abierto')) {
                navegacionUsuario.classList.remove('menu-abierto');
            }

            // NO ocultar el mensaje de carga aquí automáticamente
            // Cada pestaña (textos.js, practicas.js, lectura.js) es responsable de ocultar
            // el mensaje cuando su contenido esté completamente cargado
        }
        
// Función para inicializar los event listeners de las pestañas
function inicializarPestanas() {
    const navegacionUsuario = document.getElementById('navegacionUsuario'); // Obtener localmente
    const botonMenuMovil = document.getElementById('botonMenuMovil');

    if (botonMenuMovil && navegacionUsuario) {
        botonMenuMovil.addEventListener('click', () => {
            navegacionUsuario.classList.toggle('menu-abierto');
        });
    } else if (!navegacionUsuario) {
        console.warn('navegacionUsuario no encontrado al inicializar el menú móvil.');
    }


    document.querySelectorAll('.pestana').forEach(pestana => {
        pestana.addEventListener('click', (e) => {
            const nombrePestana = e.target.getAttribute('data-pestana');
            cambiarPestana(nombrePestana);
        });
    });
}
