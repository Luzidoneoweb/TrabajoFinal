// voice-test.js
// Script de prueba para verificar el sistema de voz unificado

// Función para probar el sistema de voz
async function probarSistemaVoz() {
    // Esperar a que el sistema esté listo
    if (typeof window.obtenerSistemaVozListo === 'function') {
        await window.obtenerSistemaVozListo();
    }
    
    // Verificar estado
    if (typeof window.obtenerEstadoVoz === 'function') {
        const estado = window.obtenerEstadoVoz();
        
        if (estado.responsiveVoiceDisponible) {
            // Probar funciones básicas
            if (typeof window.leerTexto === 'function') {
                const textoPrueba = "Hello, this is a test of the voice system.";
                window.leerTexto(textoPrueba, 1.0);
            }
            
            // Verificar voces disponibles
            if (typeof window.obtenerVoces === 'function') {
                void window.obtenerVoces();
            }
        }
    }
}

// Función para mostrar información del entorno
function mostrarInfoEntorno() {
    // Información disponible vía funciones; evitamos logs
    return {
        electron: typeof window.electronAPI !== 'undefined',
        responsiveVoice: typeof responsiveVoice !== 'undefined',
        config: typeof window.RESPONSIVE_VOICE_CONFIG !== 'undefined'
    };
}

// Ejecutar pruebas cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(probarSistemaVoz, 1000); // Esperar un poco para que se cargue todo
    });
} else {
    setTimeout(probarSistemaVoz, 1000);
}

// Exponer función de prueba globalmente
window.probarSistemaVoz = probarSistemaVoz;
window.mostrarInfoEntorno = mostrarInfoEntorno;
