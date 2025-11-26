// ============================================
// FUNCIONES DE TRADUCCIÓN PARA LECTURA
// ============================================
// Este archivo contiene las funciones para traducir frases durante la lectura
// y gestionar el caché de traducciones

// Inicializar caché global de traducciones
window.contentTranslationsCache = window.contentTranslationsCache || {};

/**
 * Traduce una frase usando la API de traducción
 * Verifica caché primero, luego traduce y guarda en caché y BD
 * @param {string} fraseOriginal - La frase original a traducir
 * @param {number} textId - ID del texto al que pertenece la frase
 * @returns {Promise<string>} - La traducción de la frase
 */
async function traducirFrase(fraseOriginal, textId) {
    // Verificar caché local primero
    if (window.contentTranslationsCache && window.contentTranslationsCache[fraseOriginal]) {
        return window.contentTranslationsCache[fraseOriginal];
    }

    try {
        // Traducir usando la API
        const formData = new URLSearchParams();
        formData.append('word', fraseOriginal);
        const baseUrl = window.API_BASE_URL || '/trabajoFinal/';

        const response = await fetch(baseUrl + 'traducion_api/translate.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.translation) {
            // Guardar en caché local
            if (!window.contentTranslationsCache) {
                window.contentTranslationsCache = {};
            }
            window.contentTranslationsCache[fraseOriginal] = data.translation;

            // Guardar en base de datos (asíncrono, no esperar)
            if (textId) {
                guardarTraduccionEnBD(textId, fraseOriginal, data.translation);
            }

            return data.translation;
        } else {
            console.warn('No se recibió traducción para:', fraseOriginal);
            return '';
        }
    } catch (error) {
        console.error('Error al traducir frase:', error);
        return '';
    }
}

/**
 * Guarda una traducción en la base de datos
 * @param {number} textId - ID del texto
 * @param {string} content - Contenido original
 * @param {string} translation - Traducción
 * @returns {Promise<void>}
 */
async function guardarTraduccionEnBD(textId, content, translation) {
    try {
        const formData = new URLSearchParams();
        formData.append('text_id', textId);
        formData.append('content', content);
        formData.append('translation', translation);
        const baseUrl = window.API_BASE_URL || '/trabajoFinal/';

        await fetch(baseUrl + 'traducion_api/save_content_translation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: formData
        });
        // No esperamos respuesta, solo enviamos
    } catch (error) {
        console.error('Error al guardar traducción en BD:', error);
    }
}

/**
 * Carga el caché de traducciones desde la base de datos
 * @param {number} textId - ID del texto
 * @returns {Promise<void>}
 */
async function cargarCacheTraducciones(textId) {
    if (!textId) return;

    try {
        const baseUrl = window.API_BASE_URL || '/trabajoFinal/';
        const response = await fetch(baseUrl + `traducion_api/get_content_translation.php?text_id=${textId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.translation && Array.isArray(data.translation)) {
            // Inicializar caché si no existe
            if (!window.contentTranslationsCache) {
                window.contentTranslationsCache = {};
            }

            // Cargar traducciones en el caché
            data.translation.forEach(item => {
                if (item.content && item.translation) {
                    window.contentTranslationsCache[item.content] = item.translation;
                }
            });

            console.log('Caché de traducciones cargado:', Object.keys(window.contentTranslationsCache).length, 'traducciones');
        }
    } catch (error) {
        console.error('Error al cargar caché de traducciones:', error);
    }
}

/**
 * Traduce el título de un texto y lo guarda en la base de datos
 * @param {string} title - El título original
 * @param {number} textId - ID del texto
 * @returns {Promise<string>} - La traducción del título
 */
async function traducirTitulo(title, textId) {
    if (!title || !title.trim()) {
        return '';
    }

    try {
        // Traducir usando la API
        const formData = new URLSearchParams();
        formData.append('word', title);
        const baseUrl = window.API_BASE_URL || '/trabajoFinal/';

        const response = await fetch(baseUrl + 'traducion_api/translate.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.translation) {
            // Guardar la traducción del título en la base de datos
            if (textId) {
                await guardarTraduccionTituloEnBD(textId, title, data.translation);
            }

            return data.translation;
        } else {
            console.warn('No se recibió traducción para el título:', title);
            return '';
        }
    } catch (error) {
        console.error('Error al traducir título:', error);
        return '';
    }
}

/**
 * Guarda la traducción del título en la base de datos
 * @param {number} textId - ID del texto
 * @param {string} title - Título original
 * @param {string} translation - Traducción del título
 * @returns {Promise<void>}
 */
async function guardarTraduccionTituloEnBD(textId, title, translation) {
    try {
        const formData = new URLSearchParams();
        formData.append('text_id', textId);
        formData.append('title', title);
        formData.append('title_translation', translation);
        const baseUrl = window.API_BASE_URL || '/trabajoFinal/';

        const response = await fetch(baseUrl + 'traducion_api/save_title_translation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Traducción del título guardada correctamente:', data.message);
        } else {
            console.error('Error al guardar traducción del título:', data.error);
        }
    } catch (error) {
        console.error('Error al guardar traducción del título en BD:', error);
    }
}

/**
 * Guarda la traducción completa del contenido en la base de datos
 * @param {number} textId - ID del texto
 * @param {string} contentTranslation - Traducción completa del contenido
 * @returns {Promise<void>}
 */
async function guardarTraduccionCompletaEnBD(textId, contentTranslation) {
    if (!textId || !contentTranslation) {
        console.warn('Faltan parámetros para guardar traducción completa:', { textId, contentTranslation });
        return;
    }

    try {
        const formData = new URLSearchParams();
        formData.append('text_id', textId);
        formData.append('content_translation', contentTranslation);
        const baseUrl = window.API_BASE_URL || '/trabajoFinal/';

        const response = await fetch(baseUrl + 'traducion_api/save_complete_translation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Traducción completa guardada correctamente:', data.message, 'Filas afectadas:', data.rows_affected);
        } else {
            console.error('Error al guardar traducción completa:', data.error);
        }
    } catch (error) {
        console.error('Error al guardar traducción completa en BD:', error);
    }
}

/**
 * Construye el texto completo traducido a partir de un array de frases traducidas
 * @param {Array<string>} frasesTraduccion - Array con todas las frases traducidas
 * @returns {string} - Texto completo traducido
 */
function construirTextoCompletoTraducido(frasesTraduccion) {
    // Filtrar frases vacías y unirlas con espacios
    return frasesTraduccion
        .filter(frase => frase && frase.trim().length > 0)
        .join(' ')
        .trim();
}

// Exportar funciones para uso global
window.traducirFrase = traducirFrase;
window.guardarTraduccionEnBD = guardarTraduccionEnBD;
window.cargarCacheTraducciones = cargarCacheTraducciones;
window.traducirTitulo = traducirTitulo;
window.guardarTraduccionTituloEnBD = guardarTraduccionTituloEnBD;
window.guardarTraduccionCompletaEnBD = guardarTraduccionCompletaEnBD;
window.construirTextoCompletoTraducido = construirTextoCompletoTraducido;
