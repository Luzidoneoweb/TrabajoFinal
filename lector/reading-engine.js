(function(){
  'use strict';

  const MotorLectura = {
    estado: 'inactivo', // 'inactivo' | 'reproduciendo' | 'pausado'
    indiceActual: 0,
    pronunciacion: null,

    obtenerVelocidad() {
      const input = document.getElementById('rate');
      const v = input ? parseFloat(input.value) : NaN;
      return Number.isFinite(v) ? v : 0.9;
    },

    parrafos() {
      const page = document.querySelector('.page.active');
      if (!page) {
        console.log('MotorLectura.parrafos(): No se encontró la página activa.');
        return [];
      }
      const paragraphs = Array.from(page.querySelectorAll('p.paragraph'));
      console.log('MotorLectura.parrafos(): Párrafos encontrados:', paragraphs.length);
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
      console.log('MotorLectura.hablar() llamado con texto:', text);
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        console.error('SpeechSynthesis no disponible. Asegúrate de que el navegador lo soporte.');
        this.detener();
        return;
      }
      console.log('SpeechSynthesis y SpeechSynthesisUtterance disponibles.');
      try { window.speechSynthesis.cancel(); } catch(e) { console.warn('Error al cancelar síntesis de voz anterior:', e); }
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

    hablarActual() {
      console.log('MotorLectura.hablarActual() llamado. Indice actual:', this.indiceActual);
      const paras = this.parrafos();
      if (!paras.length) {
        console.warn('MotorLectura.hablarActual(): No hay párrafos para leer. Deteniendo.');
        this.detener();
        return;
      }
      if (this.indiceActual < 0) this.indiceActual = 0;
      if (this.indiceActual >= paras.length) {
        console.log('MotorLectura.hablarActual(): Indice actual fuera de rango. Pasando al siguiente.');
        this.siguiente();
        return;
      }
      const p = paras[this.indiceActual];
      const text = p ? p.innerText.trim() : '';
      console.log('MotorLectura.hablarActual(): Texto del párrafo actual:', text);
      this.limpiarResaltado();
      this.resaltar(this.indiceActual);
      if (!text) {
        console.log('MotorLectura.hablarActual(): Párrafo vacío. Avanzando al siguiente.');
        this.indiceActual++;
        this.siguiente();
        return;
      }
      this.hablar(text);
    },

    siguiente() {
      const paras = this.parrafos();
      if (this.indiceActual < paras.length) {
        this.hablarActual();
        return;
      }
      // Pasar de página si existe botón siguiente
      const nextBtn = document.getElementById('next-page');
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click();
        setTimeout(() => {
          this.indiceActual = 0;
          this.hablarActual();
        }, 300);
      } else {
        this.detener();
      }
    },

    iniciar(startIndex) {
      // Elegir índice de inicio: preferir parámetro, luego índice actual, luego último guardado, luego 0
      if (typeof startIndex === 'number') {
        this.indiceActual = startIndex;
      } else if (typeof this.indiceActual === 'number' && this.indiceActual >= 0) {
        // mantener
      } else if (typeof window.lastReadParagraphIndex === 'number') {
        this.indiceActual = window.lastReadParagraphIndex;
      } else {
        this.indiceActual = 0;
      }
      this.estado = 'reproduciendo';
      console.log('MotorLectura.estado cambiado a:', this.estado);
      // Sincronizar flags globales
      try { window.isCurrentlyReading = true; window.isCurrentlyPaused = false; } catch(e) { console.warn('Error al sincronizar flags globales (isCurrentlyReading/isCurrentlyPaused):', e); }
      try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { console.warn('Error al llamar a updateFloatingButton:', e); }
      this.hablarActual();
    },

    pausar() {
      if (this.estado !== 'reproduciendo') return;
      this.estado = 'pausado';
      console.log('MotorLectura.estado cambiado a:', this.estado);
      try { window.isCurrentlyPaused = true; } catch(e) { console.warn('Error al sincronizar flag global (isCurrentlyPaused):', e); }
      try { window.speechSynthesis.cancel(); } catch(e) { console.warn('Error al cancelar síntesis de voz en pausa:', e); }
      try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { console.warn('Error al llamar a updateFloatingButton en pausa:', e); }
    },

    reanudar() {
      if (this.estado === 'pausado') {
        this.estado = 'reproduciendo';
        console.log('MotorLectura.estado cambiado a:', this.estado);
        try { window.isCurrentlyPaused = false; window.isCurrentlyReading = true; } catch(e) { console.warn('Error al sincronizar flags globales (isCurrentlyPaused/isCurrentlyReading) en reanudar:', e); }
        try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { console.warn('Error al llamar a updateFloatingButton en reanudar:', e); }
        this.hablarActual();
      } else if (this.estado === 'inactivo') {
        this.iniciar(this.indiceActual || 0);
      }
    },

    detener() {
      this.estado = 'inactivo';
      console.log('MotorLectura.estado cambiado a:', this.estado);
      try { window.speechSynthesis.cancel(); } catch(e) { console.warn('Error al cancelar síntesis de voz en detener:', e); }
      this.limpiarResaltado();
      // Sincronizar flags globales
      try { window.isCurrentlyReading = false; window.isCurrentlyPaused = false; } catch(e) { console.warn('Error al sincronizar flags globales (isCurrentlyReading/isCurrentlyPaused) en detener:', e); }
      try { if (typeof window.updateFloatingButton === 'function') window.updateFloatingButton(); } catch(e) { console.warn('Error al llamar a updateFloatingButton en detener:', e); }
    }
  };

  window.MotorLectura = MotorLectura;
  
  // Exponer controles SOLO si no existen (no pisar los de lector.js)
  if (typeof window.iniciarLectura !== 'function') {
    window.iniciarLectura = function() { MotorLectura.iniciar(0); };
  }
  if (typeof window.iniciarLecturaDesdeIndice !== 'function') {
  window.iniciarLecturaDesdeIndice = function(i) { MotorLectura.iniciar(typeof i === 'number' ? i : 0); };
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
