// Función de inicialización para la pestaña "Subir Texto"
function inicializarSubirTexto() {
    console.log('inicializarSubirTexto() ejecutado.'); // Log de inicialización
    const titulo = document.getElementById('titulo');
    const contenido = document.getElementById('contenido');
    const texto_publico = document.getElementById('texto_publico');
    const categoria = document.getElementById('categoria');
    const btnSubirTexto = document.getElementById('btn_subir_texto');
    console.log('subir_texto.js cargado.'); // Confirmar que el script se carga

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
        console.log('Intentando cargar categorías...'); // Log de inicio de función
        // Verificar si el elemento existe antes de continuar
        if (!categoria) {
            console.log('Elemento "categoria" no encontrado. El usuario no es admin o hay un problema en el DOM.');
            return; // No es admin, no cargar categorías
        }
        console.log('Elemento "categoria" encontrado. Realizando fetch...');

        const urlCategorias = '/trabajoFinal/pestanas/php/get_categoria.php'; // Ruta corregida
        fetch(urlCategorias, {
            credentials: 'include' // Incluir cookies de sesión
        })
            .then(response => {
                console.log('Respuesta de get_categoria.php:', response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos de categorías:', data);
                if (data.success) {
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
            .catch(err => console.error('Error de conexión o parseo al cargar categorías:', err));
    }

    // Cargar categorías al iniciar (solo si el elemento existe)
    if (categoria) {
        cargarCategorias();
    } else {
        console.log('El elemento "categoria" no existe en el DOM. No se cargarán las categorías.');
    }

    btnSubirTexto.addEventListener('click', function() {
        console.log('Botón "Subir Texto" clickeado.'); // Log de clic
        const formData = new FormData();
        formData.append('titulo', titulo.value);
        formData.append('contenido', contenido.value);
        if(texto_publico && texto_publico.checked) formData.append('texto_publico', 'on'); // Verificar si texto_publico existe
        if(categoria && categoria.value) formData.append('categoria', categoria.value); // Verificar si categoria existe

        const urlSubirTexto = '/trabajoFinal/pestanas/php/subirTextoFuncion.php'; // Ruta corregida
        fetch(urlSubirTexto, {
            method: 'POST',
            body: formData,
            credentials: 'include' // Incluir cookies de sesión
        })
        .then(response => {
            console.log('Respuesta de subirTextoFuncion.php:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos de subirTextoFuncion.php:', data);
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
}

// Si el script se carga de forma tradicional (no AJAX), ejecutar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar si no estamos en un entorno donde se llama explícitamente
    // Esto es una salvaguarda, la idea es que se llame vía inicializarPestanasGlobal
    if (document.getElementById('panelSubirTexto') && document.getElementById('panelSubirTexto').classList.contains('activo')) {
        inicializarSubirTexto();
    }
});
