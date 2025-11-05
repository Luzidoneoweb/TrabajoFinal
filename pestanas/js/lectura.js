// pestanas/js/lectura.js
// Script principal para la funcionalidad de lectura de textos
// Comportamiento similar a realdlan: adaptación dinámica al tamaño de pantalla y zoom

document.addEventListener('DOMContentLoaded', function() {
    // Referencias y variables globales
    const panelLectura = document.getElementById('panelLectura');
    let todasLasFrasesOriginales = []; // Array con todas las frases originales divididas
    let todasLasFrasesTraduccion = []; // Array con todas las traducciones divididas
    let paginaActual = 0; // Índice de la página actual (comienza en 0)
    let frasesPorPagina = 1; // Número de frases que caben por página (se calcula dinámicamente)
    let totalPaginas = 0; // Total de páginas según el número de frases y capacidad de pantalla
    let timeoutResize = null; // Timeout para optimizar el evento resize

    // Observar cambios en el panel de lectura para cargar el texto cuando se active
    // Esto permite cargar el contenido solo cuando el panel es visible
    if (panelLectura) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (panelLectura.classList.contains('activo')) {
                        console.log('Panel de lectura activado, cargando texto...');
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

    // Función para dividir texto en fragmentos de máximo 20 palabras o hasta punto final ". "
    // Divide el texto respetando límite de palabras y puntos finales de oración
    // Retorna array de frases que se mostrarán una por una en la interfaz
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
    // Se usa para limitar las traducciones a 20 palabras con indicador "..." si excede
    function truncarTexto(texto, limitePalabras) {
        if (!texto || texto.trim() === '') return '';
        const palabras = texto.trim().split(/\s+/);
        if (palabras.length > limitePalabras) {
            return palabras.slice(0, limitePalabras).join(' ') + '...';
        }
        return texto.trim();
    }

    // Función para mostrar la página actual
    // Renderiza solo las frases que corresponden a la página seleccionada
    // Comportamiento similar a ventana de navegador: muestra el contenido de la página actual
    function mostrarPagina(numeroPagina) {
        const zonaFrases = document.querySelector('.zona-frases');
        if (!zonaFrases) return; // Validación de seguridad
        
        // Limpiar páginas anteriores y crear contenedor para la página activa
        // MotorLectura busca elementos con clase .page.active
        zonaFrases.innerHTML = '';
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('page', 'active');
        zonaFrases.appendChild(pageContainer);

        // Calcular índices de inicio y fin para la página actual
        const inicio = numeroPagina * frasesPorPagina;
        const fin = inicio + frasesPorPagina;

        // Obtener solo las frases que corresponden a esta página
        const frasesAMostrarOriginal = todasLasFrasesOriginales.slice(inicio, fin);
        const frasesAMostrarTraduccion = todasLasFrasesTraduccion.slice(inicio, fin);

        // Crear y añadir cada frase con su traducción correspondiente
        frasesAMostrarOriginal.forEach((fraseOriginal, index) => {
            // Crear contenedor para la frase original
            const divFraseOriginal = document.createElement('div');
            divFraseOriginal.classList.add('frase', 'frase-original');
            divFraseOriginal.setAttribute('aria-label', 'Frase original');
            
            // Crear párrafo con clase .paragraph para que MotorLectura lo encuentre
            const parrafo = document.createElement('p');
            parrafo.classList.add('paragraph'); // Clase necesaria para MotorLectura
            parrafo.textContent = fraseOriginal;
            
            divFraseOriginal.innerHTML = `
                <div class="contenido-texto">
                </div>
            `;
            divFraseOriginal.querySelector('.contenido-texto').appendChild(parrafo);
            pageContainer.appendChild(divFraseOriginal);

            // Crear línea de traducción con estilo de barra horizontal
            // Se crea directamente sin wrapper para mantener centrado correcto
            const divTraduccionOriginal = document.createElement('div');
            divTraduccionOriginal.classList.add('frase-traduccion-original');
            divTraduccionOriginal.setAttribute('aria-label', 'Traducción de la frase original');
            
            // Obtener traducción correspondiente (o cadena vacía si no existe)
            const traduccionFrase = frasesAMostrarTraduccion[index] || '';
            // Truncar a máximo 20 palabras para mantener consistencia
            const traduccionTruncada = truncarTexto(traduccionFrase, 20);
            
            divTraduccionOriginal.innerHTML = `
                <p class="texto-traduccion-original">${traduccionTruncada}</p>
            `;
            
            // Añadir directamente a pageContainer - el CSS se encarga del centrado
            pageContainer.appendChild(divTraduccionOriginal);
        });

        // Actualizar estado de paginación (números y botones)
        actualizarEstadoPaginacion();
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
        void tempContainer.offsetHeight;
        void tempContainer.offsetHeight;
        
        // Calcular altura total de una frase completa (incluyendo margin-bottom)
        const alturaFraseCompleta = divFraseWrapper.offsetHeight;
        
        // Limpiar elemento temporal
        zonaFrases.removeChild(tempContainer);

        // Validaciones de seguridad
        if (alturaFraseCompleta === 0 || isNaN(alturaFraseCompleta) || !isFinite(alturaFraseCompleta)) {
            console.warn('No se pudo calcular altura de frase, usando valor por defecto');
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
    // Actualiza el contador de páginas y habilita/deshabilita botones según la posición actual
    // Comportamiento similar a realdlan: muestra "X / Y" y deshabilita botones cuando corresponde
    function actualizarEstadoPaginacion() {
        // Recalcular total de páginas basado en número de frases y capacidad actual
        totalPaginas = Math.ceil(todasLasFrasesOriginales.length / frasesPorPagina);
        
        // Actualizar texto del contador de páginas (formato: "1 / 5")
        const estadoPagina = document.querySelector('.estado-pagina');
        if (estadoPagina) {
            estadoPagina.textContent = `${paginaActual + 1} / ${totalPaginas}`;
        }

        // Obtener referencias a los botones de navegación
        const btnAnterior = document.querySelector('.btn-anterior');
        const btnSiguiente = document.querySelector('.btn-siguiente');

        // Habilitar/deshabilitar botones según la posición actual
        if (btnAnterior) {
            btnAnterior.disabled = paginaActual === 0; // Deshabilitar si estamos en la primera página
        }
        if (btnSiguiente) {
            btnSiguiente.disabled = paginaActual >= totalPaginas - 1; // Deshabilitar si estamos en la última
        }
    }

    // Función para cargar el contenido del texto desde el servidor
    // Obtiene el texto completo, lo divide en frases y configura la paginación inicial
    // Similar al comportamiento de get_lectura_data.php en realdlan
    function cargarContenidoLectura() {
        // Asegurar que el mensaje de carga esté visible si no lo está ya
        if (typeof window.showLoadingMessage === 'function') {
            window.showLoadingMessage();
        }
        
        // Obtener ID del texto seleccionado desde localStorage
        let textId = localStorage.getItem('currentTextId');
        if (!textId) {
            console.warn('No se encontró el ID del texto en localStorage. Intentando cargar el texto con ID 1 para prueba.');
            textId = 1; // ID por defecto para pruebas
        }

        // Realizar petición fetch al endpoint PHP para obtener los datos del texto
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
                    
                    // Actualizar título del texto en el encabezado
                    const tituloLectura = document.querySelector('.titulo-lectura');
                    if (tituloLectura) {
                        tituloLectura.textContent = texto.title;
                    }
                    
                    // Preparar contenido original: convertir saltos de línea en espacios y limpiar
                    const contenidoOriginal = (texto.content || '').replace(/\n/g, ' ').trim();
                    todasLasFrasesOriginales = dividirEnFrases(contenidoOriginal, 20);

                    // Preparar contenido de traducción de la misma manera
                    const contenidoTraduccion = (texto.content_translation || '').replace(/\n/g, ' ').trim();
                    todasLasFrasesTraduccion = dividirEnFrases(contenidoTraduccion, 20);

                    // Resetear a la primera página al cargar un nuevo texto
                    paginaActual = 0;
                    
                    // Esperar un momento para que el DOM se estabilice antes de calcular
                    setTimeout(() => {
                        // Calcular dinámicamente cuántas frases caben en la pantalla actual
                        frasesPorPagina = calcularFrasesPorPagina();
                        
                        // Mostrar la primera página después de calcular
                        mostrarPagina(paginaActual);
                        
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
            });
    }

    // Event Listeners para los botones de paginación
    // Comportamiento similar a realdlan: navegación entre páginas con validación de límites
    const btnAnterior = document.querySelector('.btn-anterior');
    const btnSiguiente = document.querySelector('.btn-siguiente');
    
    // Listener para botón "Anterior": retrocede a la página previa si existe
    if (btnAnterior) {
        btnAnterior.addEventListener('click', function() {
            if (paginaActual > 0) {
                lecturaContinua = false; // Detener lectura continua si el usuario navega manualmente
                paginaActual--;
                mostrarPagina(paginaActual);
            }
        });
    }

    // Listener para botón "Siguiente": avanza a la página siguiente si existe
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function() {
            if (paginaActual < totalPaginas - 1) {
                lecturaContinua = false; // Detener lectura continua si el usuario navega manualmente
                paginaActual++;
                mostrarPagina(paginaActual);
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
            frasesPorPagina = calcularFrasesPorPagina();
            
            // Recalcular total de páginas con el nuevo número de frases por página
            totalPaginas = Math.ceil(todasLasFrasesOriginales.length / frasesPorPagina);
            
            // Ajustar página actual si es necesario (evitar páginas inexistentes)
            if (paginaActual >= totalPaginas) {
                paginaActual = Math.max(0, totalPaginas - 1);
            }
            
            // Refrescar la vista con la nueva paginación
            mostrarPagina(paginaActual);
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
            if (window.MotorLectura) {
                if (window.MotorLectura.estado === 'reproduciendo' || window.MotorLectura.estado === 'pausado') {
                    // Detener la lectura si está reproduciendo o pausada
                    lecturaContinua = false;
                    window.MotorLectura.detener();
                } else {
                    // Iniciar la lectura desde el primer párrafo de la página actual
                    // MotorLectura busca párrafos con clase .paragraph dentro de .page.active
                    lecturaContinua = true; // Activar lectura continua para todas las páginas
                    window.MotorLectura.iniciar(0);
                }
                // Actualizar el botón y los encabezados después de cambiar el estado
                setTimeout(actualizarBotonPlay, 100);
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
                // Aún hay párrafos en esta página, continuar leyendo
                this.hablarActual();
                return;
            }
            // No hay más párrafos en esta página, intentar avanzar a la siguiente
            if (lecturaContinua && paginaActual < totalPaginas - 1) {
                // Avanzar a la siguiente página automáticamente
                paginaActual++;
                mostrarPagina(paginaActual);
                // Esperar a que se renderice la nueva página y continuar leyendo
                setTimeout(() => {
                    this.indiceActual = 0;
                    this.hablarActual();
                }, 300);
            } else {
                // No hay más páginas - la lectura ha terminado completamente
                this.detener();
                lecturaContinua = false;
                actualizarBotonPlay();
                // Mostrar modal de finalización y redirigir
                if (typeof window.mostrarModalFinalizacion === 'function') {
                    window.mostrarModalFinalizacion();
                }
            }
        };
    }

    // Modificar mostrarPagina para detener la lectura al cambiar de página manualmente
    const originalMostrarPagina = mostrarPagina;
    mostrarPagina = function(numeroPagina) {
        // Solo detener la lectura si el usuario cambia de página manualmente (no automáticamente)
        if (window.MotorLectura && window.MotorLectura.estado !== 'inactivo' && !lecturaContinua) {
            window.MotorLectura.detener();
        }
        originalMostrarPagina(numeroPagina);
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
