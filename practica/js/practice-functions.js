// ============================================
// FUNCIONES DE PRÁCTICA Y EJERCICIOS
// ============================================

// Variables globales para la práctica
window.practiceWords = [];
window.practiceRemainingWords = [];
window.practiceCurrentQuestionIndex = 0;
window.practiceCorrectAnswers = 0;
window.practiceIncorrectAnswers = 0;
window.practiceAnswered = false;
window.practiceCurrentWordIndex = 0;
window.practiceCurrentSentenceData = {};
window.practiceResultsActive = false;
window.currentWordErrors = 0; // Para el modo escritura

// Función global para configurar voz en inglés offline (mantenida para compatibilidad con fallback)
window.configureEnglishVoice = function(utterance) {
    utterance.lang = 'en-US';
};

// Función de inicialización para la pestaña "Prácticas"
window.iniciarPracticaUI = function() {
    console.log('iniciarPracticaUI() ejecutado.');

    const botonesModoPractica = document.querySelectorAll('.mode-btn');

    // Cargar textos y establecer modo por defecto al inicializar
    cargarTextosParaPractica();
    establecerModoInicial();

    // Event listeners para los botones de modo
    botonesModoPractica.forEach(boton => {
        boton.addEventListener('click', function() {
            botonesModoPractica.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const modoSeleccionado = this.dataset.mode; // Usar dataset.mode
            console.log('Modo de práctica seleccionado:', modoSeleccionado);
            window.setPracticeMode(modoSeleccionado);
        });
    });
}

