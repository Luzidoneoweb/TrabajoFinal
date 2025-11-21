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