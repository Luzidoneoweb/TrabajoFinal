// pestanas/js/lectura.js
// Script principal para la funcionalidad de lectura de textos
// Comportamiento similar a realdlan: adaptación dinámica al tamaño de pantalla y zoom

// Declarar variables globales necesarias para la interacción con reading-engine.js
window.todasLasFrasesOriginales = []; // Array con todas las frases originales divididas
window.todasLasFrasesTraduccion = []; // Array con todas las traducciones divididas
window.paginaActual = 0; // Índice de la página actual (comienza en 0)
window.frasesPorPagina = 1; // Número de frases que caben por página (se calcula dinámicamente)
window.currentTextId = null; // ID del texto actual para las traducciones
let isPageReadyForReading = false; // Bandera para controlar si la página está lista para la lectura
let isContentLoading = false; // Nueva bandera para evitar cargas múltiples

// Función para guardar el texto completo traducido en la BD
// Se llama cuando se traducen nuevas frases (con debounce para evitar múltiples guardados)
window.guardarTextoCompletoTraducido = function() { // Exponer globalmente
    let timeoutGuardarCompleto = null; // Variable local para el debounce

    if (!window.currentTextId || window.todasLasFrasesOriginales.length === 0) {
        return;
    }

    // Limpiar timeout anterior si existe
    if (timeoutGuardarCompleto) {
        clearTimeout(timeoutGuardarCompleto);
    }

    // Usar debounce: esperar 2 segundos después de la última traducción
    timeoutGuardarCompleto = setTimeout(() => {
        // Verificar si todas las frases están traducidas
        const todasTraducidas = window.todasLasFrasesOriginales.every((frase, index) => {
            return window.todasLasFrasesTraduccion[index] && window.todasLasFrasesTraduccion[index].trim().length > 0;
        });

        // Si todas están traducidas, construir y guardar el texto completo
        if (todasTraducidas && typeof window.construirTextoCompletoTraducido === 'function' && typeof window.guardarTraduccionCompletaEnBD === 'function') {
            const textoCompletoTraducido = window.construirTextoCompletoTraducido(window.todasLasFrasesTraduccion);
            
            if (textoCompletoTraducido) {
                // Guardar en BD (asíncrono, no esperamos)
                window.guardarTraduccionCompletaEnBD(window.currentTextId, textoCompletoTraducido);
                // console.log('Texto completo traducido guardado en BD'); // Eliminado para limpiar consola
            }
        }
    }, 2000); // Esperar 2 segundos antes de guardar
};


