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

    // Event listener para cuando se selecciona un texto
    function cargarEjercicio() {
        console.log('Se seleccionó un texto para práctica');
        const textoSeleccionadoId = selectorTextos.value;
        const textoSeleccionadoText = selectorTextos.options[selectorTextos.selectedIndex].text;
        
        if (!textoSeleccionadoId) {
            console.log('No se ha seleccionado ningún texto');
            return;
        }
        
        const modoActual = document.querySelector('.boton-modo.activo')?.dataset.modo || 'seleccion';
        console.log('Cargando ejercicio:', { textoId: textoSeleccionadoId, textoTitulo: textoSeleccionadoText, modo: modoActual });
        
        // Aquí se debe llamar a una función para cargar el contenido del ejercicio
        // De acuerdo con el endpoint que corresponda
        cargarContenidoEjercicio(textoSeleccionadoId, modoActual, textoSeleccionadoText);
    }
    
    // Función para cargar el contenido del ejercicio
    async function cargarContenidoEjercicio(textoId, modo, textoTitulo) {
        try {
            console.log('Intentando cargar ejercicio para texto:', textoId, 'modo:', modo);
            
            // Mostrar mensaje de carga
            if (typeof window.showLoadingMessage === 'function') {
                window.showLoadingMessage();
            }
            
            // Llamar al endpoint para obtener el contenido del ejercicio
            const response = await fetch('practica/ajax_practice_content.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `texto_id=${textoId}&modo=${modo}`
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Respuesta del ejercicio:', data);
            
            if (!data.success) {
                console.warn('Error en respuesta:', data.error);
                mostrarMensajeError(data.error || 'Error al cargar el ejercicio');
                return;
            }
            
            // Obtener o crear el contenedor de ejercicio
            let contenedorEjercicio = document.getElementById('contenedor-ejercicio-dinamico');
            if (!contenedorEjercicio) {
                contenedorEjercicio = document.createElement('div');
                contenedorEjercicio.id = 'contenedor-ejercicio-dinamico';
                const tarjeta = document.querySelector('.tarjeta-practicar-vocabulario');
                if (tarjeta) {
                    tarjeta.parentNode.insertBefore(contenedorEjercicio, tarjeta.nextSibling);
                }
            }
            
            // Mostrar el ejercicio
            mostrarEjercicioPractica(data.palabras, data.modo, data.texto_id, contenedorEjercicio);
            
        } catch (error) {
            console.error('Error al cargar el ejercicio:', error);
            mostrarMensajeError('Error al cargar el ejercicio. Intenta de nuevo.');
        } finally {
            if (typeof window.hideLoadingMessage === 'function') {
                window.hideLoadingMessage();
            }
        }
    }
    
    // Función auxiliar para mostrar mensajes de error
    function mostrarMensajeError(mensaje) {
        let contenedorError = document.getElementById('contenedor-ejercicio-dinamico');
        if (contenedorError) {
            contenedorError.innerHTML = `
                <div style="margin-top: 2rem; padding: 2rem; background-color: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626;">
                    <p>${mensaje}</p>
                </div>
            `;
        }
    }
    
    // Agregar event listener al selector de textos
    if (selectorTextos) {
        selectorTextos.addEventListener('change', cargarEjercicio);
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
            
            // Si ya hay un texto seleccionado, recargar el ejercicio con el nuevo modo
            const textoSeleccionado = selectorTextos.value;
            if (textoSeleccionado) {
                console.log('Recargar ejercicio con nuevo modo:', modoSeleccionado);
                cargarEjercicio();
            }
        });
    });

    // Cargar textos y establecer modo por defecto al inicializar
    cargarTextosParaPractica();
    establecerModoInicial();
}

// Exportar la función para que pueda ser llamada globalmente
window.iniciarPracticaUI = iniciarPracticaUI;

// Función global para mostrar un ejercicio de práctica
window.mostrarEjercicioPractica = function(palabras, modo, textId, contenedor) {
    console.log('mostrarEjercicioPractica() llamada con:', { palabras: palabras.length, modo, textId });
    
    // Si no se proporciona contenedor, buscar uno
    if (!contenedor) {
        contenedor = document.getElementById('contenedor-ejercicio-dinamico') || document.getElementById('practice-exercise-area');
    }
    
    if (!contenedor) {
        console.error('Contenedor para ejercicio no encontrado');
        return;
    }
    
    if (modo === 'seleccion') {
        mostrarEjercicioSeleccion(palabras, textId, contenedor);
    } else if (modo === 'escritura') {
        mostrarEjercicioEscritura(palabras, textId, contenedor);
    } else if (modo === 'frases') {
        mostrarEjercicioFrases(palabras, textId, contenedor);
    }
};

