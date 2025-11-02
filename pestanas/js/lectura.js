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
                        cargarContenidoLectura();
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
        
        zonaFrases.innerHTML = ''; // Limpiar contenido existente antes de mostrar nueva página

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
            divFraseOriginal.innerHTML = `
                <div class="contenido-texto">
                    <p>${fraseOriginal}</p>
                </div>
            `;
            zonaFrases.appendChild(divFraseOriginal);

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
            
            // Añadir directamente a zonaFrases - el CSS se encarga del centrado
            zonaFrases.appendChild(divTraduccionOriginal);
        });

        // Actualizar estado de paginación (números y botones)
        actualizarEstadoPaginacion();
    }

    // Función para calcular dinámicamente cuántas frases caben en la pantalla
    // Se adapta automáticamente al zoom, tamaño de pantalla y cambios de ventana
    // Similar al comportamiento de realdlan: el contenido se adapta manteniendo su estructura
    function calcularFrasesPorPagina() {
        const zonaFrases = document.querySelector('.zona-frases');
        if (!zonaFrases) return 1; // Si no existe el contenedor, retornar 1 por defecto
        
        // Obtener altura disponible real (considerando zoom y viewport)
        const alturaDisponible = zonaFrases.clientHeight;
        if (alturaDisponible <= 0) return 1; // Si no hay altura disponible, retornar 1
        
        // Crear contenedor temporal para medir la altura de una frase completa
        // Este contenedor es invisible pero mantiene el layout real
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = 'visibility: hidden; position: absolute; width: 100%; top: 0; left: 0;';
        zonaFrases.appendChild(tempContainer);

        // Crear frase original de prueba con contenido realista
        const divFraseOriginal = document.createElement('div');
        divFraseOriginal.classList.add('frase', 'frase-original');
        divFraseOriginal.innerHTML = `
            <div class="contenido-texto">
                <p>Texto de prueba para medir la altura real de una frase con contenido típico.</p>
            </div>
        `;
        tempContainer.appendChild(divFraseOriginal);

        // Crear línea de traducción de prueba (sin wrapper para coincidir con estructura real)
        const divTraduccionOriginal = document.createElement('div');
        divTraduccionOriginal.classList.add('frase-traduccion-original');
        divTraduccionOriginal.innerHTML = `<p class="texto-traduccion-original">Translation test text for measuring height.</p>`;
        tempContainer.appendChild(divTraduccionOriginal);

        // Forzar reflow para obtener medidas precisas
        void tempContainer.offsetHeight;
        
        // Calcular altura total de una frase completa (original + traducción)
        const alturaFraseCompleta = tempContainer.offsetHeight;
        
        // Limpiar elemento temporal
        zonaFrases.removeChild(tempContainer);

        // Validaciones de seguridad
        if (alturaFraseCompleta === 0 || isNaN(alturaFraseCompleta)) {
            return 1; // Si no se puede medir, retornar 1 como mínimo
        }

        // Calcular cuántas frases caben (redondeando hacia abajo para asegurar que todas caben)
        // Usar Math.floor para que siempre quepan todas las frases mostradas sin desbordarse
        const frasesQueCaben = Math.floor(alturaDisponible / alturaFraseCompleta);
        
        // Asegurar al menos 1 frase por página
        return Math.max(1, frasesQueCaben);
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

                    // Calcular dinámicamente cuántas frases caben en la pantalla actual
                    // Esto se adapta automáticamente al tamaño de pantalla y zoom
                    frasesPorPagina = calcularFrasesPorPagina();
                    
                    // Resetear a la primera página al cargar un nuevo texto
                    paginaActual = 0;
                    
                    // Mostrar la primera página
                    mostrarPagina(paginaActual);
                    
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
                paginaActual--;
                mostrarPagina(paginaActual);
            }
        });
    }

    // Listener para botón "Siguiente": avanza a la página siguiente si existe
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function() {
            if (paginaActual < totalPaginas - 1) {
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
});
