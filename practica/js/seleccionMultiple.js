// ============================================
// SELECCIÓN MÚLTIPLE - PRÁCTICA DE VOCABULARIO
// ============================================

// Variables globales
window.palabras = [];
window.palabrasRestantes = [];
window.indicePreguntaActual = 0;
window.respuestasCorrectas = 0;
window.respuestasIncorrectas = 0;
window.respondida = false;
window.indiceActual = 0;
window.datoPreguntaActual = {};
window.mostrarTraduccionSiempre = false;
window.resultadosActivo = false;

// Inicializar selección múltiple
window.iniciar = function(palabras) {
    window.palabras = [...palabras];
    window.palabrasRestantes = [...palabras];
    window.indicePreguntaActual = 0;
    window.respuestasCorrectas = 0;
    window.respuestasIncorrectas = 0;
    window.respondida = false;
    
    window.actualizarEstadisticas();
    window.cargarPregunta();
    window.tiempoInicio = Date.now();
    window.tiempoFin = null;
    window.duracion = null;
}

// Cargar pregunta de selección múltiple
window.cargarPregunta = function() {
    const header = document.querySelector('header');
    if (header) {
        header.style.display = 'none';
    }

    // Seleccionar palabra aleatoria
    const indiceAleatorio = Math.floor(Math.random() * window.palabrasRestantes.length);
    const palabraActual = window.palabrasRestantes[indiceAleatorio];
    window.indiceActual = indiceAleatorio;
    
    // Crear contexto con hueco
    let contextoConHueco = palabraActual.context;
    
    if (!palabraActual.context || palabraActual.context.trim() === '') {
        window.datoPreguntaActual = {
            en: `The word "${palabraActual.word}" is important.`,
            es: `La palabra "${palabraActual.word}" es importante.`
        };
    } else {
        const palabraLimpia = palabraActual.word.replace(/[.,!?;:]/g, '').trim();
        const palabraOriginal = palabraActual.word;
        
        // Buscar palabra en contexto
        const regex1 = new RegExp(`\\b${palabraOriginal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (regex1.test(palabraActual.context)) {
            contextoConHueco = palabraActual.context.replace(regex1, '____');
        } else {
            const regex2 = new RegExp(`\\b${palabraLimpia.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            if (regex2.test(palabraActual.context)) {
                contextoConHueco = palabraActual.context.replace(regex2, '____');
            } else {
                const regex3 = new RegExp(palabraOriginal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                if (regex3.test(palabraActual.context)) {
                    contextoConHueco = palabraActual.context.replace(regex3, '____');
                } else {
                    const palabraMinuscula = palabraLimpia.toLowerCase();
                    const contextoMinuscula = palabraActual.context.toLowerCase();
                    const pos = contextoMinuscula.indexOf(palabraMinuscula);
                    if (pos !== -1) {
                        const antes = palabraActual.context.substring(0, pos);
                        const despues = palabraActual.context.substring(pos + palabraLimpia.length);
                        contextoConHueco = antes + '____' + despues;
                    }
                }
            }
        }
        
        window.datoPreguntaActual = {
            en: contextoConHueco,
            es: '',
            original_en: palabraActual.context,
            traduccion: palabraActual.translation,
            palabra: palabraActual.word,
            necesitaTraduccion: true
        };
    }
    
    window.respondida = false;

    const textoTitulo = palabraActual.text_title || 'este texto';
    const instruccion = `Elige la palabra correcta del texto <span class="text-title-highlight">"${textoTitulo}"</span>:`;
    
    let html = `
        <div class="practice-instruction">
            ${instruccion}
        </div>
        <div class="practice-sentence" id="english-sentence-container">
            <span id="english-sentence">${window.hacerPalabrasClickeables(window.datoPreguntaActual.en)}</span>
            <div style="display:inline-block; position:relative; vertical-align:middle;">
                <button class="speak-sentence-btn" id="speak-sentence-btn" title="Escuchar frase" style="background: none; border: none; cursor: pointer; margin-left: 8px; font-size: 1.2em; vertical-align: middle;">
                    <span role="img" aria-label="Escuchar">🔊</span>
                </button>
            </div>
        </div>
        <div class="spanish-translation hidden" id="spanish-translation"></div>
        <div class="translation-help-container" style="position:relative; display:flex; align-items:center; justify-content:flex-end; width:100%; margin:8px 0 0 0; gap:6px;">
            <button class="translation-help-btn" id="show-translation-btn" onclick="window.mostrarTraduccion()" style="padding:1px 12px; font-size:0.80em; min-width:0; height:22px; display:inline-flex; align-items:center; white-space:nowrap;">📖 Ver traducción</button>
            <div style="position:relative; display:inline-flex; align-items:center;">
                <span id="always-visible-eye" style="font-size:1.25em; color:#2563eb; cursor:pointer; padding:2px 6px; border-radius:4px; transition:background 0.15s;" onmouseenter="(function(){var t=document.getElementById('always-visible-tooltip'); if(window.mostrarTraduccionSiempre){t.textContent='Ocultar';}else{t.textContent='Dejar visible';} t.style.display='block';})()" onmouseleave="document.getElementById('always-visible-tooltip').style.display='none'">👁️</span>
                <span id="always-visible-tooltip" style="display:none; position:absolute;  top:100%; transform:translateX(-50%); background:#222; color:#fff; padding:4px 10px; border-radius:6px; font-size:0.92em; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.13); z-index:30; opacity:0.93; max-width:180px; word-break:break-word; text-align:center;">Dejar visible</span>
            </div>
        </div>
    `;
    
    // Generar opciones
    const distraccion = window.generarDistraccion(palabraActual.word);
    const opciones = [...distraccion, palabraActual.word];
    
    // Mezclar opciones
    for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }

    html += '<div class="practice-options">';
    opciones.forEach(opcion => {
        const opcionSegura = opcion.replace(/'/g, "\\'");
        const correctaSegura = palabraActual.word.replace(/'/g, "\\'");
        html += `<button class="option-btn" onclick="window.reproducirSonido(); window.seleccionar('${opcionSegura}', '${correctaSegura}')">${opcion}</button>`;
    });
    html += '</div>';
    
    html += '<div class="practice-controls">';
    const pistaSegura = palabraActual.word.replace(/'/g, "\\'");
    html += `<button class="option-btn hint-btn" onclick="window.mostrarPista('${pistaSegura}')">💡 Pista</button>`;
    html += `<button class="option-btn next-btn" onclick="window.siguientePregunta()" style="display:none;">Siguiente</button>`;
    html += '</div>';

    const tarjeta = document.getElementById('practice-exercise-card');
    if (tarjeta) {
        tarjeta.innerHTML = html;
    }
    
    setTimeout(() => {
        window.asignarManejadoresClickPalabras();
    }, 10);
    
    // Resetear botón de traducción
    setTimeout(() => {
        const btnTraduccion = document.getElementById('show-translation-btn');
        const divTraduccion = document.getElementById('spanish-translation');
        if (btnTraduccion && divTraduccion) {
            btnTraduccion.textContent = '📖 Ver traducción';
            divTraduccion.classList.add('hidden');
        }
    }, 10);
    
    // Configurar funcionalidad del icono del ojo
    setTimeout(function() {
        var ojo = document.getElementById('always-visible-eye');
        if(ojo) {
            ojo.onclick = function() {
                window.mostrarTraduccionSiempre = !window.mostrarTraduccionSiempre;
                if(window.mostrarTraduccionSiempre) {
                    ojo.style.color = '#0ea900';
                    if(typeof window.mostrarTraduccion === 'function') window.mostrarTraduccion();
                } else {
                    ojo.style.color = '#2563eb';
                    var div = document.getElementById('spanish-translation');
                    if(div && div.classList && !div.classList.contains('hidden')) {
                        div.classList.add('hidden');
                    }
                    var btn = document.getElementById('show-translation-btn');
                    if(btn) btn.style.display = '';
                }
            };
            if(window.mostrarTraduccionSiempre) {
                ojo.style.color = '#0ea900';
            } else {
                ojo.style.color = '#2563eb';
            }
        }
    }, 0);
    
    // Mostrar traducción si está activo
    if (window.mostrarTraduccionSiempre) {
        setTimeout(() => {
            window.mostrarTraduccion();
            var btn = document.getElementById('show-translation-btn');
            if(btn) btn.style.display = 'none';
        }, 30);
    }
}

// Reproducir sonido
window.reproducirSonido = function() {
    // Sonido opcional - no es crítico
};

// Normalizar palabra
function normalizarPalabra(palabra) {
    return palabra.toLowerCase().replace(/[.,!?;:'"`~@#$%^&*()_+\-=\[\]{}|\\;:"'<>?\/]/g, '');
}
window.normalizarPalabra = normalizarPalabra;

// Seleccionar opción
window.seleccionar = function(opcion, correcta) {
    const palabraActual = window.palabrasRestantes[window.indiceActual];
    const esCorrecta = window.normalizarPalabra(opcion) === window.normalizarPalabra(correcta);
    
    window.mostrarFeedback(esCorrecta, correcta);
}

// Mostrar feedback
function mostrarFeedback(esCorrecta, palabraCorrecta) {
    const palabraActual = window.palabrasRestantes[window.indiceActual];
    if (esCorrecta) {
        window.respuestasCorrectas++;
        window.palabrasRestantes.splice(window.indiceActual, 1);
    } else {
        window.respuestasIncorrectas++;
        const palabraRepetir = window.palabrasRestantes.splice(window.indiceActual, 1)[0];
        window.palabrasRestantes.push(palabraRepetir);
    }
    
    // Toast de feedback
    let feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'practice-feedback-toast ' + (esCorrecta ? 'success' : 'error');
    feedbackDiv.textContent = esCorrecta ? '¡Correcto!' : `Incorrecto. Correcto: ${palabraCorrecta}`;
    feedbackDiv.style.position = 'fixed';
    feedbackDiv.style.zIndex = '9999';
    feedbackDiv.style.padding = '6px 10px';
    feedbackDiv.style.borderRadius = '6px';
    feedbackDiv.style.fontWeight = 'bold';
    feedbackDiv.style.fontSize = '15px';
    feedbackDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    feedbackDiv.style.color = '#fff';
    feedbackDiv.style.background = esCorrecta ? '#22c55e' : '#ef4444';
    feedbackDiv.style.opacity = '0.87';
    feedbackDiv.style.pointerEvents = 'none';
    feedbackDiv.style.top = '30px';
    feedbackDiv.style.left = '50%';
    feedbackDiv.style.transform = 'translateX(-50%)';
    document.body.appendChild(feedbackDiv);
    setTimeout(() => feedbackDiv.remove(), 1500);

    window.actualizarEstadisticas();
    
    // Terminar cuando no quedan palabras
    if (window.palabrasRestantes.length === 0) {
        window.mostrarResultados();
        return;
    }
    
    // Mostrar botón siguiente
    const btnSiguiente = document.querySelector('.next-btn');
    if (btnSiguiente) {
        btnSiguiente.style.display = 'block';
    }
}
window.mostrarFeedback = mostrarFeedback;

// Siguiente pregunta
window.siguientePregunta = function() {
    window.indicePreguntaActual++;
    if (window.palabrasRestantes.length === 0) {
        window.mostrarResultados();
        return;
    }
    window.cargarPregunta();
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const totalPalabras = window.palabras.length;
    const completadas = window.respuestasCorrectas;
    document.getElementById('practice-current-question').textContent = completadas;
    document.getElementById('practice-correct-count').textContent = window.respuestasCorrectas;
    document.getElementById('practice-incorrect-count').textContent = window.respuestasIncorrectas;
    const progreso = (completadas / totalPalabras) * 100;
    document.getElementById('practice-progress-bar').style.width = progreso + '%';
}
window.actualizarEstadisticas = actualizarEstadisticas;

// Mostrar resultados
function mostrarResultados() {
    window.resultadosActivo = true;
    const header = document.querySelector('header');
    if (header) {
        header.style.display = '';
    }
    
    window.guardarProgreso(
        'selection',
        window.palabras.length,
        window.respuestasCorrectas,
        window.respuestasIncorrectas
    );
    
    window.tiempoFin = Date.now();
    window.duracion = Math.floor((window.tiempoFin - window.tiempoInicio) / 1000);
    
    if (window.duracion && window.duracion > 0) {
        fetch('save_practice_time.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'duration=' + window.duracion + '&mode=selection'
        });
    }
    
    const htmlResultados = `
        <div class="practice-results">
            <h3>🎉 ¡Ejercicio completado!</h3>
            <div class="practice-score">
                ${window.respuestasCorrectas} palabras aprendidas
            </div>
            <p>¡Excelente trabajo! Has completado todas las palabras correctamente.</p>
            <div style="margin-top: 30px;">
                <button class="next-btn" id="practice-next-btn" onclick="window.location.href='index.php?tab=practice'" style="margin-right: 15px;">Seguir practicando</button>
                <a href="index.php?tab=progress" class="nav-btn" style="margin-right: 15px;">Ir a mi progreso</a>
                <a href="index.php?tab=my-texts" class="nav-btn">Ver mis textos</a>
            </div>
        </div>
    `;
    document.getElementById('practice-exercise-card').innerHTML = htmlResultados;

    function siguienteAlPresionarEnter(e) {
        if (window.resultadosActivo && e.key === 'Enter') {
            window.removeEventListener('keydown', siguienteAlPresionarEnter);
            window.resultadosActivo = false;
            const btnSiguiente = document.getElementById('practice-next-btn');
            if (btnSiguiente) btnSiguiente.click();
        }
    }
    window.addEventListener('keydown', siguienteAlPresionarEnter);
    
    const btnSiguiente = document.getElementById('practice-next-btn');
    if (btnSiguiente) {
        btnSiguiente.onclick = function() {
            window.removeEventListener('keydown', siguienteAlPresionarEnter);
            window.resultadosActivo = false;
            window.location.href = 'index.php?tab=practice';
        };
    }
    
    window.mostrarTraduccionSiempre = false;
}
window.mostrarResultados = mostrarResultados;

// Mostrar pista
window.mostrarPista = function(palabra) {
    const palabraPractica = window.palabras.find(p => p.word === palabra);
    if (palabraPractica) {
        const pista = palabra.substring(0, 2);
        
        const oracionIngles = document.getElementById('english-sentence');
        if (oracionIngles && window.datoPreguntaActual) {
            const oracionConPista = window.datoPreguntaActual.en.replace(
                /____+/g, 
                `<span class="highlighted-word" style="font-size: 1.2em; background: #ff6f0074; padding: 4px 8px; border-radius: 3px; animation: pulse 2s infinite;">${pista}...</span>`
            );
            oracionIngles.innerHTML = oracionConPista;
            
            setTimeout(() => {
                if (oracionIngles && window.datoPreguntaActual) {
                    oracionIngles.innerHTML = window.datoPreguntaActual.en;
                }
            }, 3000);
        }
        
        const elementoPista = document.querySelector('.practice-controls .hint-btn');
        if (elementoPista) {
            elementoPista.innerHTML = `💡 Pista: ${pista}...`;
            elementoPista.style.background = '#ff6f0074';
            elementoPista.style.color = '#92400e';
            elementoPista.style.fontWeight = 'bold';
            
            setTimeout(() => {
                elementoPista.innerHTML = `💡 Pista`;
                elementoPista.style.background = '';
                elementoPista.style.color = '';
                elementoPista.style.fontWeight = '';
            }, 3000);
        }
    }
}

// Mostrar traducción
window.mostrarTraduccion = function() {
    const palabraActual = window.palabras.find(p => p.word === window.datoPreguntaActual.palabra);
    if (!palabraActual) return;

    const divTraduccion = document.getElementById('spanish-translation');
    const btnTraduccion = document.getElementById('show-translation-btn');
    
    if (divTraduccion.classList.contains('hidden')) {
        divTraduccion.classList.remove('hidden');
        if (btnTraduccion) btnTraduccion.textContent = '📖 Ocultar traducción';
    } else {
        divTraduccion.classList.add('hidden');
        if (btnTraduccion) btnTraduccion.textContent = '📖 Ver traducción';
        return;
    }

    if (window.datoPreguntaActual.needsTranslation) {
        const contextoOriginal = window.palabrasRestantes[window.indiceActual].context;
        const fraseTraducir = contextoOriginal || window.datoPreguntaActual.en.replace(/____+/g, window.datoPreguntaActual.palabra);
        window.traducirFrase(fraseTraducir, window.datoPreguntaActual.traduccion);
    } else {
        divTraduccion.innerHTML = window.datoPreguntaActual.es;
    }
}

// Traducir frase
window.traducirFrase = function(frase, traduccionPalabra) {
    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'sentence=' + encodeURIComponent(frase) + '&word=' + encodeURIComponent(traduccionPalabra)
    })
    .then(res => res.json())
    .then(data => {
        const divTraduccion = document.getElementById('spanish-translation');
        if (data.translation) {
            let traduccionMarcada = data.translation;
            if (traduccionPalabra) {
                traduccionMarcada = traduccionMarcada.replace(
                    new RegExp(traduccionPalabra, 'gi'),
                    `<span class="highlighted-word">(${traduccionPalabra})</span>`
                );
            }
            divTraduccion.innerHTML = traduccionMarcada;
        }
    })
    .catch(() => {
        const divTraduccion = document.getElementById('spanish-translation');
        divTraduccion.innerHTML = 'Error en la traducción';
    });
}

// Generar distracciones
window.generarDistraccion = function(palabraCorrecta) {
    const distraccionesDisponibles = window.palabras
        .filter(p => window.normalizarPalabra(p.word) !== window.normalizarPalabra(palabraCorrecta))
        .map(p => p.word);
    
    const distraccionesAleatorias = [];
    const limite = Math.min(3, distraccionesDisponibles.length);
    
    for (let i = 0; i < limite; i++) {
        const indiceAleatorio = Math.floor(Math.random() * distraccionesDisponibles.length);
        distraccionesAleatorias.push(distraccionesDisponibles[indiceAleatorio]);
        distraccionesDisponibles.splice(indiceAleatorio, 1);
    }
    
    return distraccionesAleatorias;
}

// Hacer palabras clickeables
window.hacerPalabrasClickeables = function(frase) {
    return frase;
}

// Asignar manejadores de click a palabras
function asignarManejadoresClickPalabras() {
    const spans = document.querySelectorAll('.practice-word');
    spans.forEach(span => {
        span.removeEventListener('click', window.manejarClickPalabra);
        span.addEventListener('click', window.manejarClickPalabra);
    });
}
window.asignarManejadoresClickPalabras = asignarManejadoresClickPalabras;

// Manejar click en palabra
window.manejarClickPalabra = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const palabra = this.textContent.trim();
    if (!palabra || palabra === '___') return;

    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'word=' + encodeURIComponent(palabra)
    })
    .then(res => res.json())
    .then(data => {
        if (data.translation) {
            window.mostrarTooltip(this, palabra, data.translation);
        } else {
            window.mostrarTooltip(this, palabra, 'No se encontró traducción');
        }
    })
    .catch(() => {
        window.mostrarTooltip(this, palabra, 'Error en la traducción');
    });
}

