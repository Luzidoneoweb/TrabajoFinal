document.addEventListener('DOMContentLoaded', function() {
    inicializarContextos();
    vincularEventos();
});

// Inicializar contextos
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

// Vincular eventos
function vincularEventos() {
    const btnEliminar = document.getElementById('delete-selected-words-btn');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => eliminarPalabrasSeleccionadas());
    }

    // Checkboxes de palabras
    document.querySelectorAll('input[name="selected_words[]"]').forEach(checkbox => {
        checkbox.addEventListener('change', actualizarConteo);
    });

    // Checkboxes de grupo
    document.querySelectorAll('.group-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            alternarGrupo(this, this.dataset.groupId);
        });
    });

    actualizarConteo();
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
            location.reload();
        } else {
            alert('Error: ' + (data.message || 'No se pudieron eliminar las palabras'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar las palabras');
    });
}
