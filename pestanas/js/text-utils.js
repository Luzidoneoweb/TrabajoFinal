// text-utils.js - Utilidades para procesamiento de texto reutilizables

/**
 * Divide texto en fragmentos de máximo 20 palabras o hasta punto final
 * @param {string} texto - Texto a dividir
 * @param {number} limitePalabras - Máximo de palabras por fragmento
 * @returns {Array<string>} Array de frases divididas
 */
window.dividirEnFrases = function(texto, limitePalabras = 20) {
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
};

/**
 * Trunca texto a un máximo de palabras
 * @param {string} texto - Texto a truncar
 * @param {number} limitePalabras - Máximo de palabras
 * @returns {string} Texto truncado
 */
window.truncarTexto = function(texto, limitePalabras) {
    if (!texto || texto.trim() === '') return '';
    const palabras = texto.trim().split(/\s+/);
    if (palabras.length > limitePalabras) {
        return palabras.slice(0, limitePalabras).join(' ') + '...';
    }
    return texto.trim();
};
