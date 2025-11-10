        // Variables globales
        let usuarioLogueado = false;
        let rememberedIdentifier = null; // Variable para almacenar el identificador recordado
        const encabezadoPrincipal = document.querySelector('.encabezado-principal');
        const contenidoPrincipal = document.querySelector('.contenido-principal');
        const alturaEncabezadoPrincipal = encabezadoPrincipal ? encabezadoPrincipal.offsetHeight : 0;

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

            // Comprobar si hay un parámetro 'tab' en la URL
            const urlParams = new URLSearchParams(window.location.search);
            const pestanaParam = urlParams.get('tab');
            const storedPestana = localStorage.getItem('activeTabAfterRedirect');

            if (pestanaParam) {
                window.cambiarPestana(pestanaParam);
            } else if (storedPestana) {
                window.cambiarPestana(storedPestana);
                localStorage.removeItem('activeTabAfterRedirect'); // Limpiar después de usar
            } else {
                // Si no hay parámetro en la URL ni en localStorage, activar "progreso" por defecto
                window.cambiarPestana('progreso');
            }
        });

        // Función global para alternar la visibilidad del encabezado principal
        window.toggleEncabezadoPrincipal = function(ocultar) {
            if (encabezadoPrincipal) {
                if (ocultar) {
                    encabezadoPrincipal.classList.add('encabezado-oculto');
                    if (contenidoPrincipal) {
                        contenidoPrincipal.style.paddingTop = '0'; // Eliminar padding
                    }
                } else {
                    encabezadoPrincipal.classList.remove('encabezado-oculto');
                    if (contenidoPrincipal) {
                        // Asegurarse de que el padding-top se aplique solo si no hay otro estilo que lo anule
                        contenidoPrincipal.style.paddingTop = `${alturaEncabezadoPrincipal}px`; // Restaurar padding
                    }
                }
            }
        };

        // Aplicar el padding-top inicial al contenido principal al cargar la página
        // Se ejecuta después de que el DOM esté completamente cargado y los estilos aplicados
        window.addEventListener('load', function() {
            if (contenidoPrincipal && encabezadoPrincipal && !encabezadoPrincipal.classList.contains('encabezado-oculto')) {
                contenidoPrincipal.style.paddingTop = `${alturaEncabezadoPrincipal}px`;
            }
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
                const response = await fetch('php/login_seguridad/logout.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.success) {
                        usuarioLogueado = false;
                        rememberedIdentifier = null; // Limpiar el identificador recordado al cerrar sesión
                        mostrarInterfazNoLogueada();
                        // Opcional: mostrar mensaje de confirmación
                        console.log(data.message);
                    } else {
                        console.error('Error cerrando sesión:', data.message);
                        // Aún así, intentar cerrar la sesión localmente
                        usuarioLogueado = false;
                        rememberedIdentifier = null;
                        mostrarInterfazNoLogueada();
                    }
                } else {
                    // Si la respuesta no es OK, cerrar sesión localmente
                    usuarioLogueado = false;
                    rememberedIdentifier = null;
                    mostrarInterfazNoLogueada();
                }
            } catch (error) {
                // Error de red o conexión - cerrar sesión localmente de todas formas
                console.error('Error cerrando sesión:', error);
                usuarioLogueado = false;
                rememberedIdentifier = null;
                mostrarInterfazNoLogueada();
            }
        }
        
        // Función para cambiar entre pestañas (disponible globalmente)
        window.cambiarPestana = async function cambiarPestana(nombrePestana) {
            // Mostrar mensaje de carga solo para ciertas pestañas
            // Para lectura, el mensaje ya se muestra en texto.js cuando se hace clic,
            // pero lo mostramos aquí también por si se accede directamente a lectura
            if (window.showLoadingMessage && (nombrePestana === 'textos' || nombrePestana === 'practicas' || nombrePestana === 'lectura')) {
                window.showLoadingMessage();
            }

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
                
                // Si es el panel de lectura, añadir clase al body para ocultar scroll
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
                }
            } else {
                console.warn(`Panel de pestaña con ID "panel${nombrePestana.charAt(0).toUpperCase() + nombrePestana.slice(1)}" no encontrado.`);
            }

            // Cerrar el menú móvil después de seleccionar una pestaña si está abierto
            if (navegacionUsuario && navegacionUsuario.classList.contains('menu-abierto')) {
                navegacionUsuario.classList.remove('menu-abierto');
            }

            // NO ocultar el mensaje de carga aquí automáticamente
            // Cada pestaña (textos.js, practicas.js, lectura.js) es responsable de ocultar
            // el mensaje cuando su contenido esté completamente cargado
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
