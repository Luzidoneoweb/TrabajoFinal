// Función de inicialización para la pestaña "Prácticas"
function inicializarPracticas() {
    console.log('inicializarPracticas() ejecutado.');

    const selectorTextosPractica = document.getElementById('selectorTextosPractica');
    const botonesModo = document.querySelectorAll('.boton-modo');

    // Función para cargar textos en el selector de prácticas
    async function cargarTextosPractica() {
        console.log('Intentando cargar textos para práctica...');
        if (!selectorTextosPractica) {
            console.error('Elemento "selectorTextosPractica" no encontrado.');
            return;
        }

        try {
            // Mostrar mensaje de carga
            if (typeof window.showLoadingMessage === 'function') {
                window.showLoadingMessage();
            }

            const response = await fetch('pestanas/php/get_textos.php', { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Datos recibidos de get_textos.php:', data);

            // Limpiar opciones existentes (excepto la primera)
            selectorTextosPractica.innerHTML = '<option value="">Selecciona un texto...</option>';
            
            if (data.success && data.data && data.data.length > 0) {
                data.data.forEach(texto => {
                    const option = document.createElement('option');
                    option.value = texto.id;
                    option.textContent = texto.title;
                    selectorTextosPractica.appendChild(option);
                });
            } else {
                console.log('No se encontraron textos para practicar.');
            }
        } catch (error) {
            console.error('Error al cargar textos de práctica:', error);
        } finally {
            // Ocultar mensaje de carga
            if (typeof window.hideLoadingMessage === 'function') {
                window.hideLoadingMessage();
            }
        }
    }

    // Establecer "Selección múltiple" como modo por defecto
    function establecerModoPorDefecto() {
        const botonSeleccionMultiple = document.querySelector('.boton-modo[data-modo="seleccion-multiple"]');
        if (botonSeleccionMultiple) {
            botonSeleccionMultiple.classList.add('activo'); // Asumimos una clase 'activo' para el modo seleccionado
            console.log('Modo "Selección múltiple" establecido por defecto.');
        }
    }

    // Event listeners para los botones de modo
    botonesModo.forEach(boton => {
        boton.addEventListener('click', function() {
            botonesModo.forEach(btn => btn.classList.remove('activo'));
            this.classList.add('activo');
            const modoSeleccionado = this.dataset.modo;
            console.log('Modo de práctica seleccionado:', modoSeleccionado);
            // Aquí se podría añadir lógica para cargar el ejercicio correspondiente al modo
        });
    });

    // Cargar textos y establecer modo por defecto al inicializar
    cargarTextosPractica();
    establecerModoPorDefecto();
}

// Exportar la función para que pueda ser llamada globalmente
window.inicializarPracticas = inicializarPracticas;

// Si el script se carga de forma tradicional (no AJAX), ejecutar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar si no estamos en un entorno donde se llama explícitamente
    if (document.getElementById('panelPracticas') && document.getElementById('panelPracticas').classList.contains('activo')) {
        inicializarPracticas();
    }
});