// Función para cargar textos en el selector de prácticas
async function cargarTextosParaPractica() {
    console.log('🔍 [cargarTextosParaPractica] Iniciando...');
    const selectorTextos = document.getElementById('selectorTextosPractica');
    console.log('🔍 [cargarTextosParaPractica] Selector encontrado:', !!selectorTextos);
    console.log('🔍 [cargarTextosParaPractica] Estado actual del selector:', selectorTextos ? selectorTextos.innerHTML : 'Selector no encontrado');
    if (!selectorTextos) {
        console.error('❌ Elemento "selectorTextosPractica" no encontrado.');
        return;
    }

    try {
        // Mostrar mensaje de carga
        if (typeof window.showLoadingMessage === 'function') {
            window.showLoadingMessage();
        }

        console.log('🔍 [cargarTextosParaPractica] Haciendo fetch a: /trabajoFinal/pestanas/php/get_textos.php');
        const response = await fetch('/trabajoFinal/pestanas/php/get_textos.php', {
            credentials: 'include'
        });
        console.log('🔍 [cargarTextosParaPractica] Response:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('🔍 [cargarTextosParaPractica] Datos recibidos:', data);
        console.log('🔍 [cargarTextosParaPractica] Contenido de data.data:', data.data);

        // Limpiar opciones existentes (excepto la primera)
        selectorTextos.innerHTML = '<option value="">Selecciona un texto...</option>';
        
        if (data.success && data.data && data.data.length > 0) {
            console.log('🔍 [cargarTextosParaPractica] Total de textos:', data.data.length);
            // Agregar todos los textos del usuario (todos son "own" porque get_textos.php solo devuelve textos del usuario)
            data.data.forEach((text, index) => {
                console.log(`🔍 [cargarTextosParaPractica] Procesando texto ${index}:`, text.title, text.id);
                const option = document.createElement('option');
                option.value = text.id;
                const titulo = text.title_translation ? 
                    `${text.title} • ${text.title_translation}` : 
                    text.title;
                option.textContent = titulo;
                selectorTextos.appendChild(option);
                console.log(`✅ [cargarTextosParaPractica] Option agregada: ${titulo}`);
            });
            console.log('✅ [cargarTextosParaPractica] Textos cargados correctamente:', data.data.length);
            console.log('🔍 [cargarTextosParaPractica] Contenido final del selector:', selectorTextos.innerHTML);
        } else {
            console.log('⚠️ [cargarTextosParaPractica] No se encontraron textos. Success:', data.success, 'Data:', data.data);
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
    const botonSeleccion = document.querySelector('.mode-btn[data-mode="selection"]'); // Usar data-mode
    if (botonSeleccion) {
        botonSeleccion.classList.add('active');
        window.practiceCurrentMode = 'selection'; // Asegurar que el modo global esté configurado
        console.log('Modo "Selección múltiple" establecido por defecto.');
    }
}

// Cargar modo práctica - mostrar selector de texto primero
window.loadPracticeMode = async function() {
    // La UI ya se carga con iniciarPracticaUI, solo necesitamos asegurar que el selector esté visible
    const practiceCard = document.getElementById('practice-exercise-card');
    if (practiceCard) {
        // Asegurarse de que el selector de texto esté visible si no hay un ejercicio activo
        if (!window.practiceWords || window.practiceWords.length === 0 || window.practiceResultsActive) {
            cargarTextosParaPractica(); // Recargar el selector si es necesario
        }
    }
}

// Inicializar práctica con palabras (solo variables, no interfaz)
function initializePractice(words) {
    window.practiceWords = [...words];
    window.practiceRemainingWords = [...words];
    window.practiceCurrentQuestionIndex = 0;
    window.practiceCorrectAnswers = 0;
    window.practiceIncorrectAnswers = 0;
    window.practiceAnswered = false;
    
    updatePracticeStats();
    loadPracticeQuestion();
    window.practiceStartTime = Date.now();
    window.practiceEndTime = null;
    window.practiceDuration = null;
}

// Establecer modo de práctica
window.setPracticeMode = function(mode) {
    window.practiceCurrentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    // El botón ya se activa en iniciarPracticaUI, pero si se llama directamente, lo activamos
    const targetBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`); // Usar data-mode
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Recargar el selector de textos para el nuevo modo
    cargarTextosParaPractica();
    
    // Limpiar la tarjeta de ejercicio si no hay palabras cargadas
    const practiceCard = document.getElementById('practice-exercise-card');
    if (practiceCard) {
        const modeText = mode === 'selection' || mode === 'writing' ? 'palabras' : ''; // Eliminar 'frases'
        const modeIcon = mode === 'selection' || mode === 'writing' ? '📝' : ''; // Eliminar '📖'
        practiceCard.innerHTML = `
            <div class="text-selector-container">
                <h3>${modeIcon} Elige un texto para practicar ${modeText}:</h3>
                <select id="selectorTextosPractica" class="text-select" onchange="window.startPracticeFromSelector()">
                    <option value="">Selecciona un texto...</option>
                </select>
                <div class="text-selector-info">
                    <p>💡 <strong>Mis textos:</strong> Textos que has subido tú</p>
                    <p>💡 <strong>Textos públicos:</strong> Textos de otros usuarios que has leído y guardado palabras</p>
                </div>
            </div>
        `;
        cargarTextosParaPractica(); // Volver a cargar las opciones
    }
}

// Cargar pregunta de práctica
window.loadPracticeQuestion = function() {
    // Ocultar header durante el ejercicio
    const header = document.querySelector('header');
    if (header) {
        header.style.display = 'none';
    }

    // Seleccionar palabra aleatoria
    const randomIndex = Math.floor(Math.random() * window.practiceRemainingWords.length);
    const currentWord = window.practiceRemainingWords[randomIndex];
    window.practiceCurrentWordIndex = randomIndex;
    
    // Para palabras: usar el contexto completo CON HUECO
    // MODO PALABRAS: mostrar contexto completo con hueco donde va la palabra
    
    // Verificar si el contexto está vacío o no contiene la palabra
    if (!currentWord.context || currentWord.context.trim() === '') {
        window.practiceCurrentSentenceData = {
            en: `The word "${currentWord.word}" is important.`,
            es: `La palabra "${currentWord.word}" es importante.`
        };
    } else {
        // Intentar crear el hueco con diferentes estrategias
        let contextWithHole = currentWord.context;
        
        // Limpiar la palabra de caracteres especiales para la búsqueda
        const cleanWord = currentWord.word.replace(/[.,!?;:]/g, '').trim();
        const originalWord = currentWord.word;
        
        // Estrategia 1: Buscar la palabra exacta (con caracteres especiales)
        const regex1 = new RegExp(`\\b${originalWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (regex1.test(currentWord.context)) {
            contextWithHole = currentWord.context.replace(regex1, '____');
        } else {
            // Estrategia 2: Buscar la palabra limpia con límites
            const regex2 = new RegExp(`\\b${cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            if (regex2.test(currentWord.context)) {
                contextWithHole = currentWord.context.replace(regex2, '____');
            } else {
                // Estrategia 3: Buscar la palabra sin límites
                const regex3 = new RegExp(originalWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                if (regex3.test(currentWord.context)) {
                    contextWithHole = currentWord.context.replace(regex3, '____');
                } else {
                    // Estrategia 4: Buscar la palabra limpia sin límites
                    const regex4 = new RegExp(cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    if (regex4.test(currentWord.context)) {
                        contextWithHole = currentWord.context.replace(regex4, '____');
                    } else {
                        // Estrategia 5: Búsqueda manual más flexible
                        const wordLower = cleanWord.toLowerCase();
                        const contextLower = currentWord.context.toLowerCase();
                        const index = contextLower.indexOf(wordLower);
                        if (index !== -1) {
                            const before = currentWord.context.substring(0, index);
                            const after = currentWord.context.substring(index + cleanWord.length);
                            contextWithHole = before + '____' + after;
                        } else {
                            contextWithHole = currentWord.context;
                        }
                    }
                }
            }
        }
        window.practiceCurrentSentenceData = {
            en: contextWithHole,
            es: '', // Dejar vacío para que se traduzca con la API
            original_en: currentWord.context, // Guardar la frase original en inglés
            translation: currentWord.translation, // Agregar la traducción de la palabra
            word: currentWord.word, // Agregar la palabra para referencia
            needsTranslation: true // Indicar que necesita traducción
        };
    }
    
    window.practiceAnswered = false;

    // Obtener el título del texto de la palabra actual
    const textTitle = currentWord.text_title || 'este texto';
    const instruction = window.practiceCurrentMode === 'selection' ? 
        `Elige la palabra correcta del texto <span class="text-title-highlight">"${textTitle}"</span>:` : 
        `Escribe la palabra correcta del texto <span class="text-title-highlight">"${textTitle}"</span>:`;
    let html = `
        <div class="practice-instruction">
            ${instruction}
        </div>
        <div class="practice-sentence" id="english-sentence-container">
            <span id="english-sentence">${makeWordsClickable(window.practiceCurrentSentenceData.en)}</span>
            <div style="display:inline-block; position:relative; vertical-align:middle;">
                <button class="speak-sentence-btn" id="speak-sentence-btn" title="Escuchar frase" style="background: none; border: none; cursor: pointer; margin-left: 8px; font-size: 1.2em; vertical-align: middle;">
                    <span role="img" aria-label="Escuchar">🔊</span>
                </button>
                <input type="range" min="0" max="2" step="1" value="1" id="speak-speed-slider" style="display:none; position:absolute; left:40px; top:50%; transform:translateY(-50%); width:70px; z-index:10; background:#eee; border-radius:6px; height:4px;">
                <div style="position:absolute; left:40px; top:28px; width:70px; display:none; z-index:11; pointer-events:none; font-size:11px; color:#888; text-align:center;" id="speak-speed-labels">
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
        <div class="spanish-translation hidden" id="spanish-translation">
        </div>
        <div class="translation-help-container" style="position:relative; display:flex; align-items:center; justify-content:flex-end; width:100%; margin:8px 0 0 0; gap:6px;">
            <button class="translation-help-btn" id="show-translation-btn" onclick="showPracticeTranslation()" style="padding:1px 12px; font-size:0.80em; min-width:0; height:22px; display:inline-flex; align-items:center; white-space:nowrap;">📖 Ver traducción</button>
        </div>
        <style>
        @media (max-width: 600px) {
            .translation-help-container { gap: 2px !important; }
            #show-translation-btn { font-size: 0.88em !important; padding: 1px 10px !important; height: 24px !important; white-space:nowrap !important; }
        }
        </style>
    `;
    
    if (window.practiceCurrentMode === 'selection') {
        // OPCIONES CON PALABRAS EN INGLÉS (como antes)
        const distractors = generatePracticeDistractors(currentWord.word);
        const allOptions = [...distractors, currentWord.word];
        
        // Mezclar opciones
        for (let i = allOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        }

        html += '<div class="practice-options">';
        allOptions.forEach(option => {
            const safeOption = option.replace(/'/g, "\\'");
            const safeCorrect = currentWord.word.replace(/'/g, "\\'");
            html += `<button class="option-btn" onclick="playClickSound(); selectPracticeOption('${safeOption}', '${safeCorrect}')">${option}</button>`;
        });
        html += '</div>';
        html += '<div class="practice-controls">';
        const safeHint = currentWord.word.replace(/'/g, "\\'");
        html += `<button class="option-btn hint-btn" onclick="showPracticeHint('${safeHint}')">💡 Pista</button>`;
        html += `<button class="option-btn next-btn" onclick="nextPracticeQuestion()" style="display:none;">Siguiente</button>`;
        html += '</div>';
    } else if (window.practiceCurrentMode === 'writing') {
        html += `
            <input type="text" placeholder="Escribe la palabra que falta..." style="width: 25%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; margin: 15px auto; box-sizing: border-box; display: block; background: white;justify-content: center;
     color: #333; outline: none;" data-practice-input="true" data-correct-word="${currentWord.word}">
            <div id="word-hint" style="display: none; font-size: 12px; color: #999; opacity: 0.6; margin-top: 5px; text-align: center; font-style: italic;"></div>
            <div class="practice-controls">
                <button class="option-btn hint-btn" onclick="showPracticeHint('${currentWord.word}')">💡 Pista</button>
                <button class="option-btn next-btn" onclick="nextPracticeQuestion()" style="display:none;">Siguiente</button>
            </div>
        `;
    }

    const practiceCard = document.getElementById('practice-exercise-card');
    if (practiceCard) {
        practiceCard.innerHTML = html;
    }
    
    setTimeout(() => {
        assignPracticeWordClickHandlers();
    }, 10);
    
    const englishSentence = document.getElementById('english-sentence');
    if (englishSentence && !englishSentence._delegated) {
        englishSentence.addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('practice-word')) {
                event.preventDefault();
                event.stopPropagation();
                const word = target.textContent.trim();
                if (!word || word === '____') return;
                fetch('translate.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'word=' + encodeURIComponent(word)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.translation) {
                        showPracticeTooltip(target, word, data.translation);
                    } else {
                        showPracticeTooltip(target, word, 'No se encontró traducción');
                    }
                })
                .catch(() => {
                    showPracticeTooltip(target, word, 'Error en la traducción');
                });
            }
        });
        englishSentence._delegated = true;
    }
    
    setTimeout(() => {
        const translationBtn = document.getElementById('show-translation-btn');
        const translationDiv = document.getElementById('spanish-translation');
        if (translationBtn && translationDiv) {
            translationBtn.textContent = '📖 Ver traducción';
            translationDiv.classList.add('hidden');
        }
    }, 10);
    
    if (window.practiceCurrentMode === 'writing') {
        const writeInput = document.querySelector('[data-practice-input="true"]');
        if (writeInput) {
            writeInput.focus();
            window.currentWordErrors = 0;
            
            const correctWord = writeInput.getAttribute('data-correct-word');
            
            writeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkPracticeWriteAnswer(correctWord);
                }
            });
            
            writeInput.addEventListener('input', function() {
                checkWordInput(correctWord);
            });
        }
    }
    
    setTimeout(() => {
        const practiceCard = document.getElementById('practice-exercise-card');
        if (practiceCard) {
            practiceCard.addEventListener('click', function(e) {
                if (!e.target.matches('button, input, .option-btn, .check-btn')) {
                    const header = document.querySelector('header');
                    if (header) {
                        header.style.display = '';
                    }
                }
            });
        }
    }, 100);

    if (!window._delegacionAltavozPractica) {
        document.addEventListener('click', async function(e) {
            if (e.target.closest && e.target.closest('#speak-sentence-btn')) {
                e.stopPropagation();
                let sentence = '';
                if (window.practiceCurrentSentenceData && window.practiceCurrentSentenceData.en) {
                    sentence = window.practiceCurrentSentenceData.en;
                }
                if (sentence) {
                    const finalSentence = sentence.replace(/____+/g, window.practiceCurrentSentenceData.word || '');
                    
                    console.log('🎤 Reproduciendo frase de práctica:', finalSentence);
                    
                    if (typeof window.getVoiceSystemReady === 'function') {
                        try {
                            await window.getVoiceSystemReady();
                            
                            if (typeof window.leerTextoConResponsiveVoice === 'function') {
                                console.log('✅ Usando ResponsiveVoice para frase de práctica');
                                const success = window.leerTextoConResponsiveVoice(finalSentence, 1.0, {
                                    onstart: () => console.log('🎤 Frase de práctica iniciada'),
                                    onend: () => console.log('✅ Frase de práctica completada'),
                                    onerror: (error) => console.error('❌ Error en frase de práctica:', error)
                                });
                                
                                if (!success) {
                                    throw new Error('ResponsiveVoice falló');
                                }
                            } else {
                                throw new Error('ResponsiveVoice no disponible');
                            }
                        } catch (error) {
                            console.log('⚠️ Fallback a sistema nativo para frase de práctica');
                            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                                window.speechSynthesis.cancel();
                            }
                            const utter = new window.SpeechSynthesisUtterance(finalSentence);
                            utter.lang = 'en-US';
                            utter.rate = 1;
                            window.speechSynthesis.speak(utter);
                        }
                    } else {
                        console.log('⚠️ Sistema unificado no disponible, usando fallback directo');
                        if (window.speechSynthesis && window.speechSynthesis.speaking) {
                            window.speechSynthesis.cancel();
                        }
                        const utter = new window.SpeechSynthesisUtterance(finalSentence);
                        utter.lang = 'en-US';
                        utter.rate = 1;
                        window.speechSynthesis.speak(utter);
                    }
                }
            }
        });
        window._delegacionAltavozPractica = true;
    }
}

window.restartPracticeExercise = function() {
    window.practiceRemainingWords = [...window.practiceWords];
    
    for (let i = window.practiceRemainingWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [window.practiceRemainingWords[i], window.practiceRemainingWords[j]] = [window.practiceRemainingWords[j], window.practiceRemainingWords[i]];
    }
    
    window.practiceCurrentQuestionIndex = 0;
    window.practiceCorrectAnswers = 0;
    window.practiceIncorrectAnswers = 0;
    window.practiceAnswered = false;
    
    updatePracticeStats();
    loadPracticeQuestion();
};

window.playClickSound = function() {
    // Sonido opcional - no es crítico
};

function normalizeWord(word) {
    return word.toLowerCase().replace(/[.,!?;:'"`~@#$%^&*()_+\-=\[\]{}|\\;:"'<>?\/]/g, '');
}

function getSmartHint(userText, correctWord) {
    let correctLength = 0;
    for (let i = 0; i < userText.length && i < correctWord.length; i++) {
        if (userText[i].toLowerCase() === correctWord[i].toLowerCase()) {
            correctLength++;
        } else {
            break;
        }
    }
    
    if (correctLength < correctWord.length) {
        return correctWord.substring(0, correctLength + 1);
    } else {
        return correctWord;
    }
}

window.checkWordInput = function(correctWord) {
    const input = document.querySelector('[data-practice-input="true"]');
    const wordHint = document.getElementById('word-hint');
    const userText = input.value;
    const correctText = correctWord;
    
    const normalizedUserText = normalizeWord(userText);
    const normalizedCorrectText = normalizeWord(correctText);
    
    for (let i = 0; i < normalizedUserText.length; i++) {
        if (i >= normalizedCorrectText.length || 
            normalizedUserText[i].toLowerCase() !== normalizedCorrectText[i].toLowerCase()) {
            
            setTimeout(() => {
                const correctPart = userText.substring(0, i);
                input.value = correctPart;
                if (wordHint) {
                    wordHint.textContent = correctText;
                    wordHint.style.display = 'block';
                }
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            }, 100);
            playErrorSound();
            window.currentWordErrors++;
            
            if (window.currentWordErrors >= 2) {
                setTimeout(() => {
                    const smartHint = getSmartHint(input.value, correctText);
                    input.value = smartHint;
                    window.currentWordErrors = 0;
                    if (wordHint) {
                        wordHint.style.display = 'none';
                    }
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                }, 150);
            }
            return;
        }
    }
    if (normalizedUserText === normalizedCorrectText.substring(0, normalizedUserText.length)) {
        if (wordHint) {
            wordHint.style.display = 'none';
        }
        if (normalizedUserText === normalizedCorrectText) {
            if (!input.classList.contains('sentence-input') && !input.disabled) {
                input.disabled = true;
                showWordSuccessFeedback(input);

                const translationBtn = document.getElementById('show-translation-btn');
                const translationDiv = document.getElementById('spanish-translation');
                if (typeof showTranslationAfterAnswer === 'function') {
                    showTranslationAfterAnswer();
                } else if (translationDiv) {
                    translationDiv.classList.remove('hidden');
                }
                if (translationBtn) translationBtn.style.display = 'none';
            }
        }
    }
};

function showWordSuccessFeedback(inputElement) {
    const currentWord = window.practiceRemainingWords[window.practiceCurrentWordIndex];
    
    window.practiceCorrectAnswers++;
    window.practiceRemainingWords.splice(window.practiceCurrentWordIndex, 1);
    
    const successDiv = document.createElement('div');
    const rect = inputElement.getBoundingClientRect();
    
    successDiv.style.cssText = `
        position: fixed;
        top: ${rect.top - 60}px;
        left: ${rect.left + (rect.width / 2)}px;
        transform: translateX(-50%);
        background: #22c55e;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: fadeInUp 0.3s ease;
    `;
    
    successDiv.textContent = '¡Correcto!';
    
    document.body.appendChild(successDiv);
    
    playSuccessSound();
    
    const englishSentence = document.getElementById('english-sentence');
    if (englishSentence && window.practiceCurrentSentenceData) {
        const sentenceWithWord = window.practiceCurrentSentenceData.en.replace(
            /____+/g, currentWord.word
        );
        renderPracticeSentence(sentenceWithWord, currentWord.word);
    }
    
    inputElement.style.display = 'none';
    const hintBtn = document.querySelector('.practice-controls .hint-btn');
    if (hintBtn) hintBtn.style.display = 'none';
    
    const nextButton = document.querySelector('.practice-controls .next-btn');
    if (nextButton) nextButton.style.display = 'inline-flex';
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            document.body.removeChild(successDiv);
        }
        showSimplifiedTranslation(currentWord);
    }, 2000);
    
    updatePracticeStats();
    if (typeof assignPracticeWordClickHandlers === 'function') {
        setTimeout(assignPracticeWordClickHandlers, 0);
    }
}

function generatePracticeSentence(word) {
    const practiceWord = window.practiceWords.find(w => w.word === word);
    if (!practiceWord) {
        return { en: `The word "${word}" is important.`, es: `La palabra "${word}" es importante.` };
    }
    const translation = practiceWord.translation;
    const context = practiceWord.context;
    if (context && context.trim().length > 0 && context !== `The ${word} is important.`) {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundary = /^[a-zA-Z0-9]+$/.test(word) ? '\\b' : '';
        const sentenceWithGap = context.replace(new RegExp(`${wordBoundary}${escapedWord}${wordBoundary}`, 'gi'), '____'); // Usar '____'
        
        const result = {
            en: sentenceWithGap,
            es: '',
            original_en: context,
            word: word,
            translation: translation,
            needsTranslation: true
        };
        return result;
    }
    const templates = [
        {
            en: `I can see the ${word} from here.`,
            es: `Puedo ver ${translation} desde aquí.`
        },
        {
            en: `The ${word} is very important today.`,
            es: `${translation} es muy importante hoy.`
        },
        {
            en: `This ${word} helps me learn English.`,
            es: `Este ${translation} me ayuda a aprender inglés.`
        }
    ];
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    const result = {
        en: selectedTemplate.en.replace(word, '____'), // Usar '____'
        es: selectedTemplate.es,
        original_en: selectedTemplate.en,
        word: word,
        translation: translation
    };
    return result;
}

function makeWordsClickable(text, highlightWord = null) {
    const words = text.match(/\w+|[.,!?;:()"'-]+|\s+/g);
    let result = '';
    if (!words) return text; // Manejar caso de texto vacío o sin palabras
    words.forEach(word => {
        if (word.trim() === '') {
            result += word;
        } else if (word === '____') { // Usar '____' para el hueco
            result += '<span class="practice-gap">____</span>';
        } else if (highlightWord && word.replace(/[.,]/g, '').toLowerCase() === highlightWord.toLowerCase()) {
            result += `<span class="practice-word highlighted-word">${word}</span>`;
        } else if (/^\w+$/.test(word)) {
            result += `<span class="practice-word">${word}</span>`;
        } else {
            result += word;
        }
    });
    return result;
}

window.handlePracticeWordClickInline = function(event, el) {
    event.preventDefault();
    event.stopPropagation();
    var word = el.textContent.trim();
    if (!word || word === '____') return; // Usar '____' para el hueco
    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'word=' + encodeURIComponent(word)
    })
    .then(res => res.json())
    .then(data => {
        if (data.translation) {
            showPracticeTooltip(el, word, data.translation);
        } else {
            showPracticeTooltip(el, word, 'No se encontró traducción');
        }
    })
    .catch(() => {
        showPracticeTooltip(el, word, 'Error en la traducción');
    });
}

function translatePracticeSentence(originalSentence, wordTranslation) {
    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'sentence=' + encodeURIComponent(originalSentence) + '&word=' + encodeURIComponent(wordTranslation)
    })
    .then(res => res.json())
    .then(data => {
        const translationElement = document.getElementById('spanish-translation');
        if (data.translation && data.translation !== originalSentence) {
            let translatedSentence = data.translation;
            let highlightedTranslation = translatedSentence;
            let root = wordTranslation.slice(0, Math.max(3, wordTranslation.length - 2));
            if (root.length >= 3) {
                const regex = new RegExp(root + '\\w*', 'gi');
                highlightedTranslation = highlightedTranslation.replace(regex, match =>
                    (match && match.length > 0) ? `<span class="highlighted-word">${match}</span>` : match
                );
            } else {
                highlightedTranslation = highlightedTranslation.replace(
                    new RegExp(`\\b${wordTranslation}\\b`, 'gi'),
                    `<span class=\"highlighted-word\">${wordTranslation}</span>`
                );
            }
            if (!highlightedTranslation.includes('highlighted-word')) {
                highlightedTranslation += ` <span class=\"highlighted-word\">(${wordTranslation})</span>`;
            }
            if (translationElement) {
                translationElement.innerHTML = highlightedTranslation;
                translationElement.classList.remove('hidden');
            }
        } else {
            if (translationElement) {
                translationElement.innerHTML = `<span style=\"color: #dc2626;\">No se pudo traducir la frase. Palabra: <span class=\"highlighted-word\">${wordTranslation}</span></span>`;
                translationElement.classList.remove('hidden');
            }
        }
    })
    .catch((error) => {
        const translationElement = document.getElementById('spanish-translation');
        if (translationElement) {
            translationElement.innerHTML = '';
        }
    });
}

function generatePracticeDistractors(correctWord) {
    const allWords = window.practiceWords.filter(w => w.word !== correctWord).map(w => w.word);
    const commonWords = ['house', 'book', 'time', 'water', 'good', 'work', 'think', 'know', 'want', 'say'];
    
    let distractors = [];
    
    const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, shuffledWords.length); i++) {
        distractors.push(shuffledWords[i]);
    }
    
    while (distractors.length < 3) {
        const commonWord = commonWords[Math.floor(Math.random() * commonWords.length)];
        if (!distractors.includes(commonWord) && commonWord !== correctWord) {
            distractors.push(commonWord);
        }
    }
    
    return distractors;
}

