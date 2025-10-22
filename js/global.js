        // Variables globales
        let usuarioLogueado = false;
        let rememberedIdentifier = null; // Variable para almacenar el identificador recordado
        
        // Verificar estado de sesión al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            verificarEstadoSesion();
        });
        
        // Elementos del DOM
        const botonLogin = document.getElementById('botonLogin');
        const botonCerrarSesion = document.getElementById('botonCerrarSesion');
        const navegacionPrincipal = document.getElementById('navegacionPrincipal');
        const navegacionUsuario = document.getElementById('navegacionUsuario');
        const paginaInicio = document.getElementById('paginaInicio');
        const contenidoAplicacion = document.getElementById('contenidoLogueado'); // Apunta al nuevo contenedor
        const botonMenuMovil = document.getElementById('botonMenuMovil');

        // Event listener para el botón de cerrar sesión
        if (botonCerrarSesion) {
            botonCerrarSesion.addEventListener('click', cerrarSesion);
        }
        
        // Función para verificar el estado de la sesión
        async function verificarEstadoSesion() {
            try {
                const response = await fetch('php/login_seguridad/verificar_sesion.php');
                const data = await response.json();
                
                if (data.logged_in) {
                    usuarioLogueado = true;
                    mostrarInterfazLogueada();
                if (data.username) {
                    document.querySelector('.nombre-usuario').textContent = data.username;
                }
                // Activar la pestaña de Progreso al iniciar sesión
                cambiarPestana('progreso');
            } else {
                    // Si no hay sesión activa, intentar obtener el identificador recordado
                    const autoLoginResponse = await fetch('php/login_seguridad/auto_login.php');
                    const autoLoginData = await autoLoginResponse.json();

                    if (autoLoginData.remembered_identifier) {
                        rememberedIdentifier = autoLoginData.remembered_identifier;
                        console.log('Identificador recordado:', rememberedIdentifier);
                    } else {
                        rememberedIdentifier = null;
                    }
                    usuarioLogueado = false;
                    mostrarInterfazNoLogueada();
                }
            } catch (error) {
                console.error('Error verificando sesión o auto-login:', error);
                usuarioLogueado = false;
                mostrarInterfazNoLogueada();
            }
        }
        
        // Función para mostrar interfaz de usuario logueado
        function mostrarInterfazLogueada() {
            navegacionPrincipal.classList.add('oculto');
            navegacionUsuario.classList.remove('oculto');
            paginaInicio.classList.add('oculto');
            contenidoAplicacion.classList.remove('oculto');
        }
        
        // Función para mostrar interfaz de usuario no logueado
        function mostrarInterfazNoLogueada() {
            navegacionPrincipal.classList.remove('oculto');
            navegacionUsuario.classList.add('oculto');
            paginaInicio.classList.remove('oculto');
            contenidoAplicacion.classList.add('oculto');
        }
        
        // Función para cerrar sesión
        async function cerrarSesion() {
            try {
                const response = await fetch('php/login_seguridad/logout.php');
                const data = await response.json();
                
                if (data.success) {
                    usuarioLogueado = false;
                    rememberedIdentifier = null; // Limpiar el identificador recordado al cerrar sesión
                    mostrarInterfazNoLogueada();
                    // Opcional: mostrar mensaje de confirmación
                    console.log(data.message);
                } else {
                    console.error('Error cerrando sesión:', data.message);
                }
            } catch (error) {
                console.error('Error cerrando sesión:', error);
                // Aún así, intentar cerrar la sesión localmente
                usuarioLogueado = false;
                rememberedIdentifier = null;
                mostrarInterfazNoLogueada();
            }
        }
        
        // Función para cambiar entre pestañas
        function cambiarPestana(nombrePestana) {
            // Remover clase activa de todas las pestañas
            document.querySelectorAll('.pestana').forEach(pestana => {
                pestana.classList.remove('activa');
            });
            
            // Ocultar todos los paneles
            document.querySelectorAll('.panel-pestana').forEach(panel => {
                panel.classList.remove('activo');
            });
            
            // Activar la pestaña seleccionada
            document.querySelector(`[data-pestana="${nombrePestana}"]`).classList.add('activa');
            
            // Mostrar el panel correspondiente
            document.getElementById(`panel${nombrePestana.charAt(0).toUpperCase() + nombrePestana.slice(1)}`).classList.add('activo');

            // Cerrar el menú móvil después de seleccionar una pestaña si está abierto
            if (navegacionUsuario && navegacionUsuario.classList.contains('menu-abierto')) {
                navegacionUsuario.classList.remove('menu-abierto');
            }
        }
        
        // Event listeners para las pestañas
        document.querySelectorAll('.pestana').forEach(pestana => {
            pestana.addEventListener('click', (e) => {
                const nombrePestana = e.target.getAttribute('data-pestana');
                cambiarPestana(nombrePestana);
            });
        });
        
        // Menú móvil
        if (botonMenuMovil) {
            botonMenuMovil.addEventListener('click', () => {
                if (usuarioLogueado) {
                    navegacionUsuario.classList.toggle('menu-abierto');
                } else {
                    navegacionPrincipal.classList.toggle('menu-abierto');
                }
            });
        }
        
        // Navegación suave
        document.querySelectorAll('.enlace-menu').forEach(enlace => {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                const destino = e.target.getAttribute('href').substring(1);
                const elemento = document.getElementById(destino);
                if (elemento) {
                    elemento.scrollIntoView({ behavior: 'smooth' });
                }
                // Cerrar el menú principal después de seleccionar un enlace si está abierto
                if (navegacionPrincipal.classList.contains('menu-abierto')) {
                    navegacionPrincipal.classList.remove('menu-abierto');
                }
            });
        });
