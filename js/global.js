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
            console.log('Estado de sesión verificado:', data); // Añadir log para depuración

			usuarioLogueado = !!data.logged_in;
			// Exponer el identificador recordado para el modal (si llega username del backend)
			window.rememberedIdentifier = data.username || null;

			// Actualizar nombre visible si existe el elemento
			const nombreUsuarioEl = document.querySelector('.nombre-usuario');
			if (nombreUsuarioEl && data.username) {
				nombreUsuarioEl.textContent = data.username;
			}

			if (usuarioLogueado) {
			console.log('[verificarEstadoSesion] Llamando a mostrarInterfazLogueada()');
			 mostrarInterfazLogueada(); // Esta función ya carga el contenido logueado
			} else {
			 console.log('[verificarEstadoSesion] Llamando a mostrarInterfazNoLogueada()');
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
             // Nota: cambiarPestana se ejecutará desde pestanas/js/global.js después de cargar el contenido
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

        // Event delegation para botones de cerrar sesión (dinámicos)
        document.addEventListener('click', function(e) {
             const btn = e.target.closest('.boton-cerrar-sesion');
        if (btn) {
            cerrarSesion(e);
            }
         });
        
        // Función para mostrar interfaz de usuario logueado
        function mostrarInterfazLogueada() {
        console.log('[mostrarInterfazLogueada] Iniciando...');
        console.log('navegacionPrincipal:', navegacionPrincipal);
        console.log('paginaInicio:', paginaInicio);
        console.log('contenidoAplicacion:', contenidoAplicacion);
        console.log('contenedorBotonCerrarSesion:', contenedorBotonCerrarSesion);
        
        if (navegacionPrincipal) {
            navegacionPrincipal.classList.add('oculto');
                console.log('✓ navegacionPrincipal oculta');
             }
             if (paginaInicio) {
                 paginaInicio.classList.add('oculto');
                 console.log('✓ paginaInicio oculta');
             }
             if (contenidoAplicacion) {
                 contenidoAplicacion.classList.remove('oculto');
                 console.log('✓ contenidoAplicacion mostrada');
             }
             if (contenedorBotonCerrarSesion) { // Mostrar el botón de cerrar sesión en el encabezado
                 contenedorBotonCerrarSesion.classList.remove('oculto');
                 console.log('✓ contenedorBotonCerrarSesion mostrada');
             }
             console.log('[mostrarInterfazLogueada] Llamando a inicializarInterfazLogueadaPestanas()');
             if (typeof window.inicializarInterfazLogueadaPestanas === 'function') {
                 window.inicializarInterfazLogueadaPestanas(); // Cargar el contenido dinámicamente y scripts de pestañas
             } else {
                 console.error('La función inicializarInterfazLogueadaPestanas no está definida.');
             }
             // La manipulación de navegacionUsuario se hará en pestanas/js/global.js después de cargar el contenido dinámico
         }
        
        // Función para mostrar interfaz de usuario no logueado
        function mostrarInterfazNoLogueada() {
        if (navegacionPrincipal) navegacionPrincipal.classList.remove('oculto');
        if (navegacionUsuario) navegacionUsuario.classList.add('oculto');
        if (paginaInicio) paginaInicio.classList.remove('oculto');
        if (contenidoAplicacion) contenidoAplicacion.classList.add('oculto');
        if (contenedorBotonCerrarSesion) { // Ocultar el botón de cerrar sesión en el encabezado
        contenedorBotonCerrarSesion.classList.add('oculto');
        }
        }
        
        // Función para cerrar sesión
        let cierrandoSesion = false; // Bandera para evitar múltiples clics
        async function cerrarSesion(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (cierrandoSesion) return; // Evitar múltiples clics
        cierrandoSesion = true;
        
        try {
        const response = await fetch('php/login_seguridad/logout.php', {
        method: 'POST',
            credentials: 'same-origin',
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
                } finally {
                        cierrandoSesion = false; // Siempre resetear la bandera
             }
         }
        
       
        
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
