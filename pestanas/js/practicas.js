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

            console.log('Haciendo fetch a practica/ajax_user_texts.php con accion=listar');
            const response = await fetch('practica/ajax_user_texts.php', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
                body: 'accion=listar' 
            });
            console.log('Respuesta HTTP:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Datos recibidos de practica/ajax_user_texts.php:', data);

            // Limpiar opciones existentes (excepto la primera)
            selectorTextos.innerHTML = '<option value="">Selecciona un texto...</option>';
            
            if (data.success && data.textos && data.textos.length > 0) {
                data.textos.forEach(texto => {
                    const option = document.createElement('option');
                    option.value = texto.id;
                    option.textContent = texto.title;
                    selectorTextos.appendChild(option);
                });
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
        const botonSeleccion = document.querySelector('.boton-modo[data-modo="seleccion"]');
        if (botonSeleccion) {
            botonSeleccion.classList.add('activo'); // Asumimos una clase 'activo' para el modo seleccionado
            console.log('Modo "Selección múltiple" establecido por defecto.');
        }
    }

    // Event listeners para los botones de modo
    botonesModoPractica.forEach(boton => {
        boton.addEventListener('click', function() {
            botonesModoPractica.forEach(btn => btn.classList.remove('activo'));
            this.classList.add('activo');
            const modoSeleccionado = this.dataset.modo;
            console.log('Modo de práctica seleccionado:', modoSeleccionado);

            // Actualizar el título según el modo seleccionado
            if (tituloPractica) {
                if (modoSeleccionado === 'seleccion') {
                    tituloPractica.textContent = 'Practicar';
                } else if (modoSeleccionado === 'escritura') {
                    tituloPractica.textContent = 'Escribir palabra';
                } else if (modoSeleccionado === 'frases') {
                    tituloPractica.textContent = 'Escribir frases';
                }
            }
            // Aquí se podría añadir lógica para cargar el ejercicio correspondiente al modo
        });
    });

    // Cargar textos y establecer modo por defecto al inicializar
    cargarTextosParaPractica();
    establecerModoInicial();
}

// Exportar la función para que pueda ser llamada globalmente
window.iniciarPracticaUI = iniciarPracticaUI;

// Ejecutar automáticamente cuando el script se carga
// El script se carga dinámicamente cuando se hace clic en la pestaña de prácticas
iniciarPracticaUI();
