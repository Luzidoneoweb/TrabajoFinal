<?php
// Este archivo devolverá los textos públicos en formato JSON.
// Debería ser llamado por AJAX desde pestanas/js/textoPublicCategoria.js

// Simulación de datos de textos (reemplazar con lógica real de base de datos)
$allTexts = [
    ['id' => 101, 'title' => 'The Importance of English Grammar', 'title_translation' => 'La importancia de la gramática inglesa', 'category_id' => 1, 'content' => 'Grammar is the set of structural rules governing the composition of clauses, phrases, and words in any given natural language.'],
    ['id' => 102, 'title' => 'Common English Vocabulary for Beginners', 'title_translation' => 'Vocabulario común en inglés para principiantes', 'category_id' => 2, 'content' => 'Learning new vocabulary is essential for improving your English skills. Start with common words.'],
    ['id' => 103, 'title' => 'Everyday English Phrases', 'title_translation' => 'Frases cotidianas en inglés', 'category_id' => 3, 'content' => 'Using common phrases can make your conversations more natural and fluent.'],
    ['id' => 104, 'title' => 'Understanding English Idioms', 'title_translation' => 'Entendiendo los modismos ingleses', 'category_id' => 4, 'content' => 'Idioms are expressions whose meaning cannot be deduced from the literal definitions of the words.'],
    ['id' => 105, 'title' => 'Advanced Grammar Concepts', 'title_translation' => 'Conceptos avanzados de gramática', 'category_id' => 1, 'content' => 'Beyond the basics, advanced grammar involves complex sentence structures and nuanced usage.'],
];

$categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
$filteredTexts = [];
$categoryName = 'Todos';

if ($categoryId) {
    foreach ($allTexts as $text) {
        if ($text['category_id'] === $categoryId) {
            $filteredTexts[] = $text;
        }
    }
    // Obtener el nombre de la categoría para mostrarlo
    $categories = [
        ['id' => 1, 'name' => 'Grammar'],
        ['id' => 2, 'name' => 'Vocabulary'],
        ['id' => 3, 'name' => 'Phrases'],
        ['id' => 4, 'name' => 'Idioms'],
    ];
    foreach ($categories as $cat) {
        if ($cat['id'] === $categoryId) {
            $categoryName = $cat['name'];
            break;
        }
    }
} else {
    $filteredTexts = $allTexts;
}

header('Content-Type: application/json');

if (isset($_GET['ajax']) && $_GET['ajax'] == 1) {
    echo json_encode(['texts' => $filteredTexts, 'categoryName' => $categoryName]);
} else {
    header('Location: /');
    exit();
}
?>
