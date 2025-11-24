<?php


// Función para obtener palabras aleatorias para práctica
function obtenerPalabrasAleatoriasPractica($user_id, $limit = 10) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT word, translation, context FROM saved_words WHERE user_id = ? ORDER BY RAND() LIMIT ?");
    $stmt->bind_param("ii", $user_id, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    $words = [];
    
    while ($row = $result->fetch_assoc()) {
        $words[] = $row;
    }
    
    $stmt->close();
    return $words;
}
?>
