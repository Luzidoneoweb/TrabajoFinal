// Hacer las funciones disponibles globalmente
window.showLoadingMessage = function() {
    // Intentar múltiples veces si el elemento no está disponible inmediatamente
    let attempts = 0;
    const tryShow = () => {
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.style.display = 'flex';
        } else if (attempts < 10) {
            attempts++;
            setTimeout(tryShow, 50);
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
    }
};