function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.35);
        gainNode.connect(audioContext.destination);

        const osc1 = audioContext.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, now);
        osc1.connect(gainNode);
        osc1.start(now);
        osc1.stop(now + 0.18);

        const osc2 = audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(140, now + 0.18);
        osc2.connect(gainNode);
        osc2.start(now + 0.18);
        osc2.stop(now + 0.35);
    } catch (error) {
        console.error("Error playing success sound:", error);
    }
}

function playErrorSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.error("Error playing error sound:", error);
    }
}

window.selectPracticeOption = function(selected, correct) {
    if (window.practiceAnswered) {
        return;
    }
    window.practiceAnswered = true;
    const buttons = document.querySelectorAll('.option-btn');
    let selectedButton = null;

    const normalizedSelected = normalizeWord(selected);
    const normalizedCorrect = normalizeWord(correct);

    buttons.forEach(btn => {
        btn.onclick = null;
        const btnNormalized = normalizeWord(btn.textContent);
        if (btnNormalized === normalizedCorrect) {
            btn.classList.add('correct');
        } else if (btnNormalized === normalizedSelected && normalizedSelected !== normalizedCorrect) {
            btn.classList.add('incorrect');
        }
        if (btnNormalized === normalizedSelected) {
            selectedButton = btn;
        }
    });

    const hintButton = document.querySelector('.practice-controls .hint-btn');
    const nextButton = document.querySelector('.practice-controls .next-btn');
    if (hintButton) hintButton.style.display = 'none';
    if (nextButton) {
        nextButton.style.display = 'inline-flex';
        nextButton.onclick = function() {
            nextPracticeQuestion();
        };
    }

    const isCorrect = normalizedSelected === normalizedCorrect;

    const englishSentence = document.getElementById('english-sentence');
    if (englishSentence && window.practiceCurrentSentenceData) {
        let sentenceWithWord = window.practiceCurrentSentenceData.original_en || window.practiceCurrentSentenceData.en;
        sentenceWithWord = sentenceWithWord.replace(/____+/g, correct);
        englishSentence.innerHTML = makeWordsClickable(sentenceWithWord, correct);
        setTimeout(() => {
            assignPracticeWordClickHandlers();
            const speakBtn = document.getElementById('speak-sentence-btn');
            if (speakBtn) {
                speakBtn.onclick = function(e) {
                    e.stopPropagation();
                    let sentence = '';
                    if (window.practiceAnswered && window.practiceCurrentSentenceData.original_en) {
                        sentence = window.practiceCurrentSentenceData.original_en;
                    } else {
                        sentence = window.practiceCurrentSentenceData.en || '';
                    }
                    if (sentence) {
                        if (window.speechSynthesis && window.speechSynthesis.speaking) {
                            window.speechSynthesis.cancel();
                        }
                        const utter = new window.SpeechSynthesisUtterance(sentence.replace(/____+/g, window.practiceCurrentSentenceData.word || ''));
                        utter.lang = 'en-US';
                        utter.rate = 1;
                        window.speechSynthesis.speak(utter);
                    }
                };
            }
        }, 10);
    }

    setTimeout(() => {
        showTranslationAfterAnswer();
    }, 500);

    showQuickFeedback(selectedButton, isCorrect, correct);
}

