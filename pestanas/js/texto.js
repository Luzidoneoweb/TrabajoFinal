// Función para cargar textos
function cargarTextos() {
    // console.log('Cargando textos...'); // Eliminado para limpiar consola
    
    // Mostrar mensaje de carga
    if (typeof window.showLoadingMessage === 'function') {
        window.showLoadingMessage();
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
            // console.log('Datos recibidos:', data); // Eliminado para limpiar consola
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
                
                // Actualizar la tarjeta de estadística en Progreso
                if (typeof window.cargarTextosSubidos === 'function') {
                    window.cargarTextosSubidos();
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
                    itemTexto.dataset.id = texto.id; // Añadir el ID del texto como data-id
                    
                    // Determinar texto inicial para la traducción
                    let textoTraduccion = texto.title_translation || 'Traduciendo...';
                    
                    itemTexto.innerHTML = `
                        <input type="checkbox" class="chk-texto">
                        <div class="info-texto">
                            <p class="titulo-texto">${texto.title}</p>
                            <p class="traduccion-texto" data-text-id="${texto.id}">${textoTraduccion}</p>
                        </div>
                        <p class="palabras-texto">${texto.content ? texto.content.split(' ').length : 0} palabras</p>
                        <span class="estado-leido">${texto.is_public ? 'Público' : 'Privado'}</span>
                        <button class="btn-estado-publico">${texto.is_public ? 'PÚBLICO' : 'PRIVADO'}</button>
                    `;
                    
                    // Si no hay traducción guardada, traducir automáticamente
                    if (!texto.title_translation && typeof window.traducirTitulo === 'function') {
                        const elementoTraduccion = itemTexto.querySelector('.traduccion-texto');
                        window.traducirTitulo(texto.title, texto.id).then(traduccion => {
                            if (traduccion && elementoTraduccion) {
                                elementoTraduccion.textContent = traduccion;
                            } else if (elementoTraduccion) {
                                elementoTraduccion.textContent = 'Sin traducción';
                            }
                        }).catch(error => {
                            console.error('Error al traducir título:', error);
                            if (elementoTraduccion) {
                                elementoTraduccion.textContent = 'Sin traducción';
                            }
                        });
                    }
                    // Agregar evento al checkbox para feedback visual
                    const checkbox = itemTexto.querySelector('.chk-texto');
                    if (checkbox) {
                        checkbox.addEventListener('change', (e) => {
                            console.log('[texto.js] Evento change en checkbox:', e.target.checked);
                            // Agregar o remover clase visual cuando se selecciona/deselecciona
                            if (e.target.checked) {
                                itemTexto.classList.add('seleccionado');
                            } else {
                                itemTexto.classList.remove('seleccionado');
                            }
                            // Actualizar botón de eliminar
                            const btnEliminarTextos = document.getElementById('btn-eliminar-textos');
                            const seleccionados = document.querySelectorAll('.chk-texto:checked').length;
                            console.log('[texto.js] Checkboxes seleccionados ahora:', seleccionados);
                            if (btnEliminarTextos) {
                                if (seleccionados > 0) {
                                    btnEliminarTextos.textContent = `Eliminar (${seleccionados})`;
                                    btnEliminarTextos.style.opacity = '1';
                                    btnEliminarTextos.style.pointerEvents = 'auto';
                                } else {
                                    btnEliminarTextos.textContent = 'Eliminar';
                                    btnEliminarTextos.style.opacity = '0.5';
                                    btnEliminarTextos.style.pointerEvents = 'none';
                                }
                            }
                        });
                    }
                    
                    // Mostrar contenido al hacer clic (excepto en checkbox y botón)
                    // Añadir evento de clic para cargar el texto en la pestaña de lectura
                    itemTexto.addEventListener('click', (e) => {
                        const target = e.target;
                        // Evitar que el clic en el checkbox o botón active la carga del texto
                        if (target && target.classList && (target.classList.contains('chk-texto') || target.classList.contains('btn-estado-publico'))) {
                            return;
                        }
                        // También prevenir si el clic fue en el checkbox directamente
                        if (target && target.tagName === 'INPUT' && target.type === 'checkbox') {
                            return;
                        }
                        // Guardar el ID del texto en localStorage
                        localStorage.setItem('currentTextId', texto.id);
                        
                        // Mostrar el mensaje de carga antes de cambiar a lectura
                        if (typeof window.showLoadingMessage === 'function') {
                            window.showLoadingMessage();
                        }
                        
                        // Pequeño delay para asegurar que el mensaje se muestre
                        setTimeout(() => {
                            if (typeof window.cambiarPestana === 'function') {
                                window.cambiarPestana('lectura');
                            } else {
                                console.error('La función cambiarPestana no está definida.');
                                // Ocultar si hay un error
                                if (typeof window.hideLoadingMessage === 'function') {
                                    window.hideLoadingMessage();
                                }
                            }
                        }, 50);
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
            
            // Ocultar mensaje de carga al finalizar (éxito o error)
            if (typeof window.hideLoadingMessage === 'function') {
                window.hideLoadingMessage();
            }
        })
        .catch(error => {
            // Solo mostrar error si es un error real, no un error silencioso de red
            // Los errores de "Failed to fetch" pueden ocurrir si el servidor no responde
            // pero no necesariamente son críticos si el usuario está offline
            if (error.name !== 'TypeError' || !error.message.includes('Failed to fetch')) {
                console.error('Error en la petición fetch:', error);
            }
            
            const listaTextos = document.querySelector('.lista-textos');
            if (listaTextos) {
                // Mostrar mensaje de error amigable
                listaTextos.innerHTML = `
                    <div class="sin-textos" style="text-align: center; padding: 3rem 1rem; color: #6b7280;">
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">Error al cargar textos</p>
                        <p style="margin-bottom: 1.5rem; color: #9ca3af;">Por favor, verifica tu conexión y recarga la página</p>
                    </div>
                `;
            }
            
            // Ocultar mensaje de carga en caso de error
            if (typeof window.hideLoadingMessage === 'function') {
                window.hideLoadingMessage();
            }
        });
}

// Manejo del botón de eliminar textos - FUERA de DOMContentLoaded
// Se ejecuta inmediatamente cuando el script se carga
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-eliminar-textos') {
        e.preventDefault();
        manejarEliminacionTextos();
    }
    
    // Manejo del botón "Textos públicos" - FUERA de DOMContentLoaded
    if (e.target && e.target.id === 'btn-textos-publicos') {
        e.preventDefault();
        e.stopPropagation();
        
        // Cambiar a la pestaña Biblioteca
        if (typeof window.cambiarPestana === 'function') {
            window.cambiarPestana('biblioteca');
            
            // Esperar y cargar biblioteca
            setTimeout(function() {
                const panelBiblioteca = document.getElementById('panelBiblioteca');
                
                if (panelBiblioteca && panelBiblioteca.classList.contains('activo')) {
                    if (typeof window.cargarBiblioteca === 'function') {
                        window.cargarBiblioteca();
                    } else {
                        // Intentar cargar el script si no está disponible
                        const script = document.createElement('script');
                        script.src = 'pestanas/js/cargar_biblioteca.js';
                        script.onload = function() {
                            if (typeof window.cargarBiblioteca === 'function') {
                                window.cargarBiblioteca();
                            }
                        };
                        document.body.appendChild(script);
                    }
                } else {
                    // Reintentar si el panel no está activo aún
                    setTimeout(function() {
                        if (typeof window.cargarBiblioteca === 'function') {
                            window.cargarBiblioteca();
                        }
                    }, 500);
                }
            }, 500);
        }
    }
});

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
                        // console.log('Panel de textos activado, cargando...'); // Eliminado para limpiar consola
                        cargarTextos();
                    }
                }
            });
        });
        observer.observe(panelTextos, { attributes: true });
    }

});

