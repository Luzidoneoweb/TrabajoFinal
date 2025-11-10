document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM Content Loaded in subir_texto.js'); // Eliminado para limpiar consola
    const titulo = document.getElementById('titulo');
    const contenido = document.getElementById('contenido');
    const texto_publico = document.getElementById('texto_publico');
    const categoria = document.getElementById('categoria');
    const btnSubirTexto = document.getElementById('btn_subir_texto');

    // Función para mostrar mensajes elegantes
    function mostrarMensaje(mensaje, tipo = 'info') {
        // Crear elemento de mensaje
        const mensajeEl = document.createElement('div');
        mensajeEl.className = `mensaje-flotante mensaje-${tipo}`;
        mensajeEl.textContent = mensaje;
        
        // Estilos del mensaje
        mensajeEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Colores según el tipo
        if (tipo === 'success') {
            mensajeEl.style.backgroundColor = '#10b981';
        } else if (tipo === 'error') {
            mensajeEl.style.backgroundColor = '#ef4444';
        } else {
            mensajeEl.style.backgroundColor = '#3b82f6';
        }
        
        // Añadir al DOM
        document.body.appendChild(mensajeEl);
        
        // Animar entrada
        setTimeout(() => {
            mensajeEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            mensajeEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (mensajeEl.parentNode) {
                    mensajeEl.parentNode.removeChild(mensajeEl);
                }
            }, 300);
        }, 3000);
    }

    // Función para cargar categorías
    function cargarCategorias() {
        const urlCategorias = '/trabajoFinal/pestanas/php/get_categoria.php'; // Ruta corregida
        // console.log('Fetching categories from:', urlCategorias); // Eliminado para limpiar consola
        fetch(urlCategorias, {
            credentials: 'include' // Incluir cookies de sesión
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // console.log('Categories loaded successfully:', data.categories); // Eliminado para limpiar consola
                    categoria.innerHTML = '<option value="">-- Selecciona categoría --</option>'; // Limpiar y añadir opción por defecto
                    data.categories.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat.id;
                        option.textContent = cat.name;
                        categoria.appendChild(option);
                    });
                } else {
                    console.error('Error al cargar categorías:', data.error);
                }
            })
            .catch(err => console.error('Error de conexión al cargar categorías:', err));
    }

    // Cargar categorías al iniciar
    cargarCategorias();

    btnSubirTexto.addEventListener('click', function() {
        const formData = new FormData();
        formData.append('titulo', titulo.value);
        formData.append('contenido', contenido.value);
        if(texto_publico.checked) formData.append('texto_publico', 'on');
        if(categoria.value) formData.append('categoria', categoria.value);

        const urlSubirTexto = '/trabajoFinal/pestanas/php/subirTextoFuncion.php'; // Ruta corregida
        // console.log('Submitting text to:', urlSubirTexto); // Eliminado para limpiar consola
        fetch(urlSubirTexto, {
            method: 'POST',
            body: formData,
            credentials: 'include' // Incluir cookies de sesión
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                // Mostrar mensaje de éxito
                mostrarMensaje('Texto subido correctamente', 'success');
                
                // Limpiar formulario
                titulo.value = '';
                contenido.value = '';
                texto_publico.checked = true;
                categoria.value = '';
                
                // Actualizar la tarjeta de estadística en Progreso
                if (typeof window.cargarTextosSubidos === 'function') {
                    window.cargarTextosSubidos();
                }
                
                // Cambiar a la pestaña "Mis textos" después de 1 segundo
                setTimeout(() => {
                    cambiarPestana('textos');
                }, 1000);
                
            } else {
                mostrarMensaje('Error: ' + (data.error || 'No se pudo subir el texto'), 'error');
            }
        })
        .catch(err => mostrarMensaje('Error al conectar con el servidor: ' + err, 'error'));
    });
});
