// electron-voice-integration.js
// Sistema unificado de ResponsiveVoice para web y Electron
// Evita conflictos de variables y proporciona una API consistente

(function() {
    'use strict';
    // console.log('electron-voice-integration.js: Script iniciado.'); // Eliminado para producción

    // Silenciar logs verbosos del script ResponsiveVoice sin afectar el resto
    (function setupRVLogSilencer(){
        try {
            const __orig = {
                log: console.log,
                info: console.info,
                warn: console.warn
            };
            const shouldMute = (args) => {
                if (!args || !args.length) return false;
                const s = args[0];
                if (typeof s !== 'string') return false;
                // Mensajes típicos del loader de ResponsiveVoice
                if (s.startsWith('ResponsiveVoice')) return true; // "ResponsiveVoice r1.8.4"
                if (s.startsWith('RV: ')) return true;           // "RV: Voice support ready"
                if (s === 'Prerender: false') return true;
                if (s === 'isHidden: false') return true;
                return false;
            };
            console.log = function(...args){ if (shouldMute(args)) return; return __orig.log.apply(console, args); };
            console.info = function(...args){ if (shouldMute(args)) return; return __orig.info.apply(console, args); };
            console.warn = function(...args){ if (shouldMute(args)) return; return __orig.warn.apply(console, args); };
            // Permitir restaurar si fuera necesario
            window.__rvConsoleSilencer = __orig;
        } catch(e) { /* silencioso */ }
    })();

    // Variables privadas para evitar conflictos
    let _vozCargada = false;
    let _esElectron = false;
    let _claveAPI = 'wJGiW37b';
    let _scriptCargado = false;
    let _promesaInicializacion = null;
    
    // Función para cargar scripts dinámicamente
    function cargarScript(src, callback) {
        // Evitar cargar el mismo script múltiples veces
        if (_scriptCargado) {
            if (callback) callback();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            _scriptCargado = true;
            if (callback) callback();
        };
        script.onerror = () => {
            // Error al cargar script externo (silencioso)
        };
        document.head.appendChild(script);
    }

    // Función para verificar si estamos en Electron
    function detectarElectron() {
        _esElectron = window.electronAPI !== undefined;
        return _esElectron;
    }

        // Función principal de inicialización
    function inicializarVoz() {
        detectarElectron();
        // console.log('inicializarVoz() llamado. _esElectron:', _esElectron); // Eliminado para producción

        // Verificar si ResponsiveVoice ya está cargado
        if (typeof responsiveVoice !== 'undefined') {
            _vozCargada = true;
            // console.log('ResponsiveVoice ya está cargado. _vozCargada = true.'); // Eliminado para producción
            configurarFuncionesVoz();
            return Promise.resolve();
        }

        // Cargar ResponsiveVoice desde CDN
        return new Promise((resolve) => {
            cargarScript(`https://code.responsivevoice.org/responsivevoice.js?key=${_claveAPI}`, () => {
                _vozCargada = true;
                // console.log('ResponsiveVoice cargado desde CDN. _vozCargada = true.'); // Eliminado para producción
                configurarFuncionesVoz();
                resolve();
            });
        });
    }

    // Configurar funciones de voz globales
    function configurarFuncionesVoz() {
        // console.log('configurarFuncionesVoz() llamado.'); // Eliminado para producción
        // Función principal para leer texto
        window.leerTexto = function(texto, velocidad = 1.0, callbacks = {}) {
            // console.log('window.leerTexto() llamado con texto:', texto); // Eliminado para producción
            if (typeof responsiveVoice !== 'undefined' && _vozCargada) {
                const config = {
                    VOICE: 'UK English Female',
                    RATE: velocidad,
                    PITCH: 1.0,
                    VOLUME: 1.0
                };
                
                const options = {
                    rate: config.RATE,
                    pitch: config.PITCH,
                    volume: config.VOLUME
                };
                if (typeof callbacks.onstart === 'function') options.onstart = callbacks.onstart;
                if (typeof callbacks.onend === 'function') options.onend = callbacks.onend;
                if (typeof callbacks.onpause === 'function') options.onpause = callbacks.onpause;
                if (typeof callbacks.onresume === 'function') options.onresume = callbacks.onresume;
                if (typeof callbacks.onerror === 'function') options.onerror = callbacks.onerror;
                
                responsiveVoice.speak(texto, config.VOICE, options);
                // console.log('responsiveVoice.speak() llamado.'); // Eliminado para producción
                return true;
            } else {
                console.warn('responsiveVoice no disponible o no cargado.');
                return false;
            }
        };

        // Función para detener la lectura
        window.detenerLectura = function() {
            // console.log('window.detenerLectura() llamado.'); // Eliminado para producción
            if (typeof responsiveVoice !== 'undefined' && _vozCargada) {
                responsiveVoice.cancel();
                // console.log('responsiveVoice.cancel() llamado.'); // Eliminado para producción
                return true;
            }
            return false;
        };

        // Función para verificar si está leyendo
        window.estaLeyendo = function() {
            if (typeof responsiveVoice !== 'undefined' && _vozCargada) {
                return responsiveVoice.isPlaying();
            }
            return false;
        };

        // Función para pausar
        window.pausarLectura = function() {
            if (typeof responsiveVoice !== 'undefined' && _vozCargada) {
                responsiveVoice.pause();
                return true;
            }
            return false;
        };

        // Función para reanudar
        window.reanudarLectura = function() {
            if (typeof responsiveVoice !== 'undefined' && _vozCargada) {
                responsiveVoice.resume();
                return true;
            }
            return false;
        };

        // Función para cambiar velocidad
        window.cambiarVelocidad = function(nuevaVelocidad) {
            // Implementación futura si es necesario ajustar en caliente
            return true;
        };

        // Función para obtener voces disponibles
        window.obtenerVoces = function() {
            if (typeof responsiveVoice !== 'undefined' && _vozCargada) {
                return responsiveVoice.getVoices();
            }
            return [];
        };
    }

    // Función para verificar el estado del sistema
    window.obtenerEstadoVoz = function() {
        const estado = {
            entorno: _esElectron ? "Electron" : "Web",
            responsiveVoiceDisponible: typeof responsiveVoice !== 'undefined',
            vozCargada: _vozCargada,
            scriptCargado: _scriptCargado,
            claveAPI: _claveAPI,
            funcionesDisponibles: {
                leerTexto: typeof window.leerTexto === 'function',
                detener: typeof window.detenerLectura === 'function',
                estaLeyendo: typeof window.estaLeyendo === 'function',
                pausar: typeof window.pausarLectura === 'function',
                reanudar: typeof window.reanudarLectura === 'function'
            }
        };
        // console.log('Estado del sistema de voz:', estado); // Eliminado para producción
        return estado;
    };

    // Función para obtener una promesa de inicialización
    window.obtenerSistemaVozListo = function() {
        if (!_promesaInicializacion) {
            _promesaInicializacion = inicializarVoz();
        }
        return _promesaInicializacion;
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarVoz);
    } else {
        inicializarVoz();
    }

})();
