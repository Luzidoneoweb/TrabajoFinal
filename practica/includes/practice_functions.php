<?php
/**
 * Funciones comunes para la práctica
 * Elimina duplicación entre archivos de práctica
 */

// Función para guardar progreso de práctica
function guardarProgresoPractica($user_id, $mode, $total_words, $correct_answers, $incorrect_answers, $text_id = null) {
    global $conn;
    
    // Calcular precisión (correctas / total de respuestas)
    $total_answers = $correct_answers + $incorrect_answers;
    $accuracy = $total_answers > 0 ? round(($correct_answers / $total_answers) * 100, 2) : 0;

    try {
        $stmt = $conn->prepare("INSERT INTO practice_progress (user_id, text_id, mode, total_words, correct_answers, incorrect_answers, accuracy) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iisiiid", $user_id, $text_id, $mode, $total_words, $correct_answers, $incorrect_answers, $accuracy);
        
        if ($stmt->execute()) {
            $stmt->close();
            return [
                'success' => true, 
                'message' => 'Progreso guardado correctamente',
                'accuracy' => $accuracy
            ];
        } else {
            $stmt->close();
            return ['success' => false, 'error' => 'Error al guardar el progreso'];
        }
        
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Error del servidor: ' . $e->getMessage()];
    }
}

// Función para guardar tiempo de práctica
function guardarTiempoPractica($user_id, $mode, $duration) {
    global $conn;
    
    if ($duration <= 0 || !$mode) {
        return ['success' => false, 'error' => 'Datos inválidos'];
    }

    $stmt = $conn->prepare("INSERT INTO practice_time (user_id, mode, duration_seconds) VALUES (?, ?, ?)");
    $stmt->bind_param('isi', $user_id, $mode, $duration);
    $ok = $stmt->execute();
    $stmt->close();

    if ($ok) {
        return ['success' => true];
    } else {
        return ['success' => false, 'error' => 'Error al guardar en BD'];
    }
}

?>
