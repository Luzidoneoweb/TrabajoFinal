// pestanas/js/modalFinalizacion.js
// Modal de finalización de lectura con redirección automática
// Código optimizado con etiquetas descriptivas en español

// Asegurar que el DOM esté listo antes de definir la función
(function() {
    'use strict';
    
    try {
/**
 * Muestra el modal de finalización de lectura
 * Incluye spinner animado, mensaje de finalización y redirección automática
 * 
 * @param {string} urlRedireccion - URL a la que redirigir después de 2 segundos (opcional)
 * @param {boolean} liberarFlag - Si es true, libera el flag isReadingInProgress (opcional)
 */
function mostrarModalFinalizacion(urlRedireccion, liberarFlag) {
    // Valores por defecto
    urlRedireccion = urlRedireccion || "index.php?tab=textos";
    liberarFlag = liberarFlag !== false;
    
    try {
        // Verificar si ya existe un modal para evitar duplicados
        const modalExistente = document.getElementById('modal-finalizacion');
        if (modalExistente) {
            modalExistente.remove();
        }

        // Crear elemento del modal
        const endMsg = document.createElement('div');
        endMsg.id = 'modal-finalizacion';
        
        // Verificar si está en modo fullscreen para ajustar z-index
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    
    // Estilos del modal
    endMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #F5F7FA;
        color: #1D3557;
        padding: 25px 35px;
        border: 1px solid #A8DADC;
        border-radius: 8px;
        font-size: 16px;
        text-align: center;
        z-index: ${isFullscreen ? '2147483647' : '999999'};
        box-shadow: 0 2px 10px rgba(29, 53, 87, 0.15);
        min-width: 200px;
    `;
    
    // Contenido HTML del modal
    endMsg.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="
                width: 24px;
                height: 24px;
                border: 2px solid #A8DADC;
                border-top: 2px solid #457B9D;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            "></div>
        </div>
        <div style="font-weight: 500; color: #1D3557; margin-bottom: 8px;">Lectura finalizada</div>
        <div style="font-size: 14px; color: #457B9D;">Redirigiendo...</div>
    `;
    
    // Agregar animación de spin si no existe
    if (!document.getElementById('spin-animation')) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar modal al body
    document.body.appendChild(endMsg);
    
    // Redirección a la pestaña de práctica al finalizar la lectura
    setTimeout(() => {
        // Liberar el flag si está habilitado
        if (liberarFlag && typeof window.isReadingInProgress !== 'undefined') {
            window.isReadingInProgress = false;
        }
        
        // Redirigir a la URL especificada
        window.location.href = urlRedireccion;
    }, 2000);
    } catch (error) {
        console.error('Error al mostrar modal de finalización:', error);
        // Si hay error, redirigir de todas formas
        setTimeout(() => {
            window.location.href = urlRedireccion;
        }, 500);
    }
}

// Exportar función al scope global para uso en otros archivos
window.mostrarModalFinalizacion = mostrarModalFinalizacion;
    } catch (error) {
        console.error('Error al cargar script de modal de finalización:', error);
        // Crear función stub para evitar errores
        window.mostrarModalFinalizacion = function() {
            console.warn('Modal de finalización no disponible, redirigiendo directamente...');
            window.location.href = "index.php?tab=practice";
        };
    }
})();

