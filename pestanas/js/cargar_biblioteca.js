/**
 * Carga el contenido de la biblioteca (categorías con textos públicos)
 */
function cargarBiblioteca() {
    const contenedorTextos = document.getElementById('bulkForm');
    const templateCategoria = document.getElementById('template-categoria');
    const templateTexto = document.getElementById('template-texto');
    
    console.log('Templates encontrados:', {
        contenedor: !!contenedorTextos,
        templateCategoria: !!templateCategoria,
        templateTexto: !!templateTexto
    });
    
    if (!contenedorTextos || !templateCategoria || !templateTexto) {
        console.error('Falta contenedor o templates');
        return;
    }
    
    fetch('/trabajoFinal/pestanas/php/get_biblioteca_contenido.php', {
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);
        
        if (data.success && data.categorias.length > 0) {
            contenedorTextos.innerHTML = '';
            
            data.categorias.forEach(categoria => {
                // Clonar template de categoría
                const clonCategoria = templateCategoria.content.cloneNode(true);
                clonCategoria.querySelector('.nombre-categoria').textContent = categoria.nombre;
                
                const listaTextosContenedor = clonCategoria.querySelector('.lista-textos-categoria');
                
                categoria.textos.forEach(texto => {
                    // Clonar template de texto
                    const clonTexto = templateTexto.content.cloneNode(true);
                    clonTexto.querySelector('.titulo-texto').textContent = texto.title;
                    clonTexto.querySelector('.traduccion-titulo').textContent = texto.title_translation || '';
                    clonTexto.querySelector('.preview-contenido').textContent = 
                        texto.content.substring(0, 200) + (texto.content.length > 200 ? '...' : '');
                    clonTexto.querySelector('.btn-leer-texto').setAttribute('data-texto-id', texto.id);
                    
                    listaTextosContenedor.appendChild(clonTexto);
                });
                
                contenedorTextos.appendChild(clonCategoria);
            });
            
            // Agregar manejador de eventos para botones "Leer"
            document.querySelectorAll('.btn-leer-texto').forEach(btn => {
                btn.addEventListener('click', function() {
                    const textoId = this.getAttribute('data-texto-id');
                    abrirTextoLectura(textoId);
                });
            });

            // Acordeón biblioteca: Añadir manejador de eventos después de cargar las categorías
            const categoriasAcordeon = document.querySelectorAll('.nombre-categoria');
            categoriasAcordeon.forEach(categoria => {
                categoria.addEventListener('click', () => {
                    const listaTextos = categoria.closest('.seccion-categoria').querySelector('.lista-textos-categoria');
                    const isVisible = listaTextos.style.display === 'block';
                    listaTextos.style.display = isVisible ? 'none' : 'block';
                });
            });
            
        } else {
            console.log('Sin categorías. Success:', data.success, 'Categorías:', data.categorias);
            const parrafo = document.createElement('p');
            parrafo.className = 'sin-contenido';
            parrafo.textContent = 'No hay textos disponibles.';
            contenedorTextos.appendChild(parrafo);
        }
    })
    .catch(error => {
        console.error('Error al cargar biblioteca:', error);
        const parrafo = document.createElement('p');
        parrafo.className = 'sin-contenido';
        parrafo.textContent = 'Error al cargar los textos.';
        contenedorTextos.appendChild(parrafo);
    });
}


/**
 * Abre un texto para lectura
 */
function abrirTextoLectura(textoId) {
    // Implementar la lógica para abrir el texto en la pestaña de lectura
    console.log('Abriendo texto:', textoId);
    // Por ahora solo mostrar un mensaje
    alert('Abriendo texto ' + textoId);
}

// Cargar biblioteca cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarBiblioteca);
} else {
    cargarBiblioteca();
}

// Exportar función para llamadas manuales
window.cargarBiblioteca = cargarBiblioteca;
