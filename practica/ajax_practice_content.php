<?php
session_start();
require_once '../db/conexion.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

$user_id = $_SESSION['user_id'];
$conn->close();
?>


<div id="contenedor-practica">
    <div style="display: flex; justify-content: space-between; align-items: center; padding:22px; margin-top: -2px;">
        <h3>🎯 Practicar</h3>
    </div>
    <div id="contenido-practica">
        <div style="text-align: center; padding: 40px; color: #6b7280;">
            <div>Cargando ejercicios...</div>
        </div>
    </div>
</div>

<script>
// Inicializar práctica inmediatamente
setTimeout(() => {
    if (typeof window.cargarModoPractica === 'function') {
        window.cargarModoPractica();
    } else {
        // Si no está cargada la función, crear un contenido básico de práctica
        cargarPracticaBasica();
    }
}, 100);

function cargarPracticaBasica() {
    // Cargar palabras guardadas del usuario para práctica
    fetch('ajax_practice_data.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                document.getElementById('contenido-practica').innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #dc2626;">
                        <p>Error: ${data.message || 'Error cargando datos'}</p>
                    </div>
                `;
                return;
            }

            if (!data.words || data.words.length === 0) {
                document.getElementById('contenido-practica').innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #6b7280;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">📚</div>
                        <h3 style="margin-bottom: 10px; color: #374151;">No hay palabras para practicar</h3>
                        <p style="margin-bottom: 30px;">Lee textos y guarda palabras para practicar.</p>
                        <button onclick="loadTabContent('my-texts')" class="nav-btn primary">
                            📚 Ver textos
                        </button>
                    </div>
                `;
                return;
            }

            // Mostrar selector de modo de práctica
            mostrarSelectorModoPractica();
        })
        .catch(error => {
            document.getElementById('contenido-practica').innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626;">
                    <p>Error cargando los ejercicios. Por favor, intenta de nuevo.</p>
                </div>
            `;
        });
}

function mostrarSelectorModoPractica() {
    document.getElementById('contenido-practica').innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="margin-bottom: 10px;">Elige modo de práctica</h3>
                <p style="color: #6b7280;">Selecciona cómo practicar</p>
            </div>
            
            <div style="display: grid; gap: 20px; margin-bottom: 30px;">
                <div class="tarjeta-modo-practica" onclick="iniciarModoPractica('selection')" style="cursor: pointer; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px; text-align: center; transition: all 0.2s;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">🔤</div>
                    <h4 style="margin-bottom: 8px;">Selección múltiple</h4>
                    <p style="color: #6b7280; font-size: 14px;">Elige traducción correcta</p>
                </div>
                
                <div class="tarjeta-modo-practica" onclick="iniciarModoPractica('writing')" style="cursor: pointer; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px; text-align: center; transition: all 0.2s;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">✍️</div>
                    <h4 style="margin-bottom: 8px;">Escribir palabra</h4>
                    <p style="color: #6b7280; font-size: 14px;">Completa frase con palabra correcta</p>
                </div>
                
                <div class="tarjeta-modo-practica" onclick="iniciarModoPractica('sentences')" style="cursor: pointer; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px; text-align: center; transition: all 0.2s;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📝</div>
                    <h4 style="margin-bottom: 8px;">Traducir frases</h4>
                    <p style="color: #6b7280; font-size: 14px;">Traduce frases español-inglés</p>
                </div>
            </div>
        </div>
        
        <style>
        .tarjeta-modo-practica:hover {
            border-color: #3b82f6 !important;
            background-color: #f8fafc !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        </style>
    `;
}

function iniciarModoPractica(mode) {
    document.getElementById('contenido-practica').innerHTML = `
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
            document.getElementById('contenido-practica').innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626;">
                    <p>Práctica en desarrollo. Usa la página principal.</p>
                    <button onclick="window.location.href='index.php?practice=1'" class="nav-btn primary" style="margin-top: 20px;">
                        Ir a práctica completa
                    </button>
                </div>
            `;
        }, 1000);
    }
}
</script>
