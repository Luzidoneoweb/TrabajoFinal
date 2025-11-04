        // Variables globales
        let usuarioLogueado = false;
        let rememberedIdentifier = null; // Variable para almacenar el identificador recordado

	// Función global para verificar el estado de sesión y actualizar la UI
	window.verificarEstadoSesion = async function verificarEstadoSesion() {
		try {
			const response = await fetch('php/login_seguridad/verificar_sesion.php', { credentials: 'same-origin' });
			const data = await response.json();

			usuarioLogueado = !!data.logged_in;
			// Exponer el identificador recordado para el modal (si llega username del backend)
			window.rememberedIdentifier = data.username || null;

			// Actualizar nombre visible si existe el elemento
			const nombreUsuarioEl = document.querySelector('.nombre-usuario');
			if (nombreUsuarioEl && data.username) {
				nombreUsuarioEl.textContent = data.username;
			}

			if (usuarioLogueado) {
				mostrarInterfazLogueada();
			} else {
				mostrarInterfazNoLogueada();
			}
		} catch (error) {
			console.error('Error verificando sesión:', error);
			usuarioLogueado = false;
			mostrarInterfazNoLogueada();
		}
	};
        
        // Verificar estado de sesión al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            verificarEstadoSesion();
        });
        
        // Elementos del DOM
        const botonLogin = document.getElementById('botonLogin');
        const botonCerrarSesion = document.getElementById('botonCerrarSesion');
        const contenedorBotonCerrarSesion = document.getElementById('contenedorBotonCerrarSesion'); // Nuevo elemento
        const navegacionPrincipal = document.getElementById('navegacionPrincipal');
        const navegacionUsuario = document.getElementById('navegacionUsuario');
        const paginaInicio = document.getElementById('paginaInicio');
        const contenidoAplicacion = document.getElementById('contenidoLogueado'); // Apunta al nuevo contenedor
        const botonMenuMovil = document.getElementById('botonMenuMovil');

        // Event listeners para todos los botones de cerrar sesión (menú y encabezado)
        document.querySelectorAll('.boton-cerrar-sesion').forEach(function(btn) {
            btn.addEventListener('click', cerrarSesion);
        });
        
        // Función para mostrar interfaz de usuario logueado
        function mostrarInterfazLogueada() {
            navegacionPrincipal.classList.add('oculto');
            navegacionUsuario.classList.remove('oculto');
            paginaInicio.classList.add('oculto');
            contenidoAplicacion.classList.remove('oculto');
            if (contenedorBotonCerrarSesion) { // Mostrar el botón de cerrar sesión en el encabezado
                contenedorBotonCerrarSesion.classList.remove('oculto');
            }
		// Activar por defecto la pestaña Progreso
		const pestañaProgreso = document.querySelector('.pestana[data-pestana="progreso"]');
		if (pestañaProgreso) {
			// Limpiar estados previos
			document.querySelectorAll('.pestana').forEach(p => p.classList.remove('activa'));
			document.querySelectorAll('.panel-pestana').forEach(panel => panel.classList.remove('activo'));
			// Activar progreso
			pestañaProgreso.classList.add('activa');
			const panelProgreso = document.getElementById('panelProgreso');
			if (panelProgreso) panelProgreso.classList.add('activo');
		}
        }
        
        // Función para mostrar interfaz de usuario no logueado
        function mostrarInterfazNoLogueada() {
            navegacionPrincipal.classList.remove('oculto');
            navegacionUsuario.classList.add('oculto');
            paginaInicio.classList.remove('oculto');
            contenidoAplicacion.classList.add('oculto');
            if (contenedorBotonCerrarSesion) { // Ocultar el botón de cerrar sesión en el encabezado
                contenedorBotonCerrarSesion.classList.add('oculto');
            }
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
        
        // Función para cambiar entre pestañas (disponible globalmente)
        window.cambiarPestana = function cambiarPestana(nombrePestana) {
            // Remover clase activa de todas las pestañas
            document.querySelectorAll('.pestana').forEach(pestana => {
                pestana.classList.remove('activa');
            });
            
            // Ocultar todos los paneles
            document.querySelectorAll('.panel-pestana').forEach(panel => {
                panel.classList.remove('activo');
            });
            
            // Remover clase lectura-activa del body si estaba activa
            document.body.classList.remove('lectura-activa');
            
            // Activar la pestaña seleccionada
            const pestanaElemento = document.querySelector(`[data-pestana="${nombrePestana}"]`);
            if (pestanaElemento) {
                pestanaElemento.classList.add('activa');
            } else {
                console.warn(`Elemento de pestaña con data-pestana="${nombrePestana}" no encontrado.`);
            }
            
            // Mostrar el panel correspondiente
            const panelElemento = document.getElementById(`panel${nombrePestana.charAt(0).toUpperCase() + nombrePestana.slice(1)}`);
            if (panelElemento) {
                panelElemento.classList.add('activo');
                
                // Si es el panel de lectura, añadir clase al body para ocultar scroll
                if (panelElemento.id === 'panelLectura') {
                    document.body.classList.add('lectura-activa');
                }
            } else {
                console.warn(`Panel de pestaña con ID "panel${nombrePestana.charAt(0).toUpperCase() + nombrePestana.slice(1)}" no encontrado.`);
            }

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
