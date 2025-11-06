// Función para cargar textos en el selector de prácticas
function cargarTextosPractica() {
    // Mostrar mensaje de carga
    // if (typeof window.showLoadingMessage === 'function') {
    //     window.showLoadingMessage();
    // }
    
    fetch('pestanas/php/get_textos.php', { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        
            
            // Limpiar opciones existentes (excepto la primera)
            selector.innerHTML = '<option value="">Selecciona un texto...</option>';
            
            if (data.success && data.data && data.data.length > 0) {
                data.data.forEach(texto => {
                    const option = document.createElement('option');
                    option.value = texto.id;
                    option.textContent = texto.title;
                    selector.appendChild(option);
                });
            }
            
            // Ocultar mensaje de carga
           
       
}

// Cargar cuando el DOM esté listo y cuando se active el panel
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que el panel esté visible
    setTimeout(() => {
        const panelPracticas = document.getElementById('panelPracticas');
        if (panelPracticas && panelPracticas.classList.contains('activo')) {
            cargarTextosPractica();
        }
    }, 100);
    
    // Observar cambios en el panel para recargar cuando se active
    const panelPracticas = document.getElementById('panelPracticas');
    if (panelPracticas) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (panelPracticas.classList.contains('activo')) {
                        console.log('Panel de prácticas activado, cargando textos...');
                        cargarTextosPractica();
                    }
                }
            });
        });
        observer.observe(panelPracticas, { attributes: true });
    }
});