window.checkPracticeWriteAnswer = function(correct) {
    const inputElement = document.querySelector('[data-practice-input="true"]');
    const userAnswer = inputElement.value;
    
    const normalizedUserAnswer = normalizeWord(userAnswer);
    const normalizedCorrect = normalizeWord(correct);
    const isCorrect = normalizedUserAnswer === normalizedCorrect;
    
    window.practiceAnswered = true;
    inputElement.disabled = true;
    
    const englishSentence = document.getElementById('english-sentence');
    if (englishSentence && window.practiceCurrentSentenceData) {
        let sentenceWithAnswer = window.practiceCurrentSentenceData.original_en;
        sentenceWithAnswer = sentenceWithAnswer.replace(/____+/g, correct);
        englishSentence.innerHTML = makeWordsClickable(sentenceWithAnswer, correct);
        setTimeout(() => {
            assignPracticeWordClickHandlers();
            const speakBtn = document.getElementById('speak-sentence-btn');
            if (speakBtn) {
                speakBtn.onclick = function(e) {
                    e.stopPropagation();
                    let sentence = '';
                    if (window.practiceAnswered && window.practiceCurrentSentenceData.original_en) {
                        sentence = window.practiceCurrentSentenceData.original_en;
                    } else {
                        sentence = window.practiceCurrentSentenceData.en || '';
                    }
                    if (sentence) {
                        if (window.speechSynthesis && window.speechSynthesis.speaking) {
                            window.speechSynthesis.cancel();
                        }
                        const utter = new window.SpeechSynthesisUtterance(sentence.replace(/____+/g, window.practiceCurrentSentenceData.word || ''));
                        utter.lang = 'en-US';
                        utter.rate = 1;
                        window.speechSynthesis.speak(utter);
                    }
                };
            }
        }, 10);
    }
    
    const hintButton = document.querySelector('.practice-controls .hint-btn');
    const nextButton = document.querySelector('.practice-controls .next-btn');
    
    if (hintButton) hintButton.style.display = 'none';
    if (nextButton) nextButton.style.display = 'inline-flex';

    const showBtn = document.getElementById('show-translation-btn');
    const translationDiv = document.getElementById('spanish-translation');
    if (showBtn) showBtn.style.display = 'none';
    if (translationDiv) translationDiv.classList.remove('hidden');
    
    setTimeout(() => {
        showTranslationAfterAnswer();
    }, 500);
    
    showQuickFeedback(inputElement, isCorrect, correct);
    if (typeof assignPracticeWordClickHandlers === 'function') {
        setTimeout(assignPracticeWordClickHandlers, 0);
    }
}

