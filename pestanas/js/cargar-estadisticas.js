// ============================================
// CARGAR ESTADÍSTICAS DE USUARIO
// ============================================

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
    
    fetch('/trabajoFinal/pestanas/php/get_textos.php', {
        credentials: 'include',
       
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

// Ejecutar cuando el DOM esté listo (solo si el elemento existe)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('textos-subidos')) {
            cargarTextosSubidos();
        }
    });
} else {
    if (document.getElementById('textos-subidos')) {
        cargarTextosSubidos();
    }
}

/**
 * Carga el número total de palabras guardadas por el usuario.
 * Obtiene los datos de pestanas/php/get_total_words.php
 */
function cargarPalabrasGuardadas() {
    const elementoPalabras = document.getElementById('palabras-guardadas');

    if (!elementoPalabras) {
        console.warn('Elemento #palabras-guardadas no encontrado');
        return;
    }

    fetch('/trabajoFinal/pestanas/php/get_total_words.php', {
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
        if (data.success) {
            elementoPalabras.textContent = data.total_words;
        } else {
            console.error('Error al obtener palabras guardadas:', data.error);
            elementoPalabras.textContent = '0';
        }
    })
    .catch(error => {
        console.error('Error al cargar palabras guardadas:', error);
        elementoPalabras.textContent = '0';
    });
}

// Ejecutar cuando el DOM esté listo (solo si los elementos existen)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('palabras-guardadas')) {
            cargarPalabrasGuardadas();
        }
    });
} else {
    if (document.getElementById('palabras-guardadas')) {
        cargarPalabrasGuardadas();
    }
}

// Exportar funciones para poder llamarlas manualmente
window.cargarTextosSubidos = cargarTextosSubidos;
window.cargarPalabrasGuardadas = cargarPalabrasGuardadas;
