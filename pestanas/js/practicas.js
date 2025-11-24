// Función de inicialización para la pestaña "Prácticas"
function iniciarPracticaUI() {
    console.log('iniciarPracticaUI() ejecutado.');

    const tituloPractica = document.querySelector('.titulo-practicar-vocabulario');
    const selectorTextos = document.getElementById('selectorTextosPractica');
    const botonesModoPractica = document.querySelectorAll('.boton-modo');

    // Función para cargar textos en el selector de prácticas
    async function cargarTextosParaPractica() {
        console.log('Intentando cargar textos para práctica...');
        if (!selectorTextos) {
            console.error('Elemento "selectorTextosPractica" no encontrado.');
            return;
        }

        try {
            // Mostrar mensaje de carga
            if (typeof window.showLoadingMessage === 'function') {
                window.showLoadingMessage();
            }

            console.log('Haciendo fetch a pestanas/php/get_textos.php');
            const response = await fetch('pestanas/php/get_textos.php');
            console.log('Respuesta HTTP:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Datos recibidos de get_textos.php:', data);

            // Limpiar opciones existentes (excepto la primera)
            selectorTextos.innerHTML = '<option value="">Selecciona un texto...</option>';
            
            if (data.success && data.data && data.data.length > 0) {
                data.data.forEach(texto => {
                    const option = document.createElement('option');
                    option.value = texto.id;
                    const titulo = texto.title_translation ? 
                        `${texto.title} • ${texto.title_translation}` : 
                        texto.title;
                    option.textContent = titulo;
                    selectorTextos.appendChild(option);
                });
                console.log('Textos cargados correctamente:', data.data.length);
            } else {
                console.log('No se encontraron textos para practicar.');
            }
        } catch (error) {
            console.error('Error al cargar textos de práctica:', error);
        } finally {
            // Ocultar mensaje de carga
            if (typeof window.hideLoadingMessage === 'function') {
                window.hideLoadingMessage();
            }
        }
    }

    // Establecer "Selección múltiple" como modo por defecto
    function establecerModoInicial() {
        const botonSeleccion = document.querySelector('.mode-btn');
        if (botonSeleccion) {
            botonSeleccion.classList.add('active');
            console.log('Modo "Selección múltiple" establecido por defecto.');
        }
    }

    // Event listeners para los botones de modo
    botonesModoPractica.forEach(boton => {
        boton.addEventListener('click', function() {
            botonesModoPractica.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const modoSeleccionado = this.dataset.modo || this.textContent;
            console.log('Modo de práctica seleccionado:', modoSeleccionado);
        });
    });

    // Cargar textos y establecer modo por defecto al inicializar
    cargarTextosParaPractica();
    establecerModoInicial();
}

// Exportar las funciones para que puedan ser llamadas globalmente
window.iniciarPracticaUI = iniciarPracticaUI;

// Función global para iniciar práctica desde onchange del selector
window.startSentencePractice = function() {
    const selectorTextos = document.getElementById('selectorTextosPractica');
    
    if (!selectorTextos || !selectorTextos.value) {
        console.log('Por favor selecciona un texto');
        return;
    }
    
    const textId = selectorTextos.value;
    const textTitle = selectorTextos.options[selectorTextos.selectedIndex].text;
    console.log('Iniciando práctica con texto ID:', textId, 'Título:', textTitle);
    
    // Cargar palabras del texto seleccionado
    fetch(`practica/ajax_saved_words_content.php?get_words_by_text=1&text_id=${textId}`)
        .then(res => {
            console.log('Response status:', res.status);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res.text(); // Leer como texto primero para ver qué se retorna
        })
        .then(text => {
            console.log('Response text:', text);
            try {
                const data = JSON.parse(text);
                
                if (data.success && data.words && data.words.length > 0) {
                    console.log('Palabras cargadas:', data.words.length);
                    
                    // Agregar text_title a cada palabra para que seleccionMultiple.js pueda usarlo
                    const palabrasConTitulo = data.words.map(palabra => ({
                        ...palabra,
                        text_title: textTitle
                    }));
                    
                    // Inicializar el ejercicio de selección múltiple
                    if (typeof window.iniciar === 'function') {
                        console.log('Iniciando ejercicio de selección múltiple');
                        window.iniciar(palabrasConTitulo);
                    } else {
                        console.error('La función window.iniciar no está disponible');
                        alert('Error: Sistema de práctica no inicializado.');
                    }
                } else {
                    console.log('No hay palabras para este texto:', data);
                    alert('No hay palabras guardadas para este texto. Por favor selecciona otro.');
                }
            } catch (e) {
                console.error('Error parsing JSON:', e);
                console.error('Respuesta del servidor:', text);
                alert('Error: Respuesta inválida del servidor.');
            }
        })
        .catch(error => {
            console.error('Error al cargar palabras:', error);
            alert('Error al cargar las palabras del texto: ' + error.message);
        });
};

// Ejecutar automáticamente cuando el script se carga
iniciarPracticaUI();