window.showPracticeTranslation = function() {
    const translationBtn = document.getElementById('show-translation-btn');
    const translationDiv = document.getElementById('spanish-translation');
    if (!translationBtn || !translationDiv) return;
    if (!translationDiv.innerHTML.trim() && window.practiceCurrentSentenceData) {
        const wordTranslation = window.practiceCurrentSentenceData.translation;
        const currentWord = window.practiceCurrentSentenceData.word;
        if (window.practiceCurrentSentenceData.needsTranslation) {
            translatePracticeSentence(
                window.practiceCurrentSentenceData.original_en, 
                wordTranslation
            );
        } else if (window.practiceCurrentSentenceData.es) {
            const translation = window.practiceCurrentSentenceData.es;
            const escapedWordTranslation = wordTranslation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let highlightedTranslation = translation.replace(
                new RegExp(`\\b${escapedWordTranslation}\\b`, 'gi'),
                `<span class=\"highlighted-word\">${wordTranslation}</span>`
            );
            if (!highlightedTranslation.includes('highlighted-word')) {
                highlightedTranslation += ` <span class=\"highlighted-word\">(${wordTranslation})</span>`;
            }
            if (translationElement) {
                translationElement.innerHTML = highlightedTranslation;
                translationElement.classList.remove('hidden');
            }
        } else {
            const originalContext = window.practiceRemainingWords[window.practiceCurrentWordIndex].context;
            const sentenceToTranslate = originalContext || window.practiceCurrentSentenceData.en.replace(/____+/g, currentWord);
            translatePracticeSentence(
                sentenceToTranslate,
                wordTranslation
            );
        }
    }
    translationDiv.classList.remove('hidden');
    translationBtn.style.display = 'none';
};

