/**
 * SISTEMA DE SELECCIÓN MÚLTIPLE DE PALABRAS
 * Similar a Readlang - permite seleccionar múltiples palabras para traducir
 */

class MultiWordSelector {
    constructor() {
        this.isSelecting = false;
        this.selectedWords = [];
        this.startElement = null;
        this.endElement = null;
        this.selectionHighlight = null;
        this.tooltip = null;
        this.hasDragged = false;
        this.startPosition = null;
        
        this.init();
    }
    
    init() {
        // Agregar estilos CSS para la selección
        this.addStyles();
        
        // Event listeners para selección usando arrow functions para mantener el contexto
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Limpiar selección al hacer clic fuera (pero no en palabras clickeables)
        document.addEventListener('click', (e) => this.onDocumentClick(e));
        
        // Debug: Verificar inicialización
        console.log('MultiWordSelector inicializado');
    }
    
    addStyles() {
        // Verificar si ya se añadieron los estilos
        if (document.getElementById('multi-word-selector-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'multi-word-selector-styles';
        style.textContent = `
            .word-selection { background: rgba(74,144,226,0.2) !important; border-radius: 3px; transition: background 0.2s ease; }
            .word-selection-start { background: rgba(74,144,226,0.35) !important; border-left: 2px solid #4a90e2; }
            .word-selection-end { background: rgba(74,144,226,0.35) !important; border-right: 2px solid #4a90e2; }
        `;
        document.head.appendChild(style);
    }
    
    onMouseDown(event) {
        const target = event.target;
        
        // Ignorar completamente elementos de interfaz y formularios
        if (target.closest('.dropdown, .select, .menu, .modal, .popup, .tooltip, .practice-menu, .text-selector, .text-select, select, option, optgroup, textarea, input, button, form, .upload-form-container, .tab-navigation')) {
            return;
        }
        
        // Solo activar en palabras clickeables
        if (!target.classList.contains('clickable-word') && 
            !target.classList.contains('practice-word') &&
            !target.closest('.reading-area, .text-example')) {
            return;
        }
        
        // Debug: MouseDown en elemento clickeable
        
        this.isSelecting = true;
        this.startElement = target;
        this.hasDragged = false;
        this.startPosition = { x: event.clientX, y: event.clientY };
        
        // Limpiar selecciones anteriores
        this.clearSelection();
        
        event.preventDefault();
    }
    
    onMouseMove(event) {
        if (!this.isSelecting) return;
        
        const target = event.target;
        
        // Ignorar elementos de interfaz y formularios
        if (target.closest('.dropdown, .select, .menu, .modal, .popup, .tooltip, .practice-menu, .text-selector, .text-select, select, option, optgroup, textarea, input, button, form, .upload-form-container, .tab-navigation')) {
            return;
        }
        
        // Solo procesar palabras clickeables
        if (!target.classList.contains('clickable-word') && 
            !target.classList.contains('practice-word') &&
            !target.closest('.reading-area, .text-example')) {
            return;
        }
        
        // Detectar si el usuario está arrastrando
        if (this.startPosition) {
            const distance = Math.sqrt(
                Math.pow(event.clientX - this.startPosition.x, 2) + 
                Math.pow(event.clientY - this.startPosition.y, 2)
            );
            
            if (distance > 5) { // Si se movió más de 5 píxeles
                this.hasDragged = true;
            }
        }
        
        if (target !== this.endElement) {
            this.endElement = target;
            this.updateSelection();
        }
    }
    
    onMouseUp(event) {
        if (!this.isSelecting) return;
        
        const target = event.target;
        
        // Ignorar elementos de interfaz
        if (target.closest('.dropdown, .select, .menu, .modal, .popup, .tooltip, .practice-menu, .text-selector, .text-select, select, option, optgroup')) {
            this.isSelecting = false;
            return;
        }
        
        // Solo procesar si el elemento final es clickeable
        if (!target.classList.contains('clickable-word') && 
            !target.classList.contains('practice-word')) {
            this.isSelecting = false;
            return;
        }
        
        this.endElement = target;
        
        // Debug: MouseUp completado
        
        // Si el usuario no arrastró, es un clic simple
        if (!this.hasDragged) {
            // Para clic simple, traducir la palabra individual
            const wordText = target.textContent.trim();
            console.log('Clic simple en palabra:', wordText);
            this.selectedWords = [target];
            this.highlightWord(target, 'single');
            this.translateSelection();
            this.isSelecting = false;
            return;
        }
        
        // Si el usuario arrastró, es una selección múltiple
        this.updateSelection();
        this.translateSelection();
        
        this.isSelecting = false;
    }
    
    onDocumentClick(event) {
        // Si se hace clic fuera de la selección y del tooltip, limpiar
        const clickedWord = event.target.closest('.clickable-word, .word-clickable');
        const clickedTooltip = event.target.closest('.multi-word-tooltip');
        
        // Si se hace clic en una palabra clickeable o en el tooltip, no limpiar
        // (el clic en palabra ya se maneja en onMouseUp)
        if (clickedWord || clickedTooltip) {
            return;
        }
        
        // Si se hace clic fuera, limpiar selección y tooltip
        this.clearSelection();
        this.hideTooltip();
    }
    
    detectAdjacentWords(clickedWord) {
        const container = clickedWord.closest('.reading-area, .practice-area, .text-example, p');
        
        if (!container) {
            this.selectedWords = [clickedWord];
            this.highlightWord(clickedWord, 'single');
            this.translateSelection();
            return;
        }
        
        const allWords = Array.from(container.querySelectorAll('.word-clickable, .practice-word'));
        const clickedIndex = allWords.indexOf(clickedWord);
        
        if (clickedIndex === -1) {
            this.selectedWords = [clickedWord];
            this.highlightWord(clickedWord, 'single');
            this.translateSelection();
            return;
        }
        
        // Buscar palabras adyacentes que formen una expresión común
        const adjacentWords = this.findAdjacentExpression(allWords, clickedIndex);
        
        if (adjacentWords.length > 1) {
            this.selectedWords = adjacentWords;
            this.highlightSelection(adjacentWords);
            this.translateSelection();
        } else if (adjacentWords.length === 1) {
            this.selectedWords = adjacentWords;
            this.highlightWord(adjacentWords[0], 'single');
            this.translateSelection();
        }
    }
    
    findAdjacentExpression(allWords, clickedIndex) {
        const clickedWord = allWords[clickedIndex];
        const clickedText = clickedWord.textContent.trim().toLowerCase();
        
        // Lista de expresiones comunes en inglés
        const commonExpressions = [
            'look up', 'give up', 'take care', 'get up', 'sit down', 'come on',
            'go on', 'come in', 'go out', 'come back', 'go back', 'come over',
            'go over', 'come through', 'go through', 'come across', 'go across',
            'come along', 'go along', 'come around', 'go around', 'come by',
            'go by', 'come down', 'go down', 'come from', 'go from', 'come into',
            'go into', 'come off', 'go off', 'come on', 'go on', 'come out',
            'go out', 'come over', 'go over', 'come through', 'go through',
            'come to', 'go to', 'come up', 'go up', 'come with', 'go with',
            'look after', 'look for', 'look into', 'look out', 'look over',
            'look through', 'look up to', 'look down on', 'look forward to',
            'give in', 'give out', 'give away', 'give back', 'give off',
            'take away', 'take back', 'take down', 'take in', 'take off',
            'take on', 'take out', 'take over', 'take up', 'take down',
            'get away', 'get back', 'get down', 'get in', 'get off', 'get on',
            'get out', 'get over', 'get through', 'get up', 'get with',
            'put away', 'put back', 'put down', 'put in', 'put off', 'put on',
            'put out', 'put through', 'put up', 'put with', 'put down',
            'make up', 'make out', 'make over', 'make off', 'make for',
            'break down', 'break in', 'break off', 'break out', 'break up',
            'bring about', 'bring along', 'bring around', 'bring back',
            'bring down', 'bring in', 'bring off', 'bring on', 'bring out',
            'bring over', 'bring through', 'bring up', 'bring with',
            'call back', 'call down', 'call for', 'call in', 'call off',
            'call on', 'call out', 'call over', 'call up', 'call with',
            'carry away', 'carry back', 'carry down', 'carry in', 'carry off',
            'carry on', 'carry out', 'carry over', 'carry through', 'carry up',
            'check in', 'check out', 'check over', 'check up', 'check with',
            'clean up', 'clean out', 'clean off', 'clean down', 'clean away',
            'close down', 'close in', 'close off', 'close out', 'close up',
            'come across', 'come along', 'come around', 'come back', 'come by',
            'come down', 'come from', 'come in', 'come into', 'come off',
            'come on', 'come out', 'come over', 'come through', 'come to',
            'come up', 'come with', 'cut away', 'cut back', 'cut down',
            'cut in', 'cut off', 'cut out', 'cut through', 'cut up',
            'do away', 'do back', 'do down', 'do in', 'do off', 'do out',
            'do over', 'do through', 'do up', 'do with', 'draw back',
            'draw down', 'draw in', 'draw off', 'draw on', 'draw out',
            'draw over', 'draw through', 'draw up', 'draw with', 'drop back',
            'drop down', 'drop in', 'drop off', 'drop out', 'drop over',
            'drop through', 'drop up', 'drop with', 'fall back', 'fall down',
            'fall in', 'fall off', 'fall out', 'fall over', 'fall through',
            'fall up', 'fall with', 'fill in', 'fill out', 'fill up',
            'find out', 'find up', 'get away', 'get back', 'get down',
            'get in', 'get off', 'get on', 'get out', 'get over', 'get through',
            'get up', 'get with', 'give away', 'give back', 'give in',
            'give off', 'give out', 'give up', 'go away', 'go back',
            'go down', 'go in', 'go off', 'go on', 'go out', 'go over',
            'go through', 'go up', 'go with', 'hand back', 'hand down',
            'hand in', 'hand off', 'hand out', 'hand over', 'hand through',
            'hand up', 'hand with', 'hang around', 'hang back', 'hang down',
            'hang in', 'hang off', 'hang on', 'hang out', 'hang over',
            'hang through', 'hang up', 'hang with', 'hold back', 'hold down',
            'hold in', 'hold off', 'hold on', 'hold out', 'hold over',
            'hold through', 'hold up', 'hold with', 'keep away', 'keep back',
            'keep down', 'keep in', 'keep off', 'keep on', 'keep out',
            'keep over', 'keep through', 'keep up', 'keep with', 'lay away',
            'lay back', 'lay down', 'lay in', 'lay off', 'lay on', 'lay out',
            'lay over', 'lay through', 'lay up', 'lay with', 'leave away',
            'leave back', 'leave down', 'leave in', 'leave off', 'leave on',
            'leave out', 'leave over', 'leave through', 'leave up', 'leave with',
            'let down', 'let in', 'let off', 'let on', 'let out', 'let over',
            'let through', 'let up', 'let with', 'look after', 'look away',
            'look back', 'look down', 'look for', 'look in', 'look into',
            'look off', 'look on', 'look out', 'look over', 'look through',
            'look up', 'look with', 'make away', 'make back', 'make down',
            'make for', 'make in', 'make off', 'make out', 'make over',
            'make through', 'make up', 'make with', 'move away', 'move back',
            'move down', 'move in', 'move off', 'move on', 'move out',
            'move over', 'move through', 'move up', 'move with', 'pass away',
            'pass back', 'pass down', 'pass in', 'pass off', 'pass on',
            'pass out', 'pass over', 'pass through', 'pass up', 'pass with',
            'pick away', 'pick back', 'pick down', 'pick in', 'pick off',
            'pick on', 'pick out', 'pick over', 'pick through', 'pick up',
            'pick with', 'play around', 'play back', 'play down', 'play in',
            'play off', 'play on', 'play out', 'play over', 'play through',
            'play up', 'play with', 'pull away', 'pull back', 'pull down',
            'pull in', 'pull off', 'pull on', 'pull out', 'pull over',
            'pull through', 'pull up', 'pull with', 'push away', 'push back',
            'push down', 'push in', 'push off', 'push on', 'push out',
            'push over', 'push through', 'push up', 'push with', 'put away',
            'put back', 'put down', 'put in', 'put off', 'put on', 'put out',
            'put over', 'put through', 'put up', 'put with', 'run away',
            'run back', 'run down', 'run in', 'run off', 'run on', 'run out',
            'run over', 'run through', 'run up', 'run with', 'send away',
            'send back', 'send down', 'send in', 'send off', 'send on',
            'send out', 'send over', 'send through', 'send up', 'send with',
            'set away', 'set back', 'set down', 'set in', 'set off', 'set on',
            'set out', 'set over', 'set through', 'set up', 'set with',
            'show around', 'show back', 'show down', 'show in', 'show off',
            'show on', 'show out', 'show over', 'show through', 'show up',
            'show with', 'shut down', 'shut in', 'shut off', 'shut out',
            'shut up', 'sit around', 'sit back', 'sit down', 'sit in',
            'sit off', 'sit on', 'sit out', 'sit over', 'sit through',
            'sit up', 'sit with', 'stand around', 'stand back', 'stand down',
            'stand in', 'stand off', 'stand on', 'stand out', 'stand over',
            'stand through', 'stand up', 'stand with', 'start away', 'start back',
            'start down', 'start in', 'start off', 'start on', 'start out',
            'start over', 'start through', 'start up', 'start with', 'stay away',
            'stay back', 'stay down', 'stay in', 'stay off', 'stay on',
            'stay out', 'stay over', 'stay through', 'stay up', 'stay with',
            'stop around', 'stop back', 'stop down', 'stop in', 'stop off',
            'stop on', 'stop out', 'stop over', 'stop through', 'stop up',
            'stop with', 'take away', 'take back', 'take down', 'take in',
            'take off', 'take on', 'take out', 'take over', 'take through',
            'take up', 'take with', 'talk around', 'talk back', 'talk down',
            'talk in', 'talk off', 'talk on', 'talk out', 'talk over',
            'talk through', 'talk up', 'talk with', 'think about', 'think back',
            'think down', 'think in', 'think off', 'think on', 'think out',
            'think over', 'think through', 'think up', 'think with', 'throw away',
            'throw back', 'throw down', 'throw in', 'throw off', 'throw on',
            'throw out', 'throw over', 'throw through', 'throw up', 'throw with',
            'turn around', 'turn away', 'turn back', 'turn down', 'turn in',
            'turn off', 'turn on', 'turn out', 'turn over', 'turn through',
            'turn up', 'turn with', 'walk away', 'walk back', 'walk down',
            'walk in', 'walk off', 'walk on', 'walk out', 'walk over',
            'walk through', 'walk up', 'walk with', 'work around', 'work back',
            'work down', 'work in', 'work off', 'work on', 'work out',
            'work over', 'work through', 'work up', 'work with'
        ];
        
        // Buscar expresiones de 2 palabras
        for (let i = Math.max(0, clickedIndex - 1); i <= Math.min(allWords.length - 2, clickedIndex + 1); i++) {
            if (i + 1 < allWords.length) {
                const word1 = allWords[i].textContent.trim().toLowerCase();
                const word2 = allWords[i + 1].textContent.trim().toLowerCase();
                const expression = `${word1} ${word2}`;
                
                if (commonExpressions.includes(expression)) {
                    return [allWords[i], allWords[i + 1]];
                }
            }
        }
        
        // Buscar expresiones de 3 palabras
        for (let i = Math.max(0, clickedIndex - 2); i <= Math.min(allWords.length - 3, clickedIndex + 1); i++) {
            if (i + 2 < allWords.length) {
                const word1 = allWords[i].textContent.trim().toLowerCase();
                const word2 = allWords[i + 1].textContent.trim().toLowerCase();
                const word3 = allWords[i + 2].textContent.trim().toLowerCase();
                const expression = `${word1} ${word2} ${word3}`;
                
                if (commonExpressions.includes(expression)) {
                    return [allWords[i], allWords[i + 1], allWords[i + 2]];
                }
            }
        }
        
        // Si no encuentra expresión, devolver solo la palabra clickeada
        return [clickedWord];
    }
    
    highlightSelection(words) {
        words.forEach((word, index) => {
            if (index === 0) {
                this.highlightWord(word, 'start');
            } else if (index === words.length - 1) {
                this.highlightWord(word, 'end');
            } else {
                this.highlightWord(word, 'middle');
            }
        });
    }
    
    updateSelection() {
        this.clearSelection();
        
        if (!this.startElement || !this.endElement) return;
        
        // Obtener todos los elementos entre start y end
        const elements = this.getElementsBetween(this.startElement, this.endElement);
        this.selectedWords = elements;
        
        // Aplicar estilos
        elements.forEach((element, index) => {
            if (index === 0) {
                this.highlightWord(element, 'start');
            } else if (index === elements.length - 1) {
                this.highlightWord(element, 'end');
            } else {
                this.highlightWord(element, 'middle');
            }
        });
    }
    
    getElementsBetween(start, end) {
        const elements = [];
        let current = start;
        
        // Buscar en el mismo contenedor
        const container = start.closest('.reading-area, .practice-area, .text-example, p');
        if (!container) return [start];
        
        const allWords = Array.from(container.querySelectorAll('.clickable-word, .practice-word'));
        
        const startIndex = allWords.indexOf(start);
        const endIndex = allWords.indexOf(end);
        
        if (startIndex === -1 || endIndex === -1) return [start];
        
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);
        
        for (let i = minIndex; i <= maxIndex; i++) {
            elements.push(allWords[i]);
        }
        
        return elements;
    }
    
    highlightWord(element, position) {
        element.classList.add('word-selection');
        
        if (position === 'start') {
            element.classList.add('word-selection-start');
        } else if (position === 'end') {
            element.classList.add('word-selection-end');
        }
    }
    
    clearSelection() {
        document.querySelectorAll('.word-selection').forEach(element => {
            element.classList.remove('word-selection', 'word-selection-start', 'word-selection-end');
        });
    }
    
    translateSelection() {
        const text = this.selectedWords.map(word => word.textContent.trim()).join(' ');
        
        console.log('Traduciendo texto:', text);
        
        if (!text || text.length < 2) {
            console.warn('Texto muy corto para traducir:', text);
            return;
        }
        
        // Mostrar tooltip de carga
        console.log('Mostrando tooltip de carga');
        this.showTooltip(text, 'Traduciendo...', true);
        
        // Hacer petición de traducción
        fetch('traducion_api/translate.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'text=' + encodeURIComponent(text)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.translation) {
                this.showTooltip(text, data.translation, false);
                
                // Guardar palabra traducida si el usuario está logueado
                if (typeof window.saveTranslatedWord === 'function') {
                    const sentence = this.findSentenceContainingWords();
                    window.saveTranslatedWord(text, data.translation, sentence);
                }
            } else {
                this.showTooltip(text, 'No se encontró traducción', false);
            }
        })
        .catch((error) => {
            console.error('Error al traducir:', error);
            this.showTooltip(text, 'Error en la traducción', false);
        });
    }
    
    findSentenceContainingWords() {
        if (this.selectedWords.length === 0) return '';
        
        const firstWord = this.selectedWords[0];
        let paragraph = firstWord.closest('p');
        
        if (!paragraph) {
            paragraph = firstWord.closest('.paragraph');
        }
        
        if (paragraph) {
            let fullText = paragraph.textContent || paragraph.innerText;
            fullText = fullText.trim();
            
            const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 0);
            
            for (let sentence of sentences) {
                const selectedText = this.selectedWords.map(w => w.textContent.trim()).join(' ');
                if (sentence.toLowerCase().includes(selectedText.toLowerCase())) {
                    return sentence.trim() + '.';
                }
            }
            
            return fullText.length > 200 ? fullText.substring(0, 200) + '...' : fullText;
        }
        
        return this.selectedWords.map(w => w.textContent.trim()).join(' ') + '.';
    }
    
    showTooltip(originalText, translation, isLoading = false) {
        console.log('showTooltip llamado:', { originalText, translation, isLoading });
        this.hideTooltip();
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'multi-word-tooltip';
        
        if (isLoading) {
            this.tooltip.innerHTML = `
                <div class="original-text">${originalText}</div>
                <div class="translation loading">${translation}</div>
            `;
        } else {
            this.tooltip.innerHTML = `
                <div class="original-text">${originalText}</div>
                <div class="translation">${translation}</div>
            `;
        }
        
        // Agregar al body para que esté siempre visible
        document.body.appendChild(this.tooltip);
        console.log('Tooltip añadido al DOM');
        
        // Posicionar tooltip
        this.positionTooltip();
        console.log('Tooltip posicionado');
    }
    
    positionTooltip() {
        if (!this.tooltip) {
            console.warn('No hay tooltip para posicionar');
            return;
        }
        
        if (this.selectedWords.length === 0) {
            // Si no hay palabras seleccionadas pero hay un tooltip, usar posición del mouse
            const tooltipRect = this.tooltip.getBoundingClientRect();
            const tooltipWidth = tooltipRect.width || 200;
            const tooltipHeight = tooltipRect.height || 100;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const padding = 10;
            
            // Posicionar en el centro de la pantalla como fallback
            const left = (windowWidth - tooltipWidth) / 2;
            const top = (windowHeight - tooltipHeight) / 2;
            
            this.tooltip.style.position = 'fixed';
            this.tooltip.style.left = Math.max(padding, left) + 'px';
            this.tooltip.style.top = Math.max(padding, top) + 'px';
            this.tooltip.style.display = 'block';
            this.tooltip.style.visibility = 'visible';
            this.tooltip.style.opacity = '1';
            return;
        }
        
        const firstWord = this.selectedWords[0];
        const lastWord = this.selectedWords[this.selectedWords.length - 1];
        
        const firstRect = firstWord.getBoundingClientRect();
        const lastRect = lastWord.getBoundingClientRect();
        
        // Calcular posición centrada debajo de la selección
        const centerX = (firstRect.left + lastRect.right) / 2;
        const top = lastRect.bottom + 10;
        
        // Obtener dimensiones del tooltip
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width || 200;
        const tooltipHeight = tooltipRect.height || 100;
        
        // Calcular posición horizontal (centrado, pero ajustado si se sale de la pantalla)
        let left = centerX - (tooltipWidth / 2);
        const windowWidth = window.innerWidth;
        const padding = 10;
        
        // Ajustar si se sale por la izquierda
        if (left < padding) {
            left = padding;
        }
        // Ajustar si se sale por la derecha
        if (left + tooltipWidth > windowWidth - padding) {
            left = windowWidth - tooltipWidth - padding;
        }
        
        // Calcular posición vertical (debajo de la selección, pero ajustado si se sale)
        let tooltipTop = top;
        const windowHeight = window.innerHeight;
        
        // Si no cabe debajo, mostrar arriba
        if (tooltipTop + tooltipHeight > windowHeight - padding) {
            tooltipTop = firstRect.top - tooltipHeight - 10;
            // Si tampoco cabe arriba, centrar verticalmente
            if (tooltipTop < padding) {
                tooltipTop = (windowHeight - tooltipHeight) / 2;
            }
        }
        
        // Aplicar posición fija (relativa al viewport)
        this.tooltip.style.position = 'fixed';
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = tooltipTop + 'px';
        this.tooltip.style.display = 'block';
        this.tooltip.style.visibility = 'visible';
        this.tooltip.style.opacity = '1';
    }
    
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
    
    // Método público para limpiar todo
    destroy() {
        this.clearSelection();
        this.hideTooltip();
        this.isSelecting = false;
        this.selectedWords = [];
    }
}

