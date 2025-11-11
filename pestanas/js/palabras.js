document.addEventListener('DOMContentLoaded', function() {
    // Cargar palabras al inicio
    cargarPalabras();
    vincularEventos(); // Vincular eventos después de cargar las palabras
});

// Hacer la función cargarPalabras global
window.cargarPalabras = cargarPalabras;

// Función para cargar palabras
function cargarPalabras() {
    fetch('/trabajoFinal/traducion_api/palabras/ajax_saved_words_content.php?get_all_words=true', {
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const palabrasContainer = document.getElementById('palabras-dinamicas-container');
            const totalWordsCountSpan = document.getElementById('total-words-count');
            const barraAcciones = document.querySelector('.barra-acciones-palabras');

            if (!palabrasContainer) {
                console.error('No se encontró el elemento #palabras-dinamicas-container');
                return;
            }

            palabrasContainer.innerHTML = ''; // Limpiar contenido existente

            if (data.total_words_saved > 0) {
                if (barraAcciones) barraAcciones.style.display = '';
                if (totalWordsCountSpan) totalWordsCountSpan.textContent = data.total_words_saved;

                for (const title in data.words_by_text) {
                    const words = data.words_by_text[title];
                    const card = document.createElement('div');
                    card.classList.add('card');
                    
                    const groupId = `group-${md5(title)}`; // Usar md5 para IDs únicos
                    
                    card.innerHTML = `
                        <div class="card-header">
                            <input type="checkbox" class="text-checkbox group-checkbox" data-group-id="${groupId}">
                            <span class="text-title">
                                ${escapeHtml(title)}
                                <span>(${words.length})</span>
                            </span>
                        </div>
                        <ul class="text-list" id="${groupId}">
                            ${words.map(word => `
                                <li class="text-item">
                                    <input type="checkbox" name="selected_words[]" value="${escapeHtml(word.word)}|${parseInt(word.text_id || 0)}" class="text-checkbox">
                                    <span class="text-title">
                                        ${escapeHtml(word.word)}
                                        <span class="word-translation">(${escapeHtml(word.translation)})</span>
                                    </span>
                                    ${word.context ? `<span class="word-context" data-context="${escapeHtml(word.context)}">"${escapeHtml(word.context)}"</span>
                                    <div class="context-translation"></div>` : ''}
                                    <span class="word-date">${formatDate(word.created_at)}</span>
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    palabrasContainer.appendChild(card);
                }
                inicializarContextos(); // Re-inicializar contextos para los nuevos elementos
                vincularEventosCheckboxes(); // Re-vincular eventos para los nuevos checkboxes
                actualizarConteo(); // Actualizar conteo inicial
            } else {
                if (barraAcciones) barraAcciones.style.display = 'none';
                palabrasContainer.innerHTML = `<div class="no-words-message">No tienes palabras guardadas aún.</div>`;
            }
        } else {
            console.error('Error al cargar las palabras:', data.error);
            const palabrasContainer = document.getElementById('palabras-dinamicas-container');
            if (palabrasContainer) {
                palabrasContainer.innerHTML = `<p style="color: red; padding: 1rem;">Error: ${data.error}</p>`;
            }
        }
    })
    .catch(error => {
        console.error('Error en la petición fetch para cargar palabras:', error);
        const palabrasContainer = document.getElementById('palabras-dinamicas-container');
        if (palabrasContainer) {
            palabrasContainer.innerHTML = `
                <div class="no-words-message" style="text-align: center; padding: 3rem 1rem; color: #6b7280;">
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">Error al cargar palabras</p>
                    <p style="margin-bottom: 1.5rem; color: #9ca3af;">Por favor, verifica tu conexión y recarga la página</p>
                </div>
            `;
        }
    });
}

// Función auxiliar para escapar HTML
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&")
         .replace(/</g, "<")
         .replace(/>/g, ">")
         .replace(/"/g, """)
         .replace(/'/g, "&#039;");
}

// Función auxiliar para formatear fecha
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función auxiliar para generar hash MD5 (simulado, para IDs de grupo)
// En un entorno real, se usaría una librería o un hash más robusto si la seguridad fuera crítica
function md5(str) {
    // Esto es una implementación muy básica y no segura de MD5.
    // Para producción, se recomienda usar una librería criptográfica adecuada.
    // Para este caso de IDs de grupo, es suficiente para evitar colisiones simples.
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convertir a 32bit integer
    }
    return Math.abs(hash).toString(16); // Convertir a hexadecimal
}


// Inicializar contextos (ahora se llama después de cargar las palabras)
function inicializarContextos() {
    const contextos = document.querySelectorAll('.word-context');
    contextos.forEach(span => {
        const texto = span.dataset.context;
        const divTraduccion = span.nextElementSibling;
        
        if (texto && divTraduccion) {
            divTraduccion.textContent = 'Contexto: ' + texto;
        }
    });
}

// Vincular eventos (solo los que no dependen de la carga dinámica de palabras)
function vincularEventos() {
    const btnEliminar = document.getElementById('delete-selected-words-btn');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => eliminarPalabrasSeleccionadas());
    }
    // Los eventos de los checkboxes se vincularán después de cargar las palabras
}

// Nueva función para vincular eventos de checkboxes después de la carga dinámica
function vincularEventosCheckboxes() {
    // Checkboxes de palabras
    document.querySelectorAll('input[name="selected_words[]"]').forEach(checkbox => {
        checkbox.removeEventListener('change', actualizarConteo); // Evitar duplicados
        checkbox.addEventListener('change', actualizarConteo);
    });

    // Checkboxes de grupo
    document.querySelectorAll('.group-checkbox').forEach(checkbox => {
        checkbox.removeEventListener('change', function() { alternarGrupo(this, this.dataset.groupId); }); // Evitar duplicados
        checkbox.addEventListener('change', function() {
            alternarGrupo(this, this.dataset.groupId);
        });
    });
}

// Alternar grupo
function alternarGrupo(checkbox, idGrupo) {
    const grupo = document.getElementById(idGrupo);
    if (!grupo) return;
    
    grupo.querySelectorAll('input[name="selected_words[]"]').forEach(input => {
        input.checked = checkbox.checked;
    });
    
    actualizarConteo();
}

// Actualizar conteo
function actualizarConteo() {
    const seleccionados = document.querySelectorAll('input[name="selected_words[]"]:checked');
    const btnEliminar = document.getElementById('delete-selected-words-btn');
    const conteo = document.getElementById('selected-count');
    
    if (btnEliminar) {
        btnEliminar.disabled = seleccionados.length === 0;
    }
    
    if (conteo) {
        conteo.textContent = seleccionados.length;
    }
}

// Eliminar palabras
function eliminarPalabrasSeleccionadas() {
    const seleccionados = document.querySelectorAll('input[name="selected_words[]"]:checked');
    
    if (seleccionados.length === 0) {
        alert('Selecciona al menos una palabra');
        return;
    }
    
    if (!confirm('¿Eliminar palabras seleccionadas?')) return;
    
    const formData = new FormData();
    formData.append('action', 'delete');
    
    seleccionados.forEach(checkbox => {
        formData.append('selected_words[]', checkbox.value);
    });
    
    fetch('/trabajoFinal/traducion_api/palabras/ajax_saved_words_content.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // En lugar de recargar la página, recargar solo la sección de palabras
            cargarPalabras();
        } else {
            alert('Error: ' + (data.message || 'No se pudieron eliminar las palabras'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar las palabras');
    });
}