function showTranslationAfterAnswer() {
    const translationDiv = document.getElementById('spanish-translation');
    if (!translationDiv) {
        return;
    }
    const showBtn = document.getElementById('show-translation-btn');
    if (showBtn) {
        showBtn.style.display = 'none';
    }
    translationDiv.classList.remove('hidden');
    if (window.practiceCurrentSentenceData) {
        const wordTranslation = window.practiceCurrentSentenceData.translation;
        const currentWord = window.practiceCurrentSentenceData.word;
        if (window.practiceCurrentSentenceData.needsTranslation) {
            translatePracticeSentence(
                window.practiceCurrentSentenceData.original_en, 
                wordTranslation
            );
        } else if (window.practiceCurrentSentenceData.es) {
            const translation = window.practiceCurrentSentenceData.es;
            const escapedWordTranslation = wordTranslation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let highlightedTranslation = translation.replace(
                new RegExp(`\\b${escapedWordTranslation}\\b`, 'gi'),
                `<span class=\"highlighted-word\">${wordTranslation}</span>`
            );
            if (!highlightedTranslation.includes('highlighted-word')) {
                highlightedTranslation += ` <span class=\"highlighted-word\">(${wordTranslation})</span>`;
            }
            if (translationElement) {
                translationElement.innerHTML = highlightedTranslation;
                translationElement.classList.remove('hidden');
            }
        } else {
            const originalContext = window.practiceRemainingWords[window.practiceCurrentWordIndex].context;
            const sentenceToTranslate = originalContext || window.practiceCurrentSentenceData.en.replace(/____+/g, currentWord);
            translatePracticeSentence(
                sentenceToTranslate,
                wordTranslation
            );
        }
    }
}

function showQuickFeedback(buttonElement, isCorrect, correctWord) {
    const currentWord = window.practiceRemainingWords[window.practiceCurrentWordIndex];
    if (isCorrect) {
        window.practiceCorrectAnswers++;
        window.practiceRemainingWords.splice(window.practiceCurrentWordIndex, 1);
    } else {
        window.practiceIncorrectAnswers++;
        const wordToRepeat = window.practiceRemainingWords.splice(window.practiceCurrentWordIndex, 1)[0];
        window.practiceRemainingWords.push(wordToRepeat);
    }
    
    if (isCorrect) {
        playSuccessSound();
    } else {
        playErrorSound();
    }
    
    let feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'practice-feedback-toast ' + (isCorrect ? 'success' : 'error');
    feedbackDiv.textContent = isCorrect ? '¡Correcto!' : `Incorrecto.Correcto:  ${correctWord}`;
    feedbackDiv.style.position = 'absolute';
    feedbackDiv.style.zIndex = '9999';
    feedbackDiv.style.padding = '6px 10px';
    feedbackDiv.style.borderRadius = '6px';
    feedbackDiv.style.fontWeight = 'bold';
    feedbackDiv.style.fontSize = '15px';
    feedbackDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    feedbackDiv.style.color = '#fff';
    feedbackDiv.style.background = isCorrect ? '#22c55e' : '#ef4444';
    feedbackDiv.style.opacity = '0.87';
    feedbackDiv.style.pointerEvents = 'none';

    if (buttonElement && buttonElement.getBoundingClientRect) {
        const rect = buttonElement.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        feedbackDiv.style.left = (rect.left + rect.width/2 + scrollLeft) + 'px';
        feedbackDiv.style.top = (rect.top + scrollTop - 8) + 'px';
        feedbackDiv.style.transform = 'translate(-50%, -100%)';
        document.body.appendChild(feedbackDiv);
    } else {
        feedbackDiv.style.position = 'fixed';
        feedbackDiv.style.top = '30px';
        feedbackDiv.style.left = '50%';
        feedbackDiv.style.transform = 'translateX(-50%)';
        document.body.appendChild(feedbackDiv);
    }
    setTimeout(() => feedbackDiv.remove(), 1500);

    showSimplifiedTranslation(currentWord);
    updatePracticeStats();
    if (window.practiceRemainingWords.length === 0) {
        showPracticeResults();
        return;
    }
}

