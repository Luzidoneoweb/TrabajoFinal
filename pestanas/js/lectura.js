// pestanas/js/lectura.js

document.addEventListener('DOMContentLoaded', function() {
    const panelLectura = document.getElementById('panelLectura');
    let todasLasFrasesOriginales = [];
    let todasLasFrasesTraduccion = [];
    let paginaActual = 0; // Empezamos en la página 0 para indexar arrays
    let frasesPorPagina = 1; // Se calculará dinámicamente
    let totalPaginas = 0;

    // Observar cambios en el panel de lectura para cargar el texto cuando se active
    if (panelLectura) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (panelLectura.classList.contains('activo')) {
                        console.log('Panel de lectura activado, cargando texto...');
                        cargarContenidoLectura();
                    }
                }
            });
        });
        observer.observe(panelLectura, { attributes: true });
    }

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
        zonaFrases.innerHTML = ''; // Limpiar contenido existente

        const inicio = numeroPagina * frasesPorPagina;
        const fin = inicio + frasesPorPagina;

        const frasesAMostrarOriginal = todasLasFrasesOriginales.slice(inicio, fin);
        const frasesAMostrarTraduccion = todasLasFrasesTraduccion.slice(inicio, fin);

        frasesAMostrarOriginal.forEach((fraseOriginal, index) => {
            const divFraseOriginal = document.createElement('div');
            divFraseOriginal.classList.add('frase', 'frase-original');
            divFraseOriginal.setAttribute('aria-label', 'Frase original');
            divFraseOriginal.innerHTML = `
                <div class="contenido-texto">
                    <p>${fraseOriginal}</p>
                </div>
            `;
            zonaFrases.appendChild(divFraseOriginal);

            const divWrapperTraduccion = document.createElement('div');
            divWrapperTraduccion.style.cssText = 'width: 100%; padding: 0 5vw;';
            
            const divTraduccionOriginal = document.createElement('div');
            divTraduccionOriginal.classList.add('frase-traduccion-original');
            divTraduccionOriginal.setAttribute('aria-label', 'Traducción de la frase original');
            
            const traduccionFrase = frasesAMostrarTraduccion[index] || '';
            const traduccionTruncada = truncarTexto(traduccionFrase, 20);
            
            divTraduccionOriginal.innerHTML = `
                <p class="texto-traduccion-original">${traduccionTruncada}</p>
            `;
            
            divWrapperTraduccion.appendChild(divTraduccionOriginal);
            zonaFrases.appendChild(divWrapperTraduccion);
        });

        actualizarEstadoPaginacion();
    }

    // Función para calcular dinámicamente cuántas frases caben en la pantalla
    function calcularFrasesPorPagina() {
        const zonaFrases = document.querySelector('.zona-frases');
        const alturaDisponible = zonaFrases.clientHeight;
        
        // Crear un elemento temporal para medir la altura de una frase
        const tempContainer = document.createElement('div');
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.position = 'absolute';
        tempContainer.style.width = '100%';
        zonaFrases.appendChild(tempContainer);

        // Medir una frase original y su traducción
        const divFraseOriginal = document.createElement('div');
        divFraseOriginal.classList.add('frase', 'frase-original');
        divFraseOriginal.innerHTML = `<div class="contenido-texto"><p>Texto de prueba para medir altura.</p></div>`;
        tempContainer.appendChild(divFraseOriginal);

        const divWrapperTraduccion = document.createElement('div');
        divWrapperTraduccion.style.cssText = 'width: 100%; padding: 0 5vw;';
        const divTraduccionOriginal = document.createElement('div');
        divTraduccionOriginal.classList.add('frase-traduccion-original');
        divTraduccionOriginal.innerHTML = `<p class="texto-traduccion-original">Translation test text.</p>`;
        divWrapperTraduccion.appendChild(divTraduccionOriginal);
        tempContainer.appendChild(divWrapperTraduccion);

        const alturaFraseCompleta = tempContainer.offsetHeight;
        zonaFrases.removeChild(tempContainer);

        if (alturaFraseCompleta === 0) return 1; // Evitar división por cero

        return Math.max(1, Math.floor(alturaDisponible / alturaFraseCompleta));
    }

    // Función para actualizar el estado de la paginación (números y botones)
    function actualizarEstadoPaginacion() {
        totalPaginas = Math.ceil(todasLasFrasesOriginales.length / frasesPorPagina);
        document.querySelector('.estado-pagina').textContent = `${paginaActual + 1} / ${totalPaginas}`;

        const btnAnterior = document.querySelector('.btn-anterior');
        const btnSiguiente = document.querySelector('.btn-siguiente');

        btnAnterior.disabled = paginaActual === 0;
        btnSiguiente.disabled = paginaActual >= totalPaginas - 1;
    }

    // Función para cargar el contenido del texto
    function cargarContenidoLectura() {
        let textId = localStorage.getItem('currentTextId');
        if (!textId) {
            console.warn('No se encontró el ID del texto en localStorage. Intentando cargar el texto con ID 1 para prueba.');
            textId = 1;
        }

        fetch(`pestanas/php/get_lectura_data.php?id=${textId}`, { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const texto = data.data;
                    document.querySelector('.titulo-lectura').textContent = texto.title;
                    
                    const contenidoOriginal = (texto.content || '').replace(/\n/g, ' ').trim();
                    todasLasFrasesOriginales = dividirEnFrases(contenidoOriginal, 20);

                    const contenidoTraduccion = (texto.content_translation || '').replace(/\n/g, ' ').trim();
                    todasLasFrasesTraduccion = dividirEnFrases(contenidoTraduccion, 20);

                    frasesPorPagina = calcularFrasesPorPagina(); // Calcular frases por página dinámicamente
                    paginaActual = 0; // Resetear a la primera página al cargar un nuevo texto
                    mostrarPagina(paginaActual);
                    console.log('Texto cargado y estructurado por párrafos:', texto.title);
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
                        <div style="width: 100%; padding: 0 1vw;">
                            <div class="frase-traduccion-original" aria-label="Traducción de la frase original">
                                <p class="texto-traduccion-original"></p>
                            </div>
                        </div>
                    `;
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
                    <div style="width: 100%; padding: 0 1vw;">
                        <div class="frase-traduccion-original" aria-label="Traducción de la frase original">
                            <p class="texto-traduccion-original"></p>
                        </div>
                    </div>
                `;
            });
    }

    // Event Listeners para los botones de paginación
    document.querySelector('.btn-anterior').addEventListener('click', function() {
        if (paginaActual > 0) {
            paginaActual--;
            mostrarPagina(paginaActual);
        }
    });

    document.querySelector('.btn-siguiente').addEventListener('click', function() {
        if (paginaActual < totalPaginas - 1) {
            paginaActual++;
            mostrarPagina(paginaActual);
        }
    });

    // Event listener para recalcular la paginación al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        frasesPorPagina = calcularFrasesPorPagina();
        // Asegurarse de que la página actual no exceda el nuevo total de páginas
        if (paginaActual >= totalPaginas) {
            paginaActual = totalPaginas - 1;
            if (paginaActual < 0) paginaActual = 0; // En caso de que no haya frases
        }
        mostrarPagina(paginaActual);
    });
});
