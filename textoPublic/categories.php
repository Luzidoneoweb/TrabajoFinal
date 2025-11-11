<?php
// Este archivo devolverá las categorías de textos públicos en formato JSON.
// Debería ser llamado por AJAX desde pestanas/js/textoPublicCategoria.js

// Simulación de datos de categorías (reemplazar con lógica real de base de datos)
$categories = [
    ['id' => 1, 'name' => 'Grammar'],
    ['id' => 2, 'name' => 'Vocabulary'],
    ['id' => 3, 'name' => 'Phrases'],
    ['id' => 4, 'name' => 'Idioms'],
];

header('Content-Type: application/json');

if (isset($_GET['ajax']) && $_GET['ajax'] == 1) {
    // Aquí se podría añadir lógica para filtrar categorías que tengan textos
    // Por ahora, devolvemos todas las categorías simuladas.
    echo json_encode($categories);
} else {
    // Si no es una llamada AJAX, puedes redirigir o mostrar un error
    header('Location: /');
    exit();
}
?>
