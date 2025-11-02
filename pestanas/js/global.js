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