// Inicializar solo en páginas de lectura, no en práctica
window.initializeMultiWordSelector = function initializeMultiWordSelector() {
    // Solo inicializar si estamos en una página de lectura (no práctica)
    const isPracticePage = window.location.href.includes('practice') || 
                          document.querySelector('.practice-area') ||
                          document.querySelector('#practice-container') ||
                          document.querySelector('.text-selector-container') ||
                          document.querySelector('#text-selector');
    
    // También verificar si estamos en la pestaña de práctica
    const currentTab = document.querySelector('.tab-btn.active');
    const isPracticeTab = currentTab && currentTab.textContent.includes('Práctica');
    
    // Verificar si existe el panel de lectura
    const panelLectura = document.getElementById('panelLectura');
    const hasReadingContent = panelLectura && panelLectura.querySelector('.clickable-word');
    
    if (!isPracticePage && !isPracticeTab && !window.multiWordSelector) {
        window.multiWordSelector = new MultiWordSelector();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.initializeMultiWordSelector) {
        window.initializeMultiWordSelector();
    }
});

// También inicializar cuando se carga contenido dinámicamente
// Esto se ejecutará después de que lectura.js cargue el contenido
if (typeof window !== 'undefined') {
    // Observar cuando se añaden palabras clickeables al DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                const hasClickableWords = Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType === 1) { // Element node
                        return node.classList && (node.classList.contains('clickable-word') || 
                               node.classList.contains('word-clickable') ||
                               node.querySelector('.clickable-word, .word-clickable'));
                    }
                    return false;
                });
                
                if (hasClickableWords && !window.multiWordSelector) {
                    // Esperar un poco para que el DOM se estabilice
                    setTimeout(window.initializeMultiWordSelector, 100);
                }
            }
        });
    });
    
    // Observar cambios en el panel de lectura
    document.addEventListener('DOMContentLoaded', () => {
        const panelLectura = document.getElementById('panelLectura');
        if (panelLectura) {
            observer.observe(panelLectura, {
                childList: true,
                subtree: true
            });
        }
    });
}

// Exportar para uso global
window.MultiWordSelector = MultiWordSelector;