function showSimplifiedTranslation(currentWord) {
    const spanishSentence = window.practiceCurrentSentenceData.es;
    
    const practiceCard = document.getElementById('practice-exercise-card');
    const existingTranslation = practiceCard.querySelector('.simplified-translation');
    
    if (existingTranslation) return;
    
    const simplifiedFeedback = spanishSentence ? `
        <div class="simplified-translation" style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; text-align: center;">
            <div style="font-size: 16px; line-height: 1.5; margin-bottom: 15px;">${spanishSentence}</div>
        </div>
    ` : '';
    
    if (simplifiedFeedback) {
        practiceCard.insertAdjacentHTML('beforeend', simplifiedFeedback);
    }
    
    document.addEventListener('keydown', function practiceEnterHandler(e) {
        if (e.key === 'Enter') {
            nextPracticeQuestion();
            document.removeEventListener('keydown', practiceEnterHandler);
        }
    });
}

window.nextPracticeQuestion = function() {
    window.practiceCurrentQuestionIndex++;
    if (window.practiceRemainingWords.length === 0) {
        showPracticeResults();
        return;
    }
    loadPracticeQuestion();
}

function updatePracticeStats() {
    const totalPalabras = window.practiceWords.length;
    const completadas = window.practiceCorrectAnswers;
    document.getElementById('practice-current-question').textContent = completadas;
    document.getElementById('practice-correct-count').textContent = window.practiceCorrectAnswers;
    document.getElementById('practice-incorrect-count').textContent = window.practiceIncorrectAnswers;
    document.getElementById('practice-total-questions').textContent = totalPalabras;
    const progreso = (completadas / totalPalabras) * 100;
    document.getElementById('practice-progress-bar').style.width = progreso + '%';
}

function showPracticeResults() {
    window.practiceResultsActive = true;
    const header = document.querySelector('header');
    if (header) {
        header.style.display = '';
    }
    // Guardar progreso al completar
   
    if (typeof playSuccessSound === 'function') {
        playSuccessSound();
    }
    const resultHtml = `
        <div class="practice-results">
            <h3>🎉 ¡Ejercicio completado!</h3>
            <div class="practice-score">
                ${window.practiceCorrectAnswers} palabras aprendidas
            </div>
            <p>¡Excelente trabajo! Has completado todas las palabras correctamente.</p>
            <div style="margin-top: 30px;">
                <button class="next-btn" id="practice-next-btn" onclick="window.location.href='index.php?tab=practice'" style="margin-right: 15px;">Seguir practicando</button>
                <a href="index.php?tab=progress" class="nav-btn" style="margin-right: 15px;">Ir a mi progreso</a>
                <a href="index.php?tab=my-texts" class="nav-btn">Ver mis textos</a>
            </div>
        </div>
    `;
    document.getElementById('practice-exercise-card').innerHTML = resultHtml;

    function nextOnEnter(e) {
        if (window.practiceResultsActive && e.key === 'Enter') {
            window.removeEventListener('keydown', nextOnEnter);
            window.practiceResultsActive = false;
            const nextBtn = document.getElementById('practice-next-btn');
            if (nextBtn) nextBtn.click();
        }
    }
    window.addEventListener('keydown', nextOnEnter);
    const nextBtn = document.getElementById('practice-next-btn');
    if (nextBtn) {
        nextBtn.onclick = function() {
            window.removeEventListener('keydown', nextOnEnter);
            window.practiceResultsActive = false;
            window.location.href = 'index.php?tab=practice';
        };
    }
}

window.restartPracticeExercise = function() {
    window.practiceRemainingWords = [...window.practiceWords];
    
    for (let i = window.practiceRemainingWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [window.practiceRemainingWords[i], window.practiceRemainingWords[j]] = [window.practiceRemainingWords[j], window.practiceRemainingWords[i]];
    }
    
    window.practiceCurrentQuestionIndex = 0;
    window.practiceCorrectAnswers = 0;
    window.practiceIncorrectAnswers = 0;
    window.practiceAnswered = false;
    
    updatePracticeStats();
    loadPracticeQuestion();
}

window.showPracticeHint = function(word) {
    const practiceWord = window.practiceWords.find(w => w.word === word);
    if (practiceWord) {
        const writeInput = document.querySelector('[data-practice-input="true"]');
        
        const hint = word.substring(0, 2);
        
        const englishSentence = document.getElementById('english-sentence');
        if (englishSentence && window.practiceCurrentSentenceData) {
            const sentenceWithHint = window.practiceCurrentSentenceData.en.replace(
                /____+/g, 
                `<span class="highlighted-word" style="font-size: 1.2em; background: #ff6f0074; padding: 4px 8px; border-radius: 3px; animation: pulse 2s infinite;">${hint}...</span>`
            );
            englishSentence.innerHTML = sentenceWithHint;
            
            setTimeout(() => {
                if (englishSentence && window.practiceCurrentSentenceData) {
                    englishSentence.innerHTML = window.practiceCurrentSentenceData.en;
                }
            }, 3000);
        }
        
        const hintElement = document.querySelector('.practice-controls .hint-btn');
        if (hintElement) {
            hintElement.innerHTML = `💡 Pista: ${hint}...`;
            hintElement.style.background = '#ff6f0074';
            hintElement.style.color = '#92400e';
            hintElement.style.fontWeight = 'bold';
            
            setTimeout(() => {
                hintElement.innerHTML = `💡 Pista`;
                hintElement.style.background = '';
                hintElement.style.color = '';
                hintElement.style.fontWeight = '';
            }, 3000);
        }
    }
}