// Mostrar ejercicio de selección múltiple
function mostrarEjercicioSeleccion(palabras, textId, contenedor) {
    if (!palabras || palabras.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: #6b7280;">No hay palabras para este ejercicio.</p>';
        return;
    }
    
    let html = `
        <div style="margin-top: 2rem;">
            <div style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 0.95rem;">Responde las preguntas seleccionando la traducción correcta</p>
            </div>
    `;
    
    palabras.forEach((palabra, index) => {
        const correcta = palabra.translation;
        const incorrecta = generarOpcionIncorrecta(correcta);
        const opciones = [correcta, incorrecta].sort(() => Math.random() - 0.5);
        
        html += `
            <div class="exercise-card" style="margin-bottom: 2rem; padding: 1.5rem; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div class="practice-instruction" style="font-size: 0.9rem; color: #6b7280; margin-bottom: 0.5rem;">
                    Pregunta ${index + 1} de ${palabras.length}
                </div>
                <div style="font-size: 1.2rem; font-weight: 600; color: #1f2937; margin-bottom: 1.5rem;">
                    ¿Cuál es la traducción de <span style="color: #f97316; background-color: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 4px;">"${palabra.word}"</span>?
                </div>
                <div class="practice-options" style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
                    ${opciones.map((opcion, idx) => `
                        <button class="option-btn" data-index="${idx}" data-respuesta="${opcion.replace(/"/g, '&quot;')}" data-correcta="${correcta.replace(/"/g, '&quot;')}" style="padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 6px; background-color: #f9fafb; cursor: pointer; text-align: left; transition: all 0.2s; font-size: 0.95rem;">
                            ${opcion}
                        </button>
                    `).join('')}
                </div>
                <div class="practice-context" style="font-size: 0.85rem; color: #6b7280; font-style: italic; padding: 0.75rem; background-color: #f3f4f6; border-radius: 4px;">
                    <strong>Contexto:</strong> "${palabra.context || 'No disponible'}"
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    contenedor.innerHTML = html;
    
    // Agregar event listeners a los botones después de insertar el HTML
    const botones = contenedor.querySelectorAll('.option-btn');
    botones.forEach(btn => {
        btn.addEventListener('mouseover', function() {
            this.style.borderColor = '#f97316';
            this.style.backgroundColor = '#fef3c7';
        });
        btn.addEventListener('mouseout', function() {
            this.style.borderColor = '#e5e7eb';
            this.style.backgroundColor = '#f9fafb';
        });
        btn.addEventListener('click', function() {
            const respuesta = this.getAttribute('data-respuesta');
            const correcta = this.getAttribute('data-correcta');
            verificarRespuestaSeleccion(this, respuesta, correcta);
        });
    });
}

// Función auxiliar para generar una opción incorrecta
function generarOpcionIncorrecta(correcta) {
    const opciones = ['hermano', 'gato', 'libro', 'casa', 'agua', 'fuego', 'árbol', 'cielo', 'mar', 'montaña'];
    return opciones[Math.floor(Math.random() * opciones.length)];
}

// Función para verificar respuesta
function verificarRespuestaSeleccion(elemento, respuesta, correcta) {
    if (respuesta === correcta) {
        elemento.style.backgroundColor = '#dcfce7';
        elemento.style.borderColor = '#22c55e';
        elemento.style.color = '#166534';
        elemento.textContent = '✓ Correcto';
    } else {
        elemento.style.backgroundColor = '#fee2e2';
        elemento.style.borderColor = '#ef4444';
        elemento.style.color = '#991b1b';
        elemento.textContent = '✗ Incorrecto';
    }
    elemento.disabled = true;
    // Deshabilitar todos los botones de opciones en esta pregunta
    const allButtons = elemento.closest('.exercise-card').querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);
}

// Mostrar ejercicio de escritura de palabra
function mostrarEjercicioEscritura(palabras, textId, contenedor) {
    if (!palabras || palabras.length === 0) {
        contenedor.innerHTML = '<p>No hay palabras para este ejercicio.</p>';
        return;
    }
    
    let html = '';
    palabras.forEach((palabra, index) => {
        html += `
            <div class="exercise-card" style="margin-bottom: 2rem; padding: 1.5rem; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
                <div class="practice-instruction" style="font-size: 1rem; color: #374151; margin-bottom: 1rem;">
                    Pregunta ${index + 1} de ${palabras.length}: Escribe la palabra en inglés para la traducción
                </div>
                <div style="margin-bottom: 1rem;">
                    <p style="font-size: 1.1rem; font-weight: 600; color: #1f2937;">${palabra.translation}</p>
                </div>
                <div class="practice-input" style="margin-bottom: 1rem;">
                    <input type="text" placeholder="Escribe la palabra..." style="width: 100%; padding: 0.75rem; border: 2px solid #d1d5db; border-radius: 6px; font-size: 1rem;">
                </div>
                <div class="practice-context" style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280; font-style: italic;">
                    Contexto: "${palabra.context || 'No disponible'}"
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

// Mostrar ejercicio de traducción de frases
function mostrarEjercicioFrases(palabras, textId, contenedor) {
    if (!palabras || palabras.length === 0) {
        contenedor.innerHTML = '<p>No hay palabras para este ejercicio.</p>';
        return;
    }
    
    let html = '';
    palabras.forEach((palabra, index) => {
        html += `
            <div class="exercise-card" style="margin-bottom: 2rem; padding: 1.5rem; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
                <div class="practice-instruction" style="font-size: 1rem; color: #374151; margin-bottom: 1rem;">
                    Pregunta ${index + 1} de ${palabras.length}: Traduce la frase al español
                </div>
                <div style="margin-bottom: 1rem;">
                    <p style="font-size: 1.1rem; font-weight: 600; color: #1f2937; padding: 1rem; background-color: #f3f4f6; border-radius: 6px;">${palabra.context || palabra.word}</p>
                </div>
                <div class="practice-input" style="margin-bottom: 1rem;">
                    <textarea placeholder="Escribe la traducción..." style="width: 100%; padding: 0.75rem; border: 2px solid #d1d5db; border-radius: 6px; font-size: 1rem; min-height: 100px;"></textarea>
                </div>
                <div style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
                    <p><strong>Pista:</strong> ${palabra.translation}</p>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

// Ejecutar automáticamente cuando el script se carga
// El script se carga dinámicamente cuando se hace clic en la pestaña de prácticas
iniciarPracticaUI();
