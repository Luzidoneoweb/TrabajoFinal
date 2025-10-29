// Función para cargar textos
function cargarTextos() {
    console.log('Cargando textos...');
    fetch('php/pestanas/php/get_textos.php', { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.success) {
                const listaTextos = document.querySelector('.lista-textos');
                const visor = document.querySelector('.visor-texto');
                const contador = document.querySelector('.contador-textos');
                
                if (!listaTextos) {
                    console.error('No se encontró el elemento .lista-textos');
                    return;
                }
                
                listaTextos.innerHTML = ''; // Limpiar el contenido existente

                if (contador) {
                    contador.textContent = `${data.data.length} texto${data.data.length !== 1 ? 's' : ''} encontrado${data.data.length !== 1 ? 's' : ''}`;
                }

                // Si no hay textos, mostrar mensaje y botón para subir
                if (data.data.length === 0) {
                    listaTextos.innerHTML = `
                        <div class="sin-textos" style="text-align: center; padding: 3rem 1rem; color: #6b7280;">
                            <p style="font-size: 1.2rem; margin-bottom: 1rem;">No tienes textos aún</p>
                            <p style="margin-bottom: 1.5rem; color: #9ca3af;">Comienza subiendo tu primer texto</p>
                            <button class="btn-subir-primer-texto" style="padding: 0.75rem 1.5rem; background-color: #ff8a00; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 1rem;">Subir mi primer texto</button>
                        </div>
                    `;
                    
                    // Añadir listener al botón para cambiar a la pestaña de subir
                    const btnSubir = listaTextos.querySelector('.btn-subir-primer-texto');
                    if (btnSubir) {
                        btnSubir.addEventListener('click', function() {
                            // Usar la función cambiarPestana del global.js
                            if (typeof window.cambiarPestana === 'function') {
                                window.cambiarPestana('subirTexto');
                            } else {
                                // Fallback: buscar y hacer clic en la pestaña
                                const pestañaSubir = document.querySelector('.pestana[data-pestana="subirTexto"]');
                                if (pestañaSubir) {
                                    pestañaSubir.click();
                                }
                            }
                        });
                    }
                    return; // Salir temprano si no hay textos
                }

                data.data.forEach(texto => {
                    const itemTexto = document.createElement('div');
                    itemTexto.classList.add('item-texto');
                    itemTexto.innerHTML = `
                        <input type="checkbox" class="chk-texto">
                        <div class="info-texto">
                            <p class="titulo-texto">${texto.title}</p>
                            <p class="traduccion-texto">${texto.title_translation || 'Sin traducción'}</p>
                        </div>
                        <p class="palabras-texto">${texto.content ? texto.content.split(' ').length : 0} palabras</p>
                        <span class="estado-leido">${texto.is_public ? 'Público' : 'Privado'}</span>
                        <button class="btn-estado-publico">${texto.is_public ? 'PÚBLICO' : 'PRIVADO'}</button>
                    `;
                    // Mostrar contenido al hacer clic (excepto en checkbox y botón)
                    itemTexto.addEventListener('click', (e) => {
                        const target = e.target;
                        if (target && target.classList && (target.classList.contains('chk-texto') || target.classList.contains('btn-estado-publico'))) {
                            return;
                        }
                        if (visor) {
                            visor.innerHTML = `
                                <div class="tarjeta-visor">
                                    <h3 class="visor-titulo">${texto.title}</h3>
                                    <div class="visor-contenido">
                                        <div class="visor-columna">
                                            <h4>Original</h4>
                                            <p>${(texto.content || '').replace(/\n/g, '<br>')}</p>
                                        </div>
                                        <div class="visor-columna">
                                            <h4>Traducción</h4>
                                            <p>${(texto.content_translation || 'Sin traducción').replace(/\n/g, '<br>')}</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    });
                    listaTextos.appendChild(itemTexto);
                });
            } else {
                console.error('Error al cargar los textos:', data.error);
                const listaTextos = document.querySelector('.lista-textos');
                if (listaTextos) {
                    listaTextos.innerHTML = `<p style="color: red; padding: 1rem;">Error: ${data.error}</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error en la petición fetch:', error);
            const listaTextos = document.querySelector('.lista-textos');
            if (listaTextos) {
                listaTextos.innerHTML = `<p style="color: red; padding: 1rem;">Error de conexión: ${error.message}</p>`;
            }
        });
}

// Cargar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que el panel esté visible
    setTimeout(() => {
        const panelTextos = document.getElementById('panelTextos');
        if (panelTextos && panelTextos.classList.contains('activo')) {
            cargarTextos();
        }
    }, 100);
    
    // Observar cambios en el panel para recargar cuando se active
    const panelTextos = document.getElementById('panelTextos');
    if (panelTextos) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (panelTextos.classList.contains('activo')) {
                        console.log('Panel de textos activado, cargando...');
                        cargarTextos();
                    }
                }
            });
        });
        observer.observe(panelTextos, { attributes: true });
    }
});
