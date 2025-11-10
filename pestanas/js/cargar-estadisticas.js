// ============================================
// CARGAR ESTADÍSTICAS DE USUARIO
// ============================================

/**
 * Carga el número de textos subidos por el usuario
 * Obtiene los datos de get_textos.php
 */
function cargarTextosSubidos() {
    const elementoTextos = document.getElementById('textos-subidos');
    
    if (!elementoTextos) {
        console.warn('Elemento #textos-subidos no encontrado');
        return;
    }
    
    fetch('pestanas/php/get_textos.php', {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            // Actualizar el valor con el número de textos
            elementoTextos.textContent = data.data.length;
        } else {
            console.error('Error al obtener textos:', data.error);
            elementoTextos.textContent = '0';
        }
    })
    .catch(error => {
        console.error('Error al cargar textos subidos:', error);
        elementoTextos.textContent = '0';
    });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarTextosSubidos();
});

// Exportar función para poder llamarla manualmente
window.cargarTextosSubidos = cargarTextosSubidos;
