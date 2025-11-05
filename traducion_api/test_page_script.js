// traducion_api/test_page_script.js
document.addEventListener('DOMContentLoaded', function() {
    let todasLasFrasesOriginales = [];
    let todasLasFrasesTraduccion = [];
    let paginaActual = 0;
    let frasesPorPagina = 1;
    let totalPaginas = 0;
    let timeoutResize = null;

    // Función para dividir texto en fragmentos de máximo 20 palabras o hasta punto final ". "
    function dividirEnFrases(texto, limitePalabras = 20) {
        if (!texto || texto.trim() === '') return [];
        
        const frases = [];
        let textoRestante = texto.trim();
        
        while (textoRestante.length > 0) {
            const palabras = textoRestante.split(/\s+/);
            
            if (palabras.length <= limitePalabras) {
                const indicePunto = textoRestante.search(/\.\s+/);
                
                if (indicePunto !== -1) {
                    const fragmento = textoRestante.substring(0, indicePunto + 1).trim();
                    frases.push(fragmento);
                    textoRestante = textoRestante.substring(indicePunto + 2).trim();
                } else {
                    frases.push(textoRestante);
                    textoRestante = '';
                }
            } else {
                const fragmento20Palabras = palabras.slice(0, limitePalabras).join(' ');
                const indicePunto = fragmento20Palabras.search(/\.\s+/);
                
                if (indicePunto !== -1) {
                    const fragmento = textoRestante.substring(0, indicePunto + 1).trim();
                    frases.push(fragmento);
                    textoRestante = textoRestante.substring(indicePunto + 2).trim();
                } else {
                    frases.push(fragmento20Palabras);
                    textoRestante = palabras.slice(limitePalabras).join(' ').trim();
                }
            }
        }
        
        return frases.filter(f => f.length > 0);
    }

    // Función para truncar texto a un máximo de palabras especificado
    function truncarTexto(texto, limitePalabras) {
        if (!texto || texto.trim() === '') return '';
        const palabras = texto.trim().split(/\s+/);
        if (palabras.length > limitePalabras) {
            return palabras.slice(0, limitePalabras).join(' ') + '...';
        }
        return texto.trim();
    }

    // Función para mostrar la página actual
    function mostrarPagina(numeroPagina) {
        const zonaFrases = document.querySelector('.zona-frases');
        if (!zonaFrases) return;
        
        zonaFrases.innerHTML = '';
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('page', 'active');
        zonaFrases.appendChild(pageContainer);

        const inicio = numeroPagina * frasesPorPagina;
        const fin = inicio + frasesPorPagina;

        const frasesAMostrarOriginal = todasLasFrasesOriginales.slice(inicio, fin);
        const frasesAMostrarTraduccion = todasLasFrasesTraduccion.slice(inicio, fin);

        frasesAMostrarOriginal.forEach((fraseOriginal, index) => {
            const divFraseOriginal = document.createElement('div');
            divFraseOriginal.classList.add('frase', 'frase-original');
            divFraseOriginal.setAttribute('aria-label', 'Frase original');
            
            const parrafo = document.createElement('p');
            parrafo.classList.add('paragraph');
            parrafo.textContent = fraseOriginal;
            
            divFraseOriginal.innerHTML = `
                <div class="contenido-texto">
                </div>
            `;
            divFraseOriginal.querySelector('.contenido-texto').appendChild(parrafo);
            pageContainer.appendChild(divFraseOriginal);

            const divTraduccionOriginal = document.createElement('div');
            divTraduccionOriginal.classList.add('frase-traduccion-original');
            divTraduccionOriginal.setAttribute('aria-label', 'Traducción de la frase original');
            
            const traduccionFrase = frasesAMostrarTraduccion[index] || '';
            const traduccionTruncada = truncarTexto(traduccionFrase, 20);
            
            divTraduccionOriginal.innerHTML = `
                <p class="texto-traduccion-original">${traduccionTruncada}</p>
            `;
            
            pageContainer.appendChild(divTraduccionOriginal);
        });

        actualizarEstadoPaginacion();
    }

    // Función para calcular dinámicamente cuántas frases caben en la pantalla
    function calcularFrasesPorPagina() {
        const zonaFrases = document.querySelector('.zona-frases');
        if (!zonaFrases) return 1;
        
        const contenedorLectura = document.querySelector('.contenedor-lectura');
        let alturaDisponible = 0;
        
        if (contenedorLectura) {
            const rectContenedor = contenedorLectura.getBoundingClientRect();
            const encabezado = document.querySelector('.encabezado-lectura');
            const controles = document.querySelector('.controles-lectura');
            
            let alturaEncabezado = 0;
            let alturaControles = 0;
            
            if (encabezado) {
                alturaEncabezado = encabezado.getBoundingClientRect().height;
            }
            
            if (controles) {
                alturaControles = controles.getBoundingClientRect().height;
            }
            
            alturaDisponible = rectContenedor.height - alturaEncabezado - alturaControles;
        }
        
        if (alturaDisponible <= 0) {
            const rectZona = zonaFrases.getBoundingClientRect();
            alturaDisponible = rectZona.height;
        }
        
        if (alturaDisponible <= 0 || alturaDisponible < 100) {
            alturaDisponible = window.innerHeight * 0.6;
        }
        
        const tempContainer = document.createElement('div');
        tempContainer.classList.add('page', 'active');
        tempContainer.style.cssText = 'visibility: hidden; position: absolute; width: 100%; top: 0; left: 0; pointer-events: none;';
        zonaFrases.appendChild(tempContainer);

        const divFraseWrapper = document.createElement('div');
        divFraseWrapper.classList.add('frase');

        const divFraseOriginal = document.createElement('div');
        divFraseOriginal.classList.add('frase-original');
        const parrafoPrueba = document.createElement('p');
        parrafoPrueba.classList.add('paragraph');
        parrafoPrueba.textContent = 'Traveling is one of the best ways to learn about the world and about yourself.';
        const contenidoPrueba = document.createElement('div');
        contenidoPrueba.classList.add('contenido-texto');
        contenidoPrueba.appendChild(parrafoPrueba);
        divFraseOriginal.appendChild(contenidoPrueba);
        divFraseWrapper.appendChild(divFraseOriginal);

        const divTraduccionOriginal = document.createElement('div');
        divTraduccionOriginal.classList.add('frase-traduccion-original');
        const traduccionPrueba = document.createElement('p');
        traduccionPrueba.classList.add('texto-traduccion-original');
        traduccionPrueba.textContent = 'Viajar es una de las mejores formas de aprender sobre el mundo.';
        divTraduccionOriginal.appendChild(traduccionPrueba);
        divFraseWrapper.appendChild(divTraduccionOriginal);

        tempContainer.appendChild(divFraseWrapper);

        void tempContainer.offsetHeight;
        void tempContainer.offsetHeight;
        
        const alturaFraseCompleta = divFraseWrapper.offsetHeight;
        
        zonaFrases.removeChild(tempContainer);

        if (alturaFraseCompleta === 0 || isNaN(alturaFraseCompleta) || !isFinite(alturaFraseCompleta)) {
            console.warn('No se pudo calcular altura de frase, usando valor por defecto');
            return 1;
        }

        const espacioTeorico = alturaDisponible / alturaFraseCompleta;
        let frasesQueCaben = Math.ceil(espacioTeorico * 0.98);
        
        if (espacioTeorico > 3) {
            frasesQueCaben = Math.ceil(espacioTeorico * 0.99);
        }
        
        const resultado = Math.max(1, frasesQueCaben);
        
        console.log('Cálculo de frases por página:', {
            alturaDisponible: alturaDisponible.toFixed(2),
            alturaFraseCompleta: alturaFraseCompleta.toFixed(2),
            frasesQueCaben: frasesQueCaben,
            resultado: resultado,
            espacioDisponible: (alturaDisponible / alturaFraseCompleta).toFixed(2)
        });
        
        return resultado;
    }

    // Función para actualizar el estado de la paginación (números y botones)
    function actualizarEstadoPaginacion() {
        totalPaginas = Math.ceil(todasLasFrasesOriginales.length / frasesPorPagina);
        
        const estadoPagina = document.querySelector('.estado-pagina');
        if (estadoPagina) {
            estadoPagina.textContent = `${paginaActual + 1} / ${totalPaginas}`;
        }

        const btnAnterior = document.querySelector('.btn-anterior');
        const btnSiguiente = document.querySelector('.btn-siguiente');

        if (btnAnterior) {
            btnAnterior.disabled = paginaActual === 0;
        }
        if (btnSiguiente) {
            btnSiguiente.disabled = paginaActual >= totalPaginas - 1;
        }
    }

    // Función para cargar el contenido del texto desde el servidor
    function cargarContenidoLectura(textId) {
        // Simular mensaje de carga si es necesario
        // if (typeof window.showLoadingMessage === 'function') {
        //     window.showLoadingMessage();
        // }
        
        fetch(`get_test_text_data.php?id=${textId}`, { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const texto = data.data;
                    
                    const tituloLectura = document.querySelector('.titulo-lectura');
                    if (tituloLectura) {
                        tituloLectura.textContent = texto.title;
                    }
                    
                    const contenidoOriginal = (texto.content || '').replace(/\n/g, ' ').trim();
                    todasLasFrasesOriginales = dividirEnFrases(contenidoOriginal, 20);

                    const contenidoTraduccion = (texto.content_translation || '').replace(/\n/g, ' ').trim();
                    todasLasFrasesTraduccion = dividirEnFrases(contenidoTraduccion, 20);

                    paginaActual = 0;
                    
                    setTimeout(() => {
                        frasesPorPagina = calcularFrasesPorPagina();
                        mostrarPagina(paginaActual);
                        
                        const contenedorLectura = document.querySelector('.contenedor-lectura');
                        if (contenedorLectura) {
                            contenedorLectura.style.visibility = 'visible';
                            contenedorLectura.style.opacity = '1';
                            contenedorLectura.style.transition = 'opacity 0.3s ease-in';
                        }
                        
                        // if (typeof window.hideLoadingMessage === 'function') {
                        //     window.hideLoadingMessage();
                        // }
                    }, 200);
                    
                    console.log('Texto cargado y estructurado por frases:', texto.title);
                } else {
                    console.error('Error al cargar el texto:', data.error);
                    document.querySelector('.titulo-lectura').textContent = 'Error al cargar';
                    const zonaFrases = document.querySelector('.zona-frases');
                    zonaFrases.innerHTML = `
                        <div class="frase frase-original" aria-label="Frase original">
                            <div class="contenido-texto">
                                <p>No se pudo cargar el texto: ${data.error}</p>
                            </div>
                        </div>
                        <div class="frase-traduccion-original" aria-label="Traducción de la frase original">
                            <p class="texto-traduccion-original"></p>
                        </div>
                    `;
                    
                    const contenedorLectura = document.querySelector('.contenedor-lectura');
                    if (contenedorLectura) {
                        contenedorLectura.style.visibility = 'visible';
                        contenedorLectura.style.opacity = '1';
                    }
                    
                    // if (typeof window.hideLoadingMessage === 'function') {
                    //     window.hideLoadingMessage();
                    // }
                }
            })
            .catch(error => {
                console.error('Error en la petición fetch para cargar el texto:', error);
                document.querySelector('.titulo-lectura').textContent = 'Error de conexión';
                const zonaFrases = document.querySelector('.zona-frases');
                zonaFrases.innerHTML = `
                    <div class="frase frase-original" aria-label="Frase original">
                        <div class="contenido-texto">
                            <p>Error de red: ${error.message}</p>
                        </div>
                    </div>
                    <div class="frase-traduccion-original" aria-label="Traducción de la frase original">
                        <p class="texto-traduccion-original"></p>
                    </div>
                `;
                
                const contenedorLectura = document.querySelector('.contenedor-lectura');
                if (contenedorLectura) {
                    contenedorLectura.style.visibility = 'visible';
                    contenedorLectura.style.opacity = '1';
                }
                
                // if (typeof window.hideLoadingMessage === 'function') {
                //     window.hideLoadingMessage();
                // }
            });
    }

    // Event Listeners para los botones de paginación
    const btnAnterior = document.querySelector('.btn-anterior');
    const btnSiguiente = document.querySelector('.btn-siguiente');
    
    if (btnAnterior) {
        btnAnterior.addEventListener('click', function() {
            if (paginaActual > 0) {
                paginaActual--;
                mostrarPagina(paginaActual);
            }
        });
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function() {
            if (paginaActual < totalPaginas - 1) {
                paginaActual++;
                mostrarPagina(paginaActual);
            }
        });
    }

    window.addEventListener('resize', function() {
        if (timeoutResize) {
            clearTimeout(timeoutResize);
        }
        
        timeoutResize = setTimeout(function() {
            frasesPorPagina = calcularFrasesPorPagina();
            totalPaginas = Math.ceil(todasLasFrasesOriginales.length / frasesPorPagina);
            
            if (paginaActual >= totalPaginas) {
                paginaActual = Math.max(0, totalPaginas - 1);
            }
            
            mostrarPagina(paginaActual);
        }, 100);
    });

    // Cargar el texto con ID 1 al iniciar la página
    cargarContenidoLectura(1);
});
