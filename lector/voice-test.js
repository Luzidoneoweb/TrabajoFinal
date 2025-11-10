// voice-test.js - Pruebas del sistema de voz
async function probarSistemaVoz() {
    if (typeof window.obtenerSistemaVozListo === 'function') {
        await window.obtenerSistemaVozListo();
    }
    if (typeof window.obtenerEstadoVoz === 'function') {
        const estado = window.obtenerEstadoVoz();
        if (estado.responsiveVoiceDisponible && typeof window.leerTexto === 'function') {
            window.leerTexto("Hello, this is a test of the voice system.", 1.0);
        }
    }
}

// Información del entorno
function mostrarInfoEntorno() {
    return {
        electron: typeof window.electronAPI !== 'undefined',
        responsiveVoice: typeof responsiveVoice !== 'undefined',
        config: typeof window.RESPONSIVE_VOICE_CONFIG !== 'undefined'
    };
}

// Ejecutar pruebas al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(probarSistemaVoz, 1000));
} else {
    setTimeout(probarSistemaVoz, 1000);
}

window.probarSistemaVoz = probarSistemaVoz;
window.mostrarInfoEntorno = mostrarInfoEntorno;
