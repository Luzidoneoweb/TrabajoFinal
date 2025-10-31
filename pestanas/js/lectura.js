// pestanas/js/lectura.js

document.addEventListener('DOMContentLoaded', function() {
    // Observar cambios en el panel de lectura para cargar el texto cuando se active
    const panelLectura = document.getElementById('panelLectura');
    if (panelLectura) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (panelLectura.classList.contains('activo')) {
                        console.log('Panel de lectura activado, cargando texto...');
                        cargarContenidoLectura();
                    }
                }
            });
        });
        observer.observe(panelLectura, { attributes: true });
    }

    // Función para cargar el contenido del texto
    function cargarContenidoLectura() {
        let textId = localStorage.getItem('currentTextId');
        // Para propósitos de prueba, si no hay un ID en localStorage, usar un ID predefinido (ej. 1)
        if (!textId) {
            console.warn('No se encontró el ID del texto en localStorage. Intentando cargar el texto con ID 1 para prueba.');
            textId = 1; // ID de texto de prueba
            // Si el usuario quiere ver un mensaje de error, descomentar las siguientes líneas y comentar la línea anterior
            // document.querySelector('.titulo-lectura').textContent = 'Error: Texto no seleccionado';
            // document.querySelector('.frase-original .contenido-texto p').textContent = 'Por favor, selecciona un texto desde "Mis Textos".';
            // document.querySelector('.frase-traduccion .texto-traduccion').textContent = '';
            // return;
        }

        fetch(`pestanas/php/get_lectura_data.php?id=${textId}`, { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const texto = data.data;
                    document.querySelector('.titulo-lectura').textContent = texto.title;
                    document.querySelector('.frase-original .contenido-texto p').innerHTML = (texto.content || '').replace(/\n/g, '<br>');
                    document.querySelector('.frase-traduccion .texto-traduccion').innerHTML = (texto.content_translation || 'Sin traducción').replace(/\n/g, '<br>');
                    // Aquí se podrían inicializar las funciones de paginación, progreso, etc.
                    console.log('Texto cargado:', texto.title);
                } else {
                    console.error('Error al cargar el texto:', data.error);
                    document.querySelector('.titulo-lectura').textContent = 'Error al cargar';
                    document.querySelector('.frase-original .contenido-texto p').textContent = `No se pudo cargar el texto: ${data.error}`;
                    document.querySelector('.frase-traduccion .texto-traduccion').textContent = '';
                }
            })
            .catch(error => {
                console.error('Error en la petición fetch para cargar el texto:', error);
                document.querySelector('.titulo-lectura').textContent = 'Error de conexión';
                document.querySelector('.frase-original .contenido-texto p').textContent = `Error de red: ${error.message}`;
                document.querySelector('.frase-traduccion .texto-traduccion').textContent = '';
            });
    }
});