// Función para manejar la eliminación de textos
function manejarEliminacionTextos() {
    console.log('[texto.js] manejarEliminacionTextos ejecutada');
    
    const checkboxesSeleccionados = document.querySelectorAll('.chk-texto:checked');
    console.log('[texto.js] Checkboxes seleccionados:', checkboxesSeleccionados.length);
    
    const idsTextosAEliminar = Array.from(checkboxesSeleccionados).map(checkbox => {
        // Asumiendo que el ID del texto se puede obtener de un atributo data-id en el item-texto padre
        // o que el checkbox tiene un atributo data-id
        const itemTexto = checkbox.closest('.item-texto');
        const id = itemTexto ? itemTexto.dataset.id : null;
        console.log('[texto.js] ID encontrado:', id);
        return id;
    }).filter(id => id !== null);

    console.log('[texto.js] IDs a eliminar:', idsTextosAEliminar);

    if (idsTextosAEliminar.length === 0) {
        console.warn('[texto.js] No hay textos seleccionados');
        mostrarNotificacion('Por favor, selecciona al menos un texto para eliminar.', 'error');
        return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar ${idsTextosAEliminar.length} texto(s) seleccionado(s)?`)) {
        console.log('[texto.js] Usuario canceló la eliminación');
        return; // El usuario canceló la eliminación
    }

    console.log('[texto.js] Enviando solicitud de eliminación a pestanas/php/eliminar_textos.php');

    // Realizar la llamada fetch para eliminar los textos
    fetch('pestanas/php/eliminar_textos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: idsTextosAEliminar }),
        credentials: 'include'
    })
    .then(response => {
        console.log('[texto.js] Respuesta recibida, status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('[texto.js] Datos JSON parseados:', data);
        if (data.success) {
            console.log('[texto.js] Eliminación exitosa');
            mostrarNotificacion(data.message, 'exito');
            
            // Resetear botón de eliminar
            const btnEliminarTextos = document.getElementById('btn-eliminar-textos');
            if (btnEliminarTextos) {
                btnEliminarTextos.textContent = 'Eliminar';
                btnEliminarTextos.style.opacity = '0.5';
                btnEliminarTextos.style.pointerEvents = 'none';
            }
            
            cargarTextos(); // Recargar la lista de textos para actualizar la UI
            // Actualizar la tarjeta de estadística en Progreso
            if (typeof window.cargarTextosSubidos === 'function') {
                window.cargarTextosSubidos();
            }
            // Llamar a la función global para recargar las palabras
            if (typeof window.cargarPalabras === 'function') {
                window.cargarPalabras();
            }
        } else {
            console.error('[texto.js] Error en respuesta del servidor:', data.error);
            // Si data.error no está definido, proporcionar un mensaje genérico
            mostrarNotificacion('Error al eliminar textos: ' + (data.error || 'Error desconocido en el servidor.'), 'error');
        }
    })
    .catch(error => {
        console.error('[texto.js] Error en la petición fetch para eliminar textos:', error);
        mostrarNotificacion('Error de conexión al intentar eliminar textos: ' + error.message, 'error');
    });
}