// ============================================

// Función para compatibilidad con el HTML (onchange="startSentencePractice()")
window.startSentencePractice = function() {
    window.startPracticeFromSelector();
}

// Función auxiliar para iniciar la práctica desde el selector de textos
window.startPracticeFromSelector = async function() {
    const textSelector = document.getElementById('selectorTextosPractica');
    const textId = textSelector ? textSelector.value : null;
    if (!textId) {
        alert('Por favor selecciona un texto');
        return;
    }
    const isWordMode = window.practiceCurrentMode === 'selection' || window.practiceCurrentMode === 'writing';
    if (isWordMode) {
        const textTitle = textSelector.options[textSelector.selectedIndex].text;

        document.getElementById('practice-exercise-card').innerHTML = `
            <div class="loading-container">
                <h3>⚡ Preparando ejercicio</h3>
                <p>Cargando palabras del texto "${textTitle}"<span class="loading-spinner"></span></p>
            </div>
        `;
        try {
            const response = await fetch(`practica/ajax_saved_words_content.php?get_words_by_text=1&text_id=${textId}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success && data.words && data.words.length > 0) {
                const palabrasConTitulo = data.words.map(palabra => ({
                    ...palabra,
                    text_title: textTitle
                }));
                
                initializePractice(palabrasConTitulo); // Usar la función de inicialización unificada
            } else {
                document.getElementById('practice-exercise-card').innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <h3 style="color: #6b7280;">No hay palabras guardadas</h3>
                        <p style="color: #9ca3af;">No has guardado palabras del texto "${textTitle}" aún.</p>
                        <p style="color: #9ca3af; font-size: 0.9em; margin-top: 10px;">Lee el texto y guarda algunas palabras para practicar.</p>
                        <button onclick="window.setPracticeMode('selection')" class="option-btn">Elegir otro texto</button>
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('practice-exercise-card').innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3 style="color: #dc2626;">Error de conexión</h3>
                    <p>No se pudieron cargar las palabras del texto.</p>
                    <button onclick="window.setPracticeMode('selection')" class="option-btn">Intentar de nuevo</button>
                </div>
            `;
        }
        return;
    }
}

// Exportar función para cargar desde index.php
window.loadPracticeMode = loadPracticeMode;

// ============================================
// FUNCIONALIDAD DE TRADUCCIÓN EN PRÁCTICA
// ============================================

// Función para manejar clics en palabras de práctica
function handlePracticeWordClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const word = this.textContent.trim();
    if (!word || word === '____') return;

    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'word=' + encodeURIComponent(word)
    })
    .then(res => res.json())
    .then(data => {
        if (data.translation) {
            showPracticeTooltip(this, word, data.translation);
        } else {
            showPracticeTooltip(this, word, 'No se encontró traducción');
        }
    })
    .catch(() => {
        showPracticeTooltip(this, word, 'Error en la traducción');
    });
}
window.handlePracticeWordClick = handlePracticeWordClick;

// Función para mostrar tooltip en práctica (modo normal)
function showPracticeTooltip(element, word, translation) {
    const existing = document.querySelector('.practice-tooltip');
    if (existing) existing.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'practice-tooltip';
    tooltip.innerHTML = `<strong>${word}</strong> → ${translation}`;
    
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.92);
        color: white;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 15px;
        z-index: 999999;
        pointer-events: none;
        font-family: inherit;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 320px;
        word-wrap: break-word;
        transition: opacity 0.2s;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar justo debajo y centrado respecto a la palabra
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    tooltip.style.top = (rect.bottom + 6 + scrollY) + 'px';
    tooltip.style.left = (rect.left + rect.width/2 - tooltipRect.width/2 + scrollX) + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip && tooltip.remove(), 200);
    }, 3000); // 3 segundos
}

// Función para mostrar tooltip en práctica (modo writing)
function showPracticeTooltipWriting(element, word, translation) {
    const existing = document.querySelector('.practice-tooltip-writing');
    if (existing) existing.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'practice-tooltip-writing';
    tooltip.innerHTML = `<strong>${word}</strong> → ${translation}`;
    
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.92);
        color: white;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 15px;
        z-index: 999999;
        pointer-events: none;
        font-family: inherit;
        box-shadow: 0 44px 12px rgba(0,0,0,0.3);
        max-width: 320px;
        word-wrap: break-word;
        transition: opacity 0.2s;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar justo debajo y centrado respecto a la palabra
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    tooltip.style.top = (rect.bottom + 6 + scrollY) + 'px';
    tooltip.style.left = (rect.left + rect.width/2 - tooltipRect.width/2 + scrollX) + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip && tooltip.remove(), 200);
    }, 3000); // 3 segundos
}

// Función para asignar event listeners a palabras de práctica
function assignPracticeWordClickHandlers() {
    const spans = document.querySelectorAll('.practice-word');
    spans.forEach(span => {
        span.removeEventListener('click', handlePracticeWordClick);
        span.addEventListener('click', handlePracticeWordClick);
    });
}

// Hacer función global
window.assignPracticeWordClickHandlers = assignPracticeWordClickHandlers;

// --- SONIDO DE NOTIFICACIÓN ---
function playCompletionSound() {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae6c2.mp3'); // Sonido libre
    audio.play();
}

// --- GUARDAR PROGRESO DE PRÁCTICA --

function renderPracticeSentence(sentence, highlightWord) {
    
    const englishSentence = document.getElementById('english-sentence');
    englishSentence.innerHTML = '';
    const words = sentence.split(/(\s+)/);

    
    words.forEach(word => {
        if (word.trim() === '') {
            englishSentence.appendChild(document.createTextNode(word));
        } else {
            const span = document.createElement('span');
            span.className = 'practice-word' + (highlightWord && normalizeWord(word) === normalizeWord(highlightWord) ? ' highlighted-word' : '');
            span.textContent = word;
            // ASIGNAR LISTENER DIRECTAMENTE A CADA SPAN
            span.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                const word = this.textContent.trim();
                if (!word || word === '____') return;
                fetch('translate.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'word=' + encodeURIComponent(word)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.translation) {
                        showPracticeTooltip(this, word, data.translation);
                    } else {
                        showPracticeTooltip(this, word, 'No se encontró traducción');
                    }
                })
                .catch(() => {
                    showPracticeTooltip(this, word, 'Error en la traducción');
                });
            });
            englishSentence.appendChild(span);
        }
    });
    

}
