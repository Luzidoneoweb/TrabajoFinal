<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

$user_id = $_SESSION['user_id'];
?>

<script>
// Inicializar práctica inmediatamente
setTimeout(() => {
    if (typeof window.loadPracticeMode === 'function') {
        window.loadPracticeMode();
    } else {
        // Si no está cargada la función, crear un contenido básico de práctica
        loadBasicPractice();
    }
}, 100);

function loadBasicPractice() {
    // Cargar palabras guardadas del usuario para práctica
    fetch('ajax_practice_data.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                document.getElementById('practice-content').innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #dc2626;">
                        <p>Error: ${data.message || 'Error cargando datos'}</p>
                    </div>
                `;
                return;
            }

            if (!data.words || data.words.length === 0) {
                document.getElementById('practice-content').innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #6b7280;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">📚</div>
                        <h3 style="margin-bottom: 10px; color: #374151;">No hay palabras para practicar</h3>
                        <p style="margin-bottom: 30px;">Primero lee algunos textos y guarda palabras para poder practicar.</p>
                        <button onclick="loadTabContent('my-texts')" class="nav-btn primary">
                            📚 Ver mis textos
                        </button>
                    </div>
                `;
                return;
            }

            // Mostrar selector de modo de práctica
            showPracticeModeSelector();
        })
        .catch(error => {
            document.getElementById('practice-content').innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626;">
                    <p>Error cargando los ejercicios. Por favor, intenta de nuevo.</p>
                </div>
            `;
        });
}



function startPracticeMode(mode) {
    document.getElementById('practice-content').innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6b7280;">
            <div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>
            <p>Preparando ejercicios de ${mode === 'selection' ? 'selección múltiple' : mode === 'writing' ? 'escritura' : 'traducción'}...</p>
        </div>
    `;
    
    // Llamar a la función del sistema de práctica principal si está disponible
    if (typeof window.setPracticeMode === 'function') {
        window.setPracticeMode(mode);
    } else {
        // Fallback básico
        setTimeout(() => {
            document.getElementById('practice-content').innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626;">
                    <p>Funcionalidad de práctica en desarrollo. Por favor, usa la página de práctica principal.</p>
                    <button onclick="window.location.href='index.php?practice=1'" class="nav-btn primary" style="margin-top: 20px;">
                        Ir a práctica completa
                    </button>
                </div>
            `;
        }, 1000);
    }
}
</script>
