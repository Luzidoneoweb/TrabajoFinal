// Hacer las funciones disponibles globalmente
window.showLoadingMessage = function() {
    // Intentar múltiples veces si el elemento no está disponible inmediatamente
    let attempts = 0;
    const tryShow = () => {
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.style.display = 'flex';
            // console.log('Mensaje de carga mostrado'); // Eliminado para limpiar consola
        } else if (attempts < 10) {
            attempts++;
            setTimeout(tryShow, 50); // Reintentar cada 50ms
        } else {
            console.warn('No se pudo encontrar el elemento loading-message');
        }
    };
    tryShow();
};

window.hideLoadingMessage = function() {
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) {
        loadingMsg.style.display = 'none';
        // console.log('Mensaje de carga ocultado'); // Eliminado para limpiar consola
    }
};

// Funciones locales también (para compatibilidad)
function showLoadingMessage() {
    window.showLoadingMessage();
}

function hideLoadingMessage() {
    window.hideLoadingMessage();
}
