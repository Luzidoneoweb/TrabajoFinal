<?php
// Este archivo contendrá funciones relacionadas con la gestión de traducciones de contenido.

// Asegúrate de que la conexión a la base de datos esté disponible.
// Si este archivo se incluye en un contexto donde $pdo ya está definido, no es necesario redefinirlo.
// Sin embargo, para que sea autónomo, se puede incluir la conexión aquí o pasarla como parámetro.
// Por simplicidad, asumiremos que $pdo está disponible globalmente o se pasa.

function getContentTranslation($text_id) {
    global $pdo; // Asumimos que $pdo está disponible globalmente

    try {
        $stmt = $pdo->prepare("SELECT content, translation FROM content_translations WHERE text_id = ?");
        $stmt->execute([$text_id]);
        
        $translations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $translations; // Devuelve un array de objetos {content, translation}
    } catch (Exception $e) {
        error_log("Error al obtener traducción de contenido: " . $e->getMessage());
        return false;
    }
}

function saveContentTranslation($text_id, $content, $translation) {
    global $pdo; // Asumimos que $pdo está disponible globalmente

    try {
        // Primero, verificar si ya existe una traducción para este contenido y text_id
        $stmt_check = $pdo->prepare("SELECT id FROM content_translations WHERE text_id = ? AND content = ?");
        $stmt_check->execute([$text_id, $content]);
        $existing_translation = $stmt_check->fetch(PDO::FETCH_ASSOC);

        if ($existing_translation) {
            // Si ya existe, actualizar la traducción
            $stmt_update = $pdo->prepare("UPDATE content_translations SET translation = ? WHERE text_id = ? AND content = ?");
            $stmt_update->execute([$translation, $text_id, $content]);
            return ['success' => true, 'message' => 'Traducción de contenido actualizada.'];
        } else {
            // Si no existe, insertar una nueva traducción
            $stmt_insert = $pdo->prepare("INSERT INTO content_translations (text_id, content, translation) VALUES (?, ?, ?)");
            $stmt_insert->execute([$text_id, $content, $translation]);
            return ['success' => true, 'message' => 'Traducción de contenido guardada.'];
        }
    } catch (Exception $e) {
        error_log("Error al guardar/actualizar traducción de contenido: " . $e->getMessage());
        return ['success' => false, 'error' => 'Error en la base de datos al guardar la traducción.'];
    }
}
