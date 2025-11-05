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

        const response = await fetch('traducion_api/translate.php', {
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

        await fetch('traducion_api/save_content_translation.php', {
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
        const response = await fetch(`traducion_api/get_content_translation.php?text_id=${textId}`, {
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

// Exportar funciones para uso global
window.traducirFrase = traducirFrase;
window.guardarTraduccionEnBD = guardarTraduccionEnBD;
window.cargarCacheTraducciones = cargarCacheTraducciones;
