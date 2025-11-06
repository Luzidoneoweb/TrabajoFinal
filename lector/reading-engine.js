(function(){
  'use strict';

  const MotorLectura = {
    estado: 'inactivo', // 'inactivo' | 'reproduciendo' | 'pausado'
    indiceActual: 0,
    pronunciacion: null,
    lastPausedParagraphIndex: 0, // Nuevo: para guardar el índice del párrafo pausado
    lastPausedPageIndex: 0,      // Nuevo: para guardar el índice de la página pausada

    obtenerVelocidad() {
      const input = document.getElementById('rate');
      const v = input ? parseFloat(input.value) : NaN;
      return Number.isFinite(v) ? v : 0.9;
    },

    parrafos() {
      const page = document.querySelector('.page.active');
      if (!page) {
        // console.log('MotorLectura.parrafos(): No se encontró la página activa.'); // Eliminado para producción
        return [];
      }
      const paragraphs = Array.from(page.querySelectorAll('p.paragraph'));
      // console.log('MotorLectura.parrafos(): Párrafos encontrados:', paragraphs.length); // Eliminado para producción
      return paragraphs;
    },

    limpiarResaltado() {
      document.querySelectorAll('p.paragraph.reading-current').forEach(p => p.classList.remove('reading-current'));
    },

    resaltar(i) {
      const paras = this.parrafos();
      if (paras[i]) paras[i].classList.add('reading-current');
      // Guardar posición global para continuar luego
      try {
        window.lastReadParagraphIndex = i;
        const pages = Array.from(document.querySelectorAll('.page'));
        const activePage = document.querySelector('.page.active');
        const pageIdx = pages.indexOf(activePage);
        if (pageIdx >= 0) window.lastReadPageIndex = pageIdx;
      } catch(e) {}
    },

    hablar(text) {
      // console.log('MotorLectura.hablar() llamado con texto:', text); // Eliminado para producción
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        console.error('SpeechSynthesis no disponible. Asegúrate de que el navegador lo soporte.');
        this.detener();
        return;
      }
      // console.log('SpeechSynthesis y SpeechSynthesisUtterance disponibles.'); // Eliminado para producción
      try { window.speechSynthesis.cancel(); } catch(e) { /* console.warn('Error al cancelar síntesis de voz anterior:', e); */ }
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = this.obtenerVelocidad();
      utt.pitch = 1.0;
      utt.volume = 1.0;
      utt.lang = 'en-GB';
      utt.onend = () => {
        if (this.estado !== 'reproduciendo') return;
        this.indiceActual++;
        this.siguiente();
      };
      utt.onerror = (e) => {
        // Si fue "interrupted/canceled" por usuario, no avanzar automáticamente
        if (this.estado !== 'reproduciendo') return;
        if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
        this.indiceActual++;
        this.siguiente();
      };
      this.pronunciacion = utt;
      window.speechSynthesis.speak(utt);
    },

    async hablarActual() {
      const paras = this.parrafos();
      if (!paras.length) {
        console.warn('MotorLectura.hablarActual(): No hay párrafos para leer. Deteniendo.');
        this.detener();
        return;
      }
      if (this.indiceActual < 0) this.indiceActual = 0;
      if (this.indiceActual >= paras.length) {
        this.siguiente();
        return;
      }
      
      const p = paras[this.indiceActual];
      const text = p ? p.innerText.trim() : '';
      
      if (!text) {
        this.indiceActual++;
        this.siguiente();
        return;
      }

      // Limpiar resaltado y resaltar el párrafo actual
      this.limpiarResaltado();
      this.resaltar(this.indiceActual);

      // Mostrar traducción simultáneamente ANTES de empezar a hablar
      if (window.todasLasFrasesOriginales && window.currentTextId) {
        const indiceGlobal = window.paginaActual * window.frasesPorPagina + this.indiceActual;
        const fraseOriginal = window.todasLasFrasesOriginales[indiceGlobal];
        
        // Buscar el elemento de traducción: desde .paragraph -> .frase-original -> siguiente .frase-traduccion-original -> .texto-traduccion-original
        const fraseOriginalDiv = p.closest('.frase-original');
        const divTraduccion = fraseOriginalDiv ? fraseOriginalDiv.nextElementSibling : null;
        const pTraduccion = divTraduccion ? divTraduccion.querySelector('.texto-traduccion-original') : null;

        if (pTraduccion && fraseOriginal) {
          // Primero verificar si ya tenemos la traducción en el array
          let traduccionFrase = window.todasLasFrasesTraduccion[indiceGlobal];
          
          // Si no está en el array, verificar el caché
          if (!traduccionFrase && window.contentTranslationsCache && window.contentTranslationsCache[fraseOriginal]) {
            traduccionFrase = window.contentTranslationsCache[fraseOriginal];
            window.todasLasFrasesTraduccion[indiceGlobal] = traduccionFrase;
          }
          
          // Si aún no hay traducción, traducir ahora
          if (!traduccionFrase && typeof window.traducirFrase === 'function') {
            traduccionFrase = await window.traducirFrase(fraseOriginal, window.currentTextId);
            if (traduccionFrase) {
              window.todasLasFrasesTraduccion[indiceGlobal] = traduccionFrase;
              if (typeof window.guardarTextoCompletoTraducido === 'function') {
                window.guardarTextoCompletoTraducido();
              }
            }
          }
          console.log(`DEBUG: Frase Original (Índice Global ${indiceGlobal}):`, fraseOriginal);
          console.log(`DEBUG: Elemento de Traducción (pTraduccion):`, pTraduccion);
          console.log(`DEBUG: Traducción obtenida (traduccionFrase):`, traduccionFrase);
          
          // Mostrar la traducción justo antes de empezar a leer
          pTraduccion.textContent = traduccionFrase || '';
        }
      }

      // Iniciar la lectura después de mostrar la traducción
      this.hablar(text);
    },

    siguiente() {
      const paras = this.parrafos();
      if (this.indiceActual < paras.length) {
        this.hablarActual();
        return;
      }
      // Pasar de página si existe botón siguiente
      const nextBtn = document.querySelector('.btn-siguiente');
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click();
        setTimeout(() => {
          this.indiceActual = 0;
          this.hablarActual();
        }, 300);
      } else {
        this.finalizarLecturaNatural();
      }
    },

    async iniciar(startIndex) {
      // Elegir índice de inicio:
      // 1. Preferir el parámetro `startIndex` si se proporciona.
      // 2. Si no, y hay una posición pausada guardada, usarla.
      // 3. Si no, y hay una última posición leída global, usarla.
      // 4. Si no, iniciar desde 0.
      if (typeof startIndex === 'number') {
        this.indiceActual = startIndex;
      } else if (this.lastPausedPageIndex !== 0 || this.lastPausedParagraphIndex !== 0) {
        // Si hay una posición pausada, ir a esa página y párrafo
        if (window.paginaActual !== this.lastPausedPageIndex) {
          window.paginaActual = this.lastPausedPageIndex;
          await window.mostrarPagina(window.paginaActual);
          // Esperar un breve momento para que el DOM se actualice
          setTimeout(() => {
            this.indiceActual = this.lastPausedParagraphIndex;
            this.hablarActual();
          }, 100);
          return; // Salir para evitar doble llamada a hablarActual
        } else {
          this.indiceActual = this.lastPausedParagraphIndex;
        }
      } else if (typeof window.lastReadParagraphIndex === 'number') {
        this.indiceActual = window.lastReadParagraphIndex;
      } else {
        this.indiceActual = 0;
      }
      
      this.estado = 'reproduciendo';
      // console.log('MotorLectura.estado cambiado a:', this.estado); // Eliminado para producción
      // Sincronizar flags globales
      try { window.isCurrentlyReading = true; window.isCurrentlyPaused = false; } catch(e) { /* console.warn('Error al sincronizar flags globales (isCurrentlyReading/isCurrentlyPaused):', e); */ }
      try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { /* console.warn('Error al llamar a updateFloatingButton:', e); */ }
      this.hablarActual();
    },

    pausar() {
      if (this.estado !== 'reproduciendo') return;
      this.estado = 'pausado';
      // Guardar la posición actual al pausar
      this.lastPausedParagraphIndex = this.indiceActual;
      this.lastPausedPageIndex = window.paginaActual;
      // console.log('MotorLectura.estado cambiado a:', this.estado, 'Pausado en párrafo:', this.lastPausedParagraphIndex, 'página:', this.lastPausedPageIndex); // Eliminado para producción
      try { window.isCurrentlyPaused = true; } catch(e) { /* console.warn('Error al sincronizar flag global (isCurrentlyPaused):', e); */ }
      try { window.speechSynthesis.cancel(); } catch(e) { /* console.warn('Error al cancelar síntesis de voz en pausa:', e); */ }
      try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { /* console.warn('Error al llamar a updateFloatingButton en pausa:', e); */ }
    },

    async reanudar() {
      if (this.estado === 'pausado') {
        this.estado = 'reproduciendo';
        // console.log('MotorLectura.estado cambiado a:', this.estado, 'Reanudando desde párrafo:', this.lastPausedParagraphIndex, 'página:', this.lastPausedPageIndex); // Eliminado para producción
        try { window.isCurrentlyPaused = false; window.isCurrentlyReading = true; } catch(e) { /* console.warn('Error al sincronizar flags globales (isCurrentlyReading/isCurrentlyPaused) en reanudar:', e); */ }
        try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { /* console.warn('Error al llamar a updateFloatingButton en reanudar:', e); */ }
        
        // Reanudar desde la posición guardada
        if (window.paginaActual !== this.lastPausedPageIndex) {
          window.paginaActual = this.lastPausedPageIndex;
          await window.mostrarPagina(window.paginaActual);
          // Esperar un breve momento para que el DOM se actualice
          setTimeout(() => {
            this.indiceActual = this.lastPausedParagraphIndex;
            this.hablarActual();
          }, 100);
        } else {
          this.indiceActual = this.lastPausedParagraphIndex;
          this.hablarActual();
        }
      } else if (this.estado === 'inactivo') {
        // Si estaba inactivo, iniciar desde la última posición pausada o 0
        this.iniciar(this.lastPausedParagraphIndex);
      }
    },

    detener() {
      this.estado = 'inactivo';
      // console.log('MotorLectura.estado cambiado a:', this.estado); // Eliminado para producción
      try { window.speechSynthesis.cancel(); } catch(e) { /* console.warn('Error al cancelar síntesis de voz en detener:', e); */ }
      this.limpiarResaltado();
      // Sincronizar flags globales
      try { window.isCurrentlyReading = false; window.isCurrentlyPaused = false; } catch(e) { /* console.warn('Error al sincronizar flags globales (isCurrentlyReading/isCurrentlyPaused) en detener:', e); */ }
      try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { /* console.warn('Error al llamar a updateFloatingButton en detener:', e); */ }

      // Ocultar botones de final de lectura y mostrar controles
      const botonesFinalLectura = document.querySelector('.botones-final-lectura');
      const controlesLectura = document.querySelector('.controles-lectura');
      const paginacion = document.querySelector('.paginacion');
      const btnPlay = document.querySelector('.btn-play');

      if (botonesFinalLectura) botonesFinalLectura.style.display = 'none';
      if (controlesLectura) controlesLectura.style.display = 'grid'; // O el display original
      if (paginacion) paginacion.style.display = 'flex'; // O el display original
      if (btnPlay) btnPlay.style.display = 'block'; // O el display original
    },

    finalizarLecturaNatural() {
      this.estado = 'inactivo';
      try { window.speechSynthesis.cancel(); } catch(e) { /* console.warn('Error al cancelar síntesis de voz en finalizarLecturaNatural:', e); */ }
      this.limpiarResaltado();
      try { window.isCurrentlyReading = false; window.isCurrentlyPaused = false; } catch(e) { /* console.warn('Error al sincronizar flags globales en finalizarLecturaNatural:', e); */ }
      try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { /* console.warn('Error al llamar a updateFloatingButton en finalizarLecturaNatural:', e); */ }

      // Mostrar botones de final de lectura y ocultar controles
      const botonesFinalLectura = document.querySelector('.botones-final-lectura');
      const controlesLectura = document.querySelector('.controles-lectura');
      const paginacion = document.querySelector('.paginacion');
      const btnPlay = document.querySelector('.btn-play');

      if (botonesFinalLectura) botonesFinalLectura.style.display = 'flex';
      if (controlesLectura) controlesLectura.style.display = 'none';
      if (paginacion) paginacion.style.display = 'none';
      if (btnPlay) btnPlay.style.display = 'block';
    }
  };

  window.MotorLectura = MotorLectura;
  
  // Exponer controles SOLO si no existen (no pisar los de lector.js)
  if (typeof window.iniciarLectura !== 'function') {
    window.iniciarLectura = function() { 
      MotorLectura.iniciar(0); 
      // Ocultar botones de final de lectura al iniciar
      const botonesFinalLectura = document.querySelector('.botones-final-lectura');
      if (botonesFinalLectura) botonesFinalLectura.style.display = 'none';
    };
  }
  if (typeof window.iniciarLecturaDesdeIndice !== 'function') {
  window.iniciarLecturaDesdeIndice = function(i) { 
    MotorLectura.iniciar(typeof i === 'number' ? i : 0); 
    // Ocultar botones de final de lectura al iniciar
    const botonesFinalLectura = document.querySelector('.botones-final-lectura');
    if (botonesFinalLectura) botonesFinalLectura.style.display = 'none';
  };
  }
  if (typeof window.pausarVoz !== 'function') {
  window.pausarVoz = function() { MotorLectura.pausar(); };
  }
  if (typeof window.reanudarVoz !== 'function') {
  window.reanudarVoz = function() { MotorLectura.reanudar(); };
  }
  if (typeof window.detenerLectura !== 'function') {
    window.detenerLectura = function() { MotorLectura.detener(); };
  }
  
})();
