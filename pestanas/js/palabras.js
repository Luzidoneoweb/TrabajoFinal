document.addEventListener('DOMContentLoaded', function() {
    loadSavedWords();
});

function loadSavedWords() {
    fetch('/trabajoFinal/traducion_api/palabras/ajax_saved_words_content.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('palabras-guardadas-container').innerHTML = html;
            // Después de cargar el HTML, inicializar la traducción de contextos
            initializeContextTranslations();
        })
        .catch(error => {
            console.error('Error al cargar las palabras guardadas:', error);
            document.getElementById('palabras-guardadas-container').innerHTML = '<p>Error al cargar las palabras guardadas. Por favor, inténtalo de nuevo más tarde.</p>';
        });
}

function initializeContextTranslations() {
    const contextSpans = document.querySelectorAll('.word-context');
    contextSpans.forEach(span => {
        const contextText = span.dataset.context;
        const translationDiv = span.nextElementSibling; // El div para la traducción del contexto

        if (contextText && translationDiv) {
            // Aquí puedes llamar a tu API de traducción si es necesario
            // Por ahora, solo para demostración, simularé una traducción
            // En un entorno real, harías una llamada AJAX a tu endpoint de traducción
            // Por ejemplo:
            // fetch('/trabajoFinal/traducion_api/translate.php', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            //     body: `text=${encodeURIComponent(contextText)}&target_lang=es`
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.translated_text) {
            //         translationDiv.textContent = data.translated_text;
            //     }
            // })
            // .catch(error => console.error('Error traduciendo contexto:', error));
            
            // Simulación de traducción
            translationDiv.textContent = 'Traducción del contexto: ' + contextText;
        }
    });
}


// Funciones para las acciones en lote y el dropdown (copiadas de ajax_saved_words_content.php)
function toggleDropdown() {
    document.getElementById("dropdownContent").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.nav-btn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function selectAllWords() {
    const checkboxes = document.querySelectorAll('#words-list-form .text-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    updateBulkActionsWords();
}

function unselectAllWords() {
    const checkboxes = document.querySelectorAll('#words-list-form .text-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateBulkActionsWords();
}

function performBulkActionWords(action) {
    const selectedWords = Array.from(document.querySelectorAll('input[name="selected_words[]"]:checked'))
                               .map(checkbox => checkbox.value);

    if (selectedWords.length === 0) {
        alert('Por favor, selecciona al menos una palabra para realizar esta acción.');
        return;
    }

    if (action === 'delete') {
        if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedWords.length} palabra(s) seleccionada(s)?`)) {
            return;
        }

        fetch('/trabajoFinal/traducion_api/palabras/ajax_saved_words_content.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=delete&${selectedWords.map(word => `selected_words[]=${encodeURIComponent(word)}`).join('&')}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                loadSavedWords(); // Recargar la lista de palabras
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error en la acción en lote:', error);
            alert('Ocurrió un error al realizar la acción en lote.');
        });
    }
}

function toggleGroup(source, groupId) {
    const checkboxes = document.querySelectorAll(`#${groupId} .text-checkbox`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
    updateBulkActionsWords();
}

function updateBulkActionsWords() {
    // Esta función puede usarse para habilitar/deshabilitar botones de acción en lote
    // o actualizar el contador de palabras seleccionadas si fuera necesario.
    // Por ahora, no hace nada visual, pero es un placeholder.
    console.log('Actualizando acciones en lote...');
}
