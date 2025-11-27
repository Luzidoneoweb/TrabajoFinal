<?php
// Verificar sesión
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Obtener total de palabras guardadas
require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/db/conexion.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];}
// Verificar autenticación
if (!isset($_SESSION['user_id'])) {
    echo '<div class="no-words-message">No autenticado</div>';
    // Importante: en archivos incluidos NO debemos finalizar todo el script.
    // Devolvemos el control al archivo que hizo el include.
    return;
}

$user_id = $_SESSION['user_id'];

// Obtener palabras guardadas del usuario, con título del texto
$stmt = $conn->prepare("SELECT sw.word, sw.translation, sw.context, sw.created_at, sw.text_id, t.title as text_title FROM saved_words sw LEFT JOIN texts t ON sw.text_id = t.id WHERE sw.user_id = ? ORDER BY t.title, sw.created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$words = $result->fetch_all(MYSQLI_ASSOC);

// Agrupar palabras por texto
$words_by_text = [];
$total_words_saved = 0; // Inicializar contador total de palabras
foreach ($words as $word) {
    $title = $word['text_title'] ?? 'Sin texto asociado';
    $words_by_text[$title][] = $word;
    $total_words_saved++; // Incrementar por cada palabra
}
?>

<div class="contenedor-palabras">
    <!-- Barra de acciones -->
    <div class="barra-acciones-palabras" <?= empty($words_by_text) ? 'style="display: none;"' : '' ?>>
        <span class="total-palabras-guardadas">
            Total de palabras guardadas: <span id="total-words-count"><?= $total_words_saved ?></span>
        </span>
        <div class="acciones-derecha">
            <button id="delete-selected-words-btn" class="btn-eliminar-palabras" disabled>
                Eliminar seleccionadas
            </button>
            <span class="contador-palabras">
                <span id="selected-count">0</span> seleccionada(s)
            </span>
        </div>
    </div>

    <!-- Contenedor de palabras -->
    <div class="lista-categorias-palabras" id="palabras-dinamicas-container">
        <?php if (isset($success_message)): ?>
            <div class="message success-message">
                <?= htmlspecialchars($success_message) ?>
            </div>
        <?php elseif (isset($error_message)): ?>
            <div class="message error-message">
                <?= htmlspecialchars($error_message) ?>
            </div>
        <?php endif; ?>

        <!-- Lista de palabras -->
        <?php if (empty($words_by_text)): ?>
            <div class="no-words-message">No tienes palabras guardadas aún.</div>
        <?php else: ?>
            <form method="post" id="words-list-form">
                <?php foreach ($words_by_text as $text_title => $words): ?>
                    <div class="card">
                        <div class="card-header">
                            <input type="checkbox" class="text-checkbox group-checkbox" data-group-id="group-<?= md5($text_title) ?>">
                            <span class="text-title">
                                <?= htmlspecialchars($text_title) ?>
                                <span>(<?= count($words) ?>)</span>
                            </span>
                        </div>
                        <ul class="text-list" id="group-<?= md5($text_title) ?>">
                            <?php foreach ($words as $word): ?>
                                <li class="text-item">
                                    <input type="checkbox" name="selected_words[]" value="<?= htmlspecialchars($word['word']) . '|' . (int)($word['text_id'] ?? 0) ?>" class="text-checkbox">
                                    <span class="text-title">
                                        <?= htmlspecialchars($word['word']) ?>
                                        <span class="word-translation">(<?= htmlspecialchars($word['translation']) ?>)</span>
                                    </span>
                                    <?php if (!empty($word['context'])): ?>
                                        <span class="word-context" data-context="<?= htmlspecialchars($word['context']) ?>">"<?= htmlspecialchars($word['context']) ?>"</span>
                                        <div class="context-translation"></div>
                                    <?php endif; ?>
                                    <span class="word-date"><?= date('d/m/Y', strtotime($word['created_at'])) ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endforeach; ?>
            </form>
        <?php endif; ?>
    </div>
</div>

<script src="pestanas/js/palabras.js"></script>
