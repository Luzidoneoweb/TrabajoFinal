<div class="contenedor-palabras">
    <div class="encabezado-palabras">
        
    </div>

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

        <?php if (empty($words_by_text)): ?>
            <div class="no-words-message">No tienes palabras guardadas aún.</div>
        <?php else: ?>
            <form method="post" id="words-list-form">
                <?php foreach ($words_by_text as $text_title => $words): ?>
                    <div class="card">
                        <div class="card-header">
                            <input type="checkbox" class="text-checkbox" onclick="toggleGroup(this, 'group-<?= md5($text_title) ?>')">
                            <span class="text-title">
                                <?= htmlspecialchars($text_title) ?>
                                <span>(<?= count($words) ?>)</span>
                            </span>
                        </div>
                        <ul class="text-list" id="group-<?= md5($text_title) ?>">
                            <?php foreach ($words as $word): ?>
                                <li class="text-item">
                                    <input type="checkbox" name="selected_words[]" value="<?= htmlspecialchars($word['word']) . '|' . (int)($word['text_id'] ?? 0) ?>" class="text-checkbox" onchange="updateBulkActionsWords()">
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
