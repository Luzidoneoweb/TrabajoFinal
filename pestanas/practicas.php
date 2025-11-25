<div class="contenedor-principal-practicas">
    <div id="practice-container">
    <div style="display: flex; justify-content: space-between; align-items: center; padding:22px; margin-top: -2px;">
        <h3>🎯 Practicar Vocabulario</h3>
    </div>
   
</div>
       
        <div class="mode-selector">
            <button class="mode-btn active" data-mode="selection">📝 Selección múltiple</button>
            <button class="mode-btn" data-mode="writing">✍️ Escribir palabra</button>
            <button class="mode-btn" data-mode="sentences">📖 Escribir frases</button>
        </div>

        <div class="progress">
            <div class="progress-bar" id="practice-progress-bar" style="width: 0%"></div>
        </div>

       <div class="exercise-card" id="practice-exercise-card">
       <div class="text-selector-container">
       <h3>📝 Elige un texto para practicar palabras:</h3>
       <select id="selectorTextosPractica" class="text-select" onchange="startSentencePractice()">
       <option value="">Selecciona un texto...</option>
       </select>
       <div class="text-selector-info">
       <p>💡 <strong>Mis textos:</strong> Textos que has subido tú</p>
       <p>💡 <strong>Textos públicos:</strong> Textos de otros usuarios que has leído y guardado palabras</p>
       </div>
       </div>
       </div>

        <div class="practice-stats">
            <div class="stat-item">
                <div class="stat-number" id="practice-current-question">0</div>
                <div class="stat-label">Pregunta</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="practice-total-questions">0</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="practice-correct-count">0</div>
                <div class="stat-label">Correctas</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="practice-incorrect-count">0</div>
                <div class="stat-label">Incorrectas</div>
            </div>
        </div>
    

<script src="../practica/js/practice-functions.js"></script>
<script>
(function inicializarPracticasPanel() {
    if (typeof window.iniciarPracticaUI === 'function') {
        window.iniciarPracticaUI();
    } else {
        // Si el script aún no está disponible, reintentar brevemente
        setTimeout(inicializarPracticasPanel, 100);
    }
})();
</script>
