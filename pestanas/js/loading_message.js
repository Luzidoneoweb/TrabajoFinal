// Crear el div de loading dinámicamente cuando se necesite
function ensureLoadingDiv() {
    if (!document.getElementById('loading-message')) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div><p>Cargando contenido...</p>';
        document.body.appendChild(loadingDiv);
    }
}

window.showLoadingMessage = function() {
    ensureLoadingDiv();
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) {
        loadingMsg.style.display = 'flex';
    }
    // Ocultar el footer mientras carga
    const footer = document.querySelector('.pie-pagina');
    if (footer) {
        footer.style.display = 'none';
    }
};

window.hideLoadingMessage = function() {
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) {
        loadingMsg.style.display = 'none';
    }
    // Mostrar el footer nuevamente
    const footer = document.querySelector('.pie-pagina');
    if (footer) {
        footer.style.display = '';
    }
};
