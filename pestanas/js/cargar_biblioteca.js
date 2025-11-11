/**
 * Carga el contenido de la biblioteca (categorías con textos públicos)
 */
function cargarBiblioteca() {
    const contenedorTextos = document.getElementById('bulkForm');
    
    if (!contenedorTextos) {
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
        if (data.success && data.categorias.length > 0) {
            contenedorTextos.innerHTML = '';
            
            data.categorias.forEach(categoria => {
                // Crear sección de categoría
                const seccionCategoria = document.createElement('div');
                seccionCategoria.className = 'seccion-categoria';
                
                const encabezadoCategoria = document.createElement('div');
                encabezadoCategoria.className = 'encabezado-categoria';
                encabezadoCategoria.innerHTML = `<h3>${categoria.nombre}</h3>`;
                
                seccionCategoria.appendChild(encabezadoCategoria);
                
                // Crear lista de textos
                const listaTextos = document.createElement('div');
                listaTextos.className = 'lista-textos-categoria';
                
                categoria.textos.forEach(texto => {
                    const itemTexto = document.createElement('div');
                    itemTexto.className = 'item-texto';
                    itemTexto.innerHTML = `
                        <div class="encabezado-texto">
                            <h4>${texto.title}</h4>
                            ${texto.title_translation ? `<p class="traduccion-titulo">${texto.title_translation}</p>` : ''}
                        </div>
                        <div class="contenido-texto-preview">
                            <p>${texto.content.substring(0, 200)}${texto.content.length > 200 ? '...' : ''}</p>
                        </div>
                        <button class="btn-leer-texto" data-texto-id="${texto.id}">Leer</button>
                    `;
                    listaTextos.appendChild(itemTexto);
                });
                
                seccionCategoria.appendChild(listaTextos);
                contenedorTextos.appendChild(seccionCategoria);
            });
            
            // Agregar manejador de eventos para botones "Leer"
            document.querySelectorAll('.btn-leer-texto').forEach(btn => {
                btn.addEventListener('click', function() {
                    const textoId = this.getAttribute('data-texto-id');
                    abrirTextoLectura(textoId);
                });
            });
            
        } else {
            contenedorTextos.innerHTML = '<p class="sin-contenido">No hay textos disponibles.</p>';
        }
    })
    .catch(error => {
        console.error('Error al cargar biblioteca:', error);
        contenedorTextos.innerHTML = '<p class="sin-contenido">Error al cargar los textos.</p>';
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