document.addEventListener('DOMContentLoaded', function() {
    // Referencias y variables locales
    const panelLectura = document.getElementById('panelLectura');
    let totalPaginas = 0; // Total de páginas según el número de frases y capacidad de pantalla
    let timeoutResize = null; // Timeout para optimizar el evento resize
    
    // Observar cambios en el panel de lectura para cargar el texto cuando se active
    // Esto permite cargar el contenido solo cuando el panel es visible
    if (panelLectura) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (panelLectura.classList.contains('activo')) {
                        // console.log('Panel de lectura activado, cargando texto...'); // Eliminado para limpiar consola
                        // Asegurar que el body tenga la clase para ocultar scrollbar
                        document.body.classList.add('lectura-activa');
                        cargarContenidoLectura();
                    } else {
                        // Remover la clase cuando el panel se desactiva
                        document.body.classList.remove('lectura-activa');
                        // Detener la lectura cuando el panel se desactiva
                        if (window.MotorLectura && window.MotorLectura.estado !== 'inactivo') {
                            lecturaContinua = false;
                            window.MotorLectura.detener();
                            // Cancelar explícitamente speechSynthesis
                            if (window.speechSynthesis) {
                                window.speechSynthesis.cancel();
                            }
                            actualizarBotonPlay();
                        }
                    }
                }
            });
        });
        observer.observe(panelLectura, { attributes: true });
    }

    // Usar funciones del módulo text-utils.js
    // Las funciones dividirEnFrases y truncarTexto se usan del objeto window

    // Las funciones de traducción están en traducion_api/lectura-translation-functions.js
    // Se usan: window.traducirFrase, window.guardarTraduccionEnBD, window.cargarCacheTraducciones
    // window.guardarTraduccionCompletaEnBD, window.construirTextoCompletoTraducido

    // Función para mostrar la página actual
    // Renderiza solo las frases que corresponden a la página seleccionada
    // Comportamiento similar a ventana de navegador: muestra el contenido de la página actual
    async function mostrarPagina(numeroPagina) {
        const zonaFrases = document.querySelector('.zona-frases');
        if (!zonaFrases) return; // Validación de seguridad
        
        // Limpiar páginas anteriores y crear contenedor para la página activa
        // MotorLectura busca elementos con clase .page.active
        zonaFrases.innerHTML = '';
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('page', 'active');
        zonaFrases.appendChild(pageContainer);

        // Calcular índices de inicio y fin para la página actual
        const inicio = numeroPagina * window.frasesPorPagina;
        const fin = inicio + window.frasesPorPagina;

        // Obtener solo las frases que corresponden a esta página
        const frasesAMostrarOriginal = window.todasLasFrasesOriginales.slice(inicio, fin);

        // Crear y añadir cada frase con su traducción correspondiente
        for (let index = 0; index < frasesAMostrarOriginal.length; index++) {
            const fraseOriginal = frasesAMostrarOriginal[index];
            const indiceGlobal = inicio + index; // Índice global en el array completo
            
            // Crear contenedor para la frase original
            const divFraseOriginal = document.createElement('div');
            divFraseOriginal.classList.add('frase', 'frase-original');
            divFraseOriginal.setAttribute('aria-label', 'Frase original');
            
            // Crear párrafo con clase .paragraph para que MotorLectura lo encuentre
            const parrafo = document.createElement('p');
            parrafo.classList.add('paragraph'); // Clase necesaria para MotorLectura
            
            // Dividir la frase en palabras y envolver cada una en un span clickeable
            const palabras = fraseOriginal.split(/\s+/);
            palabras.forEach(word => {
                const span = document.createElement('span');
                span.classList.add('clickable-word', 'word-clickable');
                span.setAttribute('tabindex', '0'); // Para accesibilidad
                span.textContent = word + ' '; // Añadir espacio después de cada palabra
                parrafo.appendChild(span);
            });
            
            divFraseOriginal.innerHTML = `
                <div class="contenido-texto">
                </div>
            `;
            divFraseOriginal.querySelector('.contenido-texto').appendChild(parrafo);
            pageContainer.appendChild(divFraseOriginal);

            // Crear línea de traducción con estilo de barra horizontal
            // Se crea vacío inicialmente - la traducción aparecerá solo cuando se lea esa línea
            const divTraduccionOriginal = document.createElement('div');
            divTraduccionOriginal.classList.add('frase-traduccion-original');
            divTraduccionOriginal.setAttribute('aria-label', 'Traducción de la frase original');
            divTraduccionOriginal.setAttribute('data-indice-global', indiceGlobal); // Guardar índice para referencia
            
            // Crear el elemento vacío - se llenará cuando se lea la línea
            divTraduccionOriginal.innerHTML = `
                <p class="texto-traduccion-original"></p>
            `;
            
            // Añadir directamente a pageContainer - el CSS se encarga del centrado
            pageContainer.appendChild(divTraduccionOriginal);
        }

        // Actualizar estado de paginación (números y botones)
        actualizarEstadoPaginacion();
        
        // Inicializar MultiWordSelector después de mostrar la página
        // Esperar un poco para que el DOM se estabilice
        setTimeout(() => {
            if (typeof window.initializeMultiWordSelector === 'function') {
                window.initializeMultiWordSelector();
            } else if (typeof window.MultiWordSelector !== 'undefined' && !window.multiWordSelector) {
                // Si la función no está disponible pero la clase sí, inicializar directamente
                const isPracticePage = document.querySelector('.practice-area') ||
                                      document.querySelector('#practice-container') ||
                                      document.querySelector('.text-selector-container') ||
                                      document.querySelector('#text-selector');
                const currentTab = document.querySelector('.tab-btn.active');
                const isPracticeTab = currentTab && currentTab.textContent.includes('Práctica');
                
                if (!isPracticePage && !isPracticeTab) {
                    window.multiWordSelector = new window.MultiWordSelector();
                }
            }
        }, 200);
    }

    // Función para calcular dinámicamente cuántas frases caben en la pantalla
    function calcularFrasesPorPagina() {
        const zonaFrases = document.querySelector('.zona-frases');
        if (!zonaFrases) return 1;
        
        // Calcular altura disponible desde el contenedor padre
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
        
        // Si aún no tenemos altura, usar getBoundingClientRect en zonaFrases
        if (alturaDisponible <= 0) {
            const rectZona = zonaFrases.getBoundingClientRect();
            alturaDisponible = rectZona.height;
        }
        
        // Si aún no hay altura, usar estimación basada en viewport
        if (alturaDisponible <= 0 || alturaDisponible < 100) {
            alturaDisponible = window.innerHeight * 0.6;
        }
        
        // Crear contenedor temporal con la misma estructura que el contenido real
        const tempContainer = document.createElement('div');
        tempContainer.classList.add('page', 'active');
        tempContainer.style.cssText = 'visibility: hidden; position: absolute; width: 100%; top: 0; left: 0; pointer-events: none;';
        zonaFrases.appendChild(tempContainer);

        // Crear contenedor de frase completo (incluyendo el margin-bottom)
        const divFraseWrapper = document.createElement('div');
        divFraseWrapper.classList.add('frase');

        // Crear frase original de prueba con estructura real
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

        // Crear línea de traducción de prueba
        const divTraduccionOriginal = document.createElement('div');
        divTraduccionOriginal.classList.add('frase-traduccion-original');
        const traduccionPrueba = document.createElement('p');
        traduccionPrueba.classList.add('texto-traduccion-original');
        traduccionPrueba.textContent = 'Viajar es una de las mejores formas de aprender sobre el mundo.';
        divTraduccionOriginal.appendChild(traduccionPrueba);
        divFraseWrapper.appendChild(divTraduccionOriginal);

        tempContainer.appendChild(divFraseWrapper);

        // Forzar reflow múltiples veces para medidas precisas
        // Esperar un poco para que los estilos CSS se apliquen
        void tempContainer.offsetHeight;
        void tempContainer.offsetHeight;
        void tempContainer.offsetWidth; // Forzar otro reflow
        
        // Usar getBoundingClientRect para obtener medidas más precisas
        const rect = divFraseWrapper.getBoundingClientRect();
        let alturaFraseCompleta = rect.height;
        
        // Si getBoundingClientRect no da resultado, usar offsetHeight
        if (alturaFraseCompleta === 0 || isNaN(alturaFraseCompleta)) {
            alturaFraseCompleta = divFraseWrapper.offsetHeight;
        }
        
        // Si aún no hay altura, intentar con computed styles
        if (alturaFraseCompleta === 0 || isNaN(alturaFraseCompleta)) {
            const styles = window.getComputedStyle(divFraseWrapper);
            const marginTop = parseFloat(styles.marginTop) || 0;
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            const paddingTop = parseFloat(styles.paddingTop) || 0;
            const paddingBottom = parseFloat(styles.paddingBottom) || 0;
            alturaFraseCompleta = divFraseWrapper.scrollHeight + marginTop + marginBottom + paddingTop + paddingBottom;
        }
        
        // Limpiar elemento temporal
        if (zonaFrases.contains(tempContainer)) {
            zonaFrases.removeChild(tempContainer);
        }

        // Validaciones de seguridad - si aún no hay altura válida, usar valor por defecto
        if (alturaFraseCompleta === 0 || isNaN(alturaFraseCompleta) || !isFinite(alturaFraseCompleta) || alturaFraseCompleta < 50) {
            // No mostrar warning si es porque el panel no está visible aún
            const panelLectura = document.getElementById('panelLectura');
            if (panelLectura && panelLectura.classList.contains('activo')) {
                // Solo mostrar warning si el panel está activo pero aún no podemos calcular
                console.warn('No se pudo calcular altura de frase, usando valor por defecto');
            }
            return 1;
        }

        // Calcular cuántas frases caben - usar casi todo el espacio disponible
        // Usar Math.ceil para ser agresivo: si cabe 2.5, mostrar 3
        const espacioTeorico = alturaDisponible / alturaFraseCompleta;
        let frasesQueCaben = Math.ceil(espacioTeorico * 0.98);
        
        // Si hay mucho espacio disponible, ser más agresivo
        if (espacioTeorico > 3) {
            frasesQueCaben = Math.ceil(espacioTeorico * 0.99);
        }
        
        // Asegurar al menos 1 frase por página
        const resultado = Math.max(1, frasesQueCaben);
        
        // console.log('Cálculo de frases por página:', { // Eliminado para limpiar consola
        //     alturaDisponible: alturaDisponible.toFixed(2),
        //     alturaFraseCompleta: alturaFraseCompleta.toFixed(2),
        //     frasesQueCaben: frasesQueCaben,
        //     resultado: resultado,
        //     espacioDisponible: (alturaDisponible / alturaFraseCompleta).toFixed(2)
        // });
        
        return resultado;
    }

    // Función para actualizar el estado de la paginación (números y botones)
    // Actualiza el contador de páginas y habilita/deshabilita botones según la posición actual
    // Comportamiento similar a realdlan: muestra "X / Y" y deshabilita botones cuando corresponde
    function actualizarEstadoPaginacion() {
        // Recalcular total de páginas basado en número de frases y capacidad actual
        totalPaginas = Math.ceil(window.todasLasFrasesOriginales.length / window.frasesPorPagina);
        
        // Actualizar texto del contador de páginas (formato: "1 / 5")
        const estadoPagina = document.querySelector('.estado-pagina');
        if (estadoPagina) {
            estadoPagina.textContent = `${window.paginaActual + 1} / ${totalPaginas}`;
        }

        // Obtener referencias a los botones de navegación
        const btnAnterior = document.querySelector('.btn-anterior');
        const btnSiguiente = document.querySelector('.btn-siguiente');

        // Habilitar/deshabilitar botones según la posición actual
        if (btnAnterior) {
            btnAnterior.disabled = window.paginaActual === 0; // Deshabilitar si estamos en la primera página
        }
        if (btnSiguiente) {
            btnSiguiente.disabled = window.paginaActual >= totalPaginas - 1; // Deshabilitar si estamos en la última
        }
    }

    // Función para cargar el contenido del texto desde el servidor
    // Obtiene el texto completo, lo divide en frases y configura la paginación inicial
    // Similar al comportamiento de get_lectura_data.php en realdlan
    async function cargarContenidoLectura() {
        if (isContentLoading) {
            // console.warn('cargarContenidoLectura() ya está en progreso. Ignorando llamada duplicada.'); // Eliminado para limpiar consola
            return;
        }
        isContentLoading = true;
        // console.log('Iniciando cargarContenidoLectura()...'); // Eliminado para limpiar consola

        // Reiniciar la bandera de listo para leer al inicio de la carga
        isPageReadyForReading = false;

        // Asegurar que el mensaje de carga esté visible si no lo está ya
        if (typeof window.showLoadingMessage === 'function') {
            window.showLoadingMessage();
        }

        // Deshabilitar el botón de play durante la carga
        const btnPlay = document.querySelector('.btn-play');
        if (btnPlay) {
            btnPlay.disabled = true;
        }
        
        // Obtener ID del texto seleccionado desde localStorage
        let textId = localStorage.getItem('currentTextId');
        if (!textId) {
            console.warn('No se encontró el ID del texto en localStorage. Intentando cargar el texto con ID 1 para prueba.');
            textId = 1; // ID por defecto para pruebas
        }

        // Guardar el textId actual para las traducciones
        window.currentTextId = parseInt(textId);

        try {
            // Cargar caché de traducciones primero (en paralelo con la carga del texto)
            // Usar función de traducion_api
            let cachePromise = Promise.resolve();
            if (typeof window.cargarCacheTraducciones === 'function') {
                cachePromise = window.cargarCacheTraducciones(window.currentTextId);
            } else {
                console.warn('Función cargarCacheTraducciones no está disponible. Asegúrate de incluir traducion_api/lectura-translation-functions.js');
            }

            // Realizar petición fetch al endpoint PHP para obtener los datos del texto
            const response = await fetch(`pestanas/php/get_lectura_data.php?id=${textId}`, { credentials: 'include' });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Esperar a que se cargue el caché
            await cachePromise;

            if (data.success) {
                const texto = data.data;
                
                // Actualizar título del texto en el encabezado (ambos encabezados)
                const titulosLectura = document.querySelectorAll('.titulo-lectura');
                titulosLectura.forEach(titulo => {
                    titulo.textContent = texto.title;
                });
                
                // Cargar y mostrar traducción del título
                const titulosTraduccion = document.querySelectorAll('.titulo-lectura-traduccion');
                
                // Si ya existe traducción guardada, mostrarla
                if (texto.title_translation) {
                    titulosTraduccion.forEach(tituloTraduccion => {
                        tituloTraduccion.textContent = texto.title_translation;
                    });
                } else {
                    // Si no existe, traducir automáticamente
                    if (typeof window.traducirTitulo === 'function') {
                        window.traducirTitulo(texto.title, window.currentTextId).then(traduccion => {
                            if (traduccion) {
                                titulosTraduccion.forEach(tituloTraduccion => {
                                    tituloTraduccion.textContent = traduccion;
                                });
                            } else {
                                // Si no se pudo traducir, dejar vacío o mostrar mensaje
                                titulosTraduccion.forEach(tituloTraduccion => {
                                    tituloTraduccion.textContent = '';
                                });
                            }
                        }).catch(error => {
                            console.error('Error al traducir título:', error);
                            titulosTraduccion.forEach(tituloTraduccion => {
                                tituloTraduccion.textContent = '';
                            });
                        });
                    } else {
                        console.warn('Función traducirTitulo no está disponible. Asegúrate de incluir traducion_api/lectura-translation-functions.js');
                        titulosTraduccion.forEach(tituloTraduccion => {
                            tituloTraduccion.textContent = '';
                        });
                    }
                }
                
                // Preparar contenido original: convertir saltos de línea en espacios y limpiar
                window.todasLasFrasesOriginales = window.dividirEnFrases((texto.content || '').replace(/\n/g, ' ').trim(), 20);

                // Inicializar array de traducciones (puede estar vacío si no hay traducciones guardadas)
                window.todasLasFrasesTraduccion = [];
                
                // Dividir traducción completa si existe
                let frasesTraduccionCompletas = [];
                if (texto.content_translation) {
                    const contenidoTraduccion = (texto.content_translation || '').replace(/\n/g, ' ').trim();
                    frasesTraduccionCompletas = window.dividirEnFrases(contenidoTraduccion, 20);
                }
                
                // Mapear traducciones: prioridad 1) caché, 2) traducción completa, 3) se traducirá después
                window.todasLasFrasesOriginales.forEach((fraseOriginal, index) => {
                    // Si hay traducción en el caché, usarla (mayor prioridad)
                    if (window.contentTranslationsCache && window.contentTranslationsCache[fraseOriginal]) {
                        window.todasLasFrasesTraduccion[index] = window.contentTranslationsCache[fraseOriginal];
                    } 
                    // Si no, usar la traducción del contenido completo si existe
                    else if (frasesTraduccionCompletas[index]) {
                        window.todasLasFrasesTraduccion[index] = frasesTraduccionCompletas[index];
                    }
                    // Si no hay ninguna, se traducirá cuando se muestre la página
                });
                
                // Si todas las frases ya están traducidas al cargar, guardar el texto completo en BD
                // (por si acaso no está guardado aún)
                if (window.todasLasFrasesOriginales.length > 0) {
                    const todasTraducidas = window.todasLasFrasesOriginales.every((frase, index) => {
                        return window.todasLasFrasesTraduccion[index] && window.todasLasFrasesTraduccion[index].trim().length > 0;
                    });
                    
                    if (todasTraducidas && typeof window.construirTextoCompletoTraducido === 'function' && typeof window.guardarTraduccionCompletaEnBD === 'function') {
                        const textoCompletoTraducido = window.construirTextoCompletoTraducido(window.todasLasFrasesTraduccion);
                        if (textoCompletoTraducido && textoCompletoTraducido !== texto.content_translation) {
                            // Solo guardar si es diferente al que ya está guardado
                            window.guardarTraduccionCompletaEnBD(window.currentTextId, textoCompletoTraducido);
                        }
                    }
                }

                // Resetear a la primera página al cargar un nuevo texto
                window.paginaActual = 0;
                
                // Calcular dinámicamente cuántas frases caben en la pantalla actual
                window.frasesPorPagina = calcularFrasesPorPagina();
                
                // Mostrar la primera página después de calcular (ahora es async)
                await mostrarPagina(window.paginaActual);
                
                // Mostrar el contenido de lectura ahora que está listo
                const panelLectura = document.getElementById('panelLectura');
                if (panelLectura) {
                    const contenedorLectura = panelLectura.querySelector('.contenedor-lectura');
                    if (contenedorLectura) {
                        contenedorLectura.style.visibility = 'visible';
                        contenedorLectura.style.opacity = '1';
                        contenedorLectura.style.transition = 'opacity 0.3s ease-in';
                    }
                }
                
                // Ocultar mensaje de carga cuando el contenido esté listo
                if (typeof window.hideLoadingMessage === 'function') {
                    window.hideLoadingMessage();
                }

                // Habilitar el botón de play una vez que la carga ha finalizado
                if (btnPlay) {
                    btnPlay.disabled = false;
                }
                isPageReadyForReading = true; // La página está lista para la lectura
                isContentLoading = false; // La carga ha finalizado
                // console.log('Texto cargado y estructurado por frases:', texto.title); // Eliminado para limpiar consola
            } else {
                console.error('Error al cargar el texto:', data.error);
                isContentLoading = false; // La carga ha finalizado (con error)
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
                
                // Mostrar el contenido aunque haya error
                const panelLectura = document.getElementById('panelLectura');
                if (panelLectura) {
                    const contenedorLectura = panelLectura.querySelector('.contenedor-lectura');
                    if (contenedorLectura) {
                        contenedorLectura.style.visibility = 'visible';
                        contenedorLectura.style.opacity = '1';
                    }
                }
                
                // Ocultar mensaje de carga en caso de error
                if (typeof window.hideLoadingMessage === 'function') {
                    window.hideLoadingMessage();
                }
            }
        } catch (error) {
            console.error('Error en la petición fetch para cargar el texto:', error);
            // Habilitar el botón de play en caso de error para permitir reintentos
            const btnPlay = document.querySelector('.btn-play');
            if (btnPlay) {
                btnPlay.disabled = false;
            }
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
            
            // Mostrar el contenido aunque haya error
            const panelLectura = document.getElementById('panelLectura');
            if (panelLectura) {
                const contenedorLectura = panelLectura.querySelector('.contenedor-lectura');
                if (contenedorLectura) {
                    contenedorLectura.style.visibility = 'visible';
                    contenedorLectura.style.opacity = '1';
                }
            }
            
            // Ocultar mensaje de carga en caso de error
            if (typeof window.hideLoadingMessage === 'function') {
                window.hideLoadingMessage();
            }
        } finally {
            isContentLoading = false; // Asegurar que la bandera se resetee incluso si hay errores inesperados
            // console.log('Finalizando cargarContenidoLectura().'); // Eliminado para limpiar consola
        }
    }

    // Event Listeners para los botones de paginación
    // Comportamiento: navegación entre páginas con validación de límites
    const btnAnterior = document.querySelector('.btn-anterior');
    const btnSiguiente = document.querySelector('.btn-siguiente');
    
    // Listener para botón "Anterior": retrocede a la página previa si existe
    if (btnAnterior) {
        btnAnterior.addEventListener('click', async function() {
            if (window.paginaActual > 0) {
                lecturaContinua = false; // Detener lectura continua si el usuario navega manualmente
                window.paginaActual--;
                await mostrarPagina(window.paginaActual);
            }
        });
    }

    // Listener para botón "Siguiente": avanza a la página siguiente si existe
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', async function() {
            if (window.paginaActual < totalPaginas - 1) {
                lecturaContinua = false; // Detener lectura continua si el usuario navega manualmente
                window.paginaActual++;
                await mostrarPagina(window.paginaActual);
            }
        });
    }

    // Event listener optimizado para recalcular la paginación al cambiar el tamaño de la ventana o zoom
    // Usa debounce para mejorar el rendimiento y evitar cálculos excesivos
    // Comportamiento similar a realdlan: se adapta inmediatamente a cambios de zoom y tamaño
    window.addEventListener('resize', function() {
        // Limpiar timeout anterior si existe
        if (timeoutResize) {
            clearTimeout(timeoutResize);
        }
        
        // Usar debounce para optimizar: esperar 100ms después del último resize
        timeoutResize = setTimeout(function() {
            // Recalcular cuántas frases caben ahora (considerando nuevo tamaño/zoom)
            window.frasesPorPagina = calcularFrasesPorPagina();
            
            // Recalcular total de páginas con el nuevo número de frases por página
            totalPaginas = Math.ceil(window.todasLasFrasesOriginales.length / window.frasesPorPagina);
            
            // Ajustar página actual si es necesario (evitar páginas inexistentes)
            if (window.paginaActual >= totalPaginas) {
                window.paginaActual = Math.max(0, totalPaginas - 1);
            }
            
            // Refrescar la vista con la nueva paginación (async)
            mostrarPagina(window.paginaActual).catch(error => {
                console.error('Error al mostrar página después de resize:', error);
            });
        }, 100); // Delay de 100ms para optimizar rendimiento
    });

    // Lógica para el botón de reproducción/detención
    // Maneja el inicio y detención de la lectura de texto mediante MotorLectura
    const btnPlay = document.querySelector('.btn-play');
    const encabezadoLectura = document.querySelector('.encabezado-lectura');
    const encabezadoSecundarioLectura = document.querySelector('.encabezado-secundario-lectura');
    const btnVolverSecundario = document.querySelector('.btn-volver-secundario');

    // Variable para controlar si la lectura debe continuar automáticamente
    let lecturaContinua = false;

    // Función para actualizar el estado visual del botón según el estado de MotorLectura
    function actualizarBotonPlay() {
        if (btnPlay) {
            if (window.MotorLectura && window.MotorLectura.estado === 'reproduciendo') {
                btnPlay.title = 'Detener';
                btnPlay.setAttribute('aria-label', 'Detener lectura');
                btnPlay.innerHTML = '&#10074;&#10074;'; // Icono de pausa (||)
                btnPlay.classList.add('playing');
                // Ocultar encabezado principal de la app y encabezado de lectura, mostrar secundario
                if (window.toggleEncabezadoPrincipal) window.toggleEncabezadoPrincipal(true);
                if (encabezadoLectura) encabezadoLectura.classList.add('oculto-lectura');
                if (encabezadoSecundarioLectura) encabezadoSecundarioLectura.classList.add('visible-lectura');
            } else {
                btnPlay.title = 'Reproducir / Detener';
                btnPlay.setAttribute('aria-label', 'Reproducir o detener');
                btnPlay.innerHTML = '&#9658;'; // Icono de reproducción (▶)
                btnPlay.classList.remove('playing');
                // Mostrar encabezado principal de la app y encabezado de lectura, ocultar secundario
                if (window.toggleEncabezadoPrincipal) window.toggleEncabezadoPrincipal(false);
                if (encabezadoLectura) encabezadoLectura.classList.remove('oculto-lectura');
                if (encabezadoSecundarioLectura) encabezadoSecundarioLectura.classList.remove('visible-lectura');
            }
        }
    }

    // Configurar listener del botón de reproducción
    if (btnPlay) {
        btnPlay.addEventListener('click', function() {
            if (window.MotorLectura && isPageReadyForReading) { // Solo iniciar si la página está lista
                if (window.MotorLectura.estado === 'reproduciendo' || window.MotorLectura.estado === 'pausado') {
                    // Detener la lectura si está reproduciendo o pausada
                    lecturaContinua = false;
                    window.MotorLectura.detener();
                } else {
                    // Iniciar la lectura. MotorLectura decidirá si reanudar o empezar desde 0.
                    lecturaContinua = true; // Activar lectura continua para todas las páginas
                    window.MotorLectura.iniciar(); // Llamar sin parámetros para que use la lógica interna
                }
                // Actualizar el botón y los encabezados después de cambiar el estado
                setTimeout(actualizarBotonPlay, 100);
            } else if (!isPageReadyForReading) {
                // console.warn('Intento de iniciar lectura antes de que la página esté lista.'); // Eliminado para limpiar consola
            }
        });
    }

    // Listener para el botón "Volver" del encabezado secundario
    if (btnVolverSecundario) {
        btnVolverSecundario.addEventListener('click', function() {
            if (window.MotorLectura && window.MotorLectura.estado !== 'inactivo') {
                lecturaContinua = false;
                window.MotorLectura.detener();
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
            }
            // Restaurar encabezados
            if (window.toggleEncabezadoPrincipal) window.toggleEncabezadoPrincipal(false);
            if (encabezadoLectura) encabezadoLectura.classList.remove('oculto-lectura');
            if (encabezadoSecundarioLectura) encabezadoSecundarioLectura.classList.remove('visible-lectura');
            // Volver a la pestaña de textos
            window.cambiarPestana('textos');
        });
    }

    // Extender MotorLectura para que funcione con nuestro sistema de paginación
    if (window.MotorLectura) {
        const originalSiguiente = window.MotorLectura.siguiente.bind(window.MotorLectura);
        window.MotorLectura.siguiente = function() {
            const paras = this.parrafos();
            if (this.indiceActual < paras.length) {
                // La traducción ya se muestra en hablarActual(), solo continuar
                this.hablarActual();
                return;
            }
            // No hay más párrafos en esta página, intentar avanzar a la siguiente
            if (lecturaContinua && window.paginaActual < totalPaginas - 1) {
                // Avanzar a la siguiente página automáticamente
                window.paginaActual++;
                mostrarPagina(window.paginaActual).then(() => {
                    // Esperar a que se renderice la nueva página y continuar leyendo
                    setTimeout(() => {
                        this.indiceActual = 0;
                        this.hablarActual();
                    }, 300);
                }).catch(error => {
                    console.error('Error al avanzar página en lectura continua:', error);
                    this.detener();
                    lecturaContinua = false;
                    actualizarBotonPlay();
                });
            } else {
                // No hay más páginas - la lectura ha terminado completamente
                this.finalizarLecturaNatural();
                lecturaContinua = false;
                actualizarBotonPlay();
            }
        };
    }

    // Modificar mostrarPagina para detener la lectura al cambiar de página manualmente
    // Nota: mostrarPagina ya es async, así que solo necesitamos envolver la llamada original
    const originalMostrarPagina = mostrarPagina;
    mostrarPagina = async function(numeroPagina) {
        // Solo detener la lectura si el usuario cambia de página manualmente (no automáticamente)
        if (window.MotorLectura && window.MotorLectura.estado !== 'inactivo' && !lecturaContinua) {
            window.MotorLectura.detener();
        }
        await originalMostrarPagina(numeroPagina);
        actualizarBotonPlay();
    };

    // Listener para actualizar el botón cuando cambie el estado de MotorLectura
    setInterval(function() {
        if (window.MotorLectura) {
            actualizarBotonPlay();
        }
    }, 500);

    // Inicializar el estado del botón al cargar la página
    actualizarBotonPlay();

    // Event listener para detener la lectura cuando la visibilidad de la página cambia
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && window.MotorLectura && window.MotorLectura.estado !== 'inactivo') {
            lecturaContinua = false;
            window.MotorLectura.detener();
            // Cancelar explícitamente speechSynthesis cuando la página se oculta
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            actualizarBotonPlay();
        }
    });

    // Event listener para detener la lectura cuando el usuario intenta salir/recargar la página
    // IMPORTANTE: beforeunload debe ejecutar código síncrono, por eso cancelamos directamente
    window.addEventListener('beforeunload', function() {
        // Cancelar explícitamente speechSynthesis de forma síncrona
        if (window.speechSynthesis) {
            try {
                window.speechSynthesis.cancel();
            } catch(e) {
                // Ignorar errores si el navegador ya está cerrando
            }
        }
        // Detener MotorLectura si existe
        if (window.MotorLectura && window.MotorLectura.estado !== 'inactivo') {
            try {
                window.MotorLectura.estado = 'inactivo';
                window.MotorLectura.limpiarResaltado();
            } catch(e) {
                // Ignorar errores si el navegador ya está cerrando
            }
        }
    });

    // Detener cualquier lectura activa al cargar la página (por si acaso)
    window.addEventListener('pageshow', function(event) {
        // Si la página se carga desde caché (back/forward) o se recarga, detener lectura
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (window.MotorLectura) {
            window.MotorLectura.estado = 'inactivo';
            window.MotorLectura.limpiarResaltado();
            lecturaContinua = false;
            actualizarBotonPlay();
        }
    });
});