// Mostrar tooltip
function mostrarTooltip(elemento, palabra, traduccion) {
    const existente = document.querySelector('.practice-tooltip');
    if (existente) existente.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'practice-tooltip';
    tooltip.innerHTML = `<strong>${palabra}</strong> → ${traduccion}`;
    
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
    
    const rect = elemento.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    tooltip.style.top = (rect.bottom + 6 + scrollY) + 'px';
    tooltip.style.left = (rect.left + rect.width/2 - tooltipRect.width/2 + scrollX) + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip && tooltip.remove(), 200);
    }, 3000);
}
window.mostrarTooltip = mostrarTooltip;

// Guardar progreso
function guardarProgreso(modo, totalPalabras, correctas, incorrectas) {
    let textoId = null;
    if (window.palabras && window.palabras.length > 0 && window.palabras[0].text_id) {
        textoId = window.palabras[0].text_id;
    }
    
    const formData = new FormData();
    formData.append('mode', modo);
    formData.append('total_words', totalPalabras);
    formData.append('correct_answers', correctas);
    formData.append('incorrect_answers', incorrectas);
    if (textoId) {
        formData.append('text_id', textoId);
    }
    
    fetch('save_practice_progress.php', {
        method: 'POST',
        body: formData
    })
    .catch(() => {
        // Error silencioso
    });
}
window.guardarProgreso = guardarProgreso;
