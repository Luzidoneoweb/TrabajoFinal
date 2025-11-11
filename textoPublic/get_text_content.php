<?php
// Este archivo devolverá el contenido de un texto específico en formato JSON.
// Debería ser llamado por AJAX desde pestanas/js/textoPublicCategoria.js para contar palabras.

// Simulación de datos de textos (reemplazar con lógica real de base de datos)
$allTexts = [
    ['id' => 101, 'title' => 'The Importance of English Grammar', 'title_translation' => 'La importancia de la gramática inglesa', 'category_id' => 1, 'content' => 'Grammar is the set of structural rules governing the composition of clauses, phrases, and words in any given natural language.'],
    ['id' => 102, 'title' => 'Common English Vocabulary for Beginners', 'title_translation' => 'Vocabulario común en inglés para principiantes', 'category_id' => 2, 'content' => 'Learning new vocabulary is essential for improving your English skills. Start with common words.'],
    ['id' => 103, 'title' => 'Everyday English Phrases', 'title_translation' => 'Frases cotidianas en inglés', 'category_id' => 3, 'content' => 'Using common phrases can make your conversations more natural and fluent.'],
    ['id' => 104, 'title' => 'Understanding English Idioms', 'title_translation' => 'Entendiendo los modismos ingleses', 'category_id' => 4, 'content' => 'Idioms are expressions whose meaning cannot be deduced from the literal definitions of the words.'],
    ['id' => 105, 'title' => 'Advanced Grammar Concepts', 'title_translation' => 'Conceptos avanzados de gramática', 'category_id' => 1, 'content' => 'Beyond the basics, advanced grammar involves complex sentence structures and nuanced usage.'],
];

header('Content-Type: application/json');

$textId = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($textId) {
    foreach ($allTexts as $text) {
        if ($text['id'] === $textId) {
            echo json_encode(['content' => $text['content']]);
            exit();
        }
    }
}

echo json_encode(['content' => null]);
?>
