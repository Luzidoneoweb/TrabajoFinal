<?php
// Verificar sesión
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Validar si es admin
$es_admin = isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
?>

<div class="contenedor-subir-texto">
    <h2>Subir nuevo texto</h2>

    <div class="formulario-subir">
        <div class="columna-izquierda">
            <div class="campo">
                <label for="titulo">Título:</label>
                <input type="text" id="titulo" name="titulo">
                <p class="ayuda-texto">Si no llenas el título, se generará automáticamente con las primeras 3 palabras del texto</p>
            </div>

            <div class="campo">
                <label for="contenido">Contenido:</label>
                <textarea id="contenido" name="contenido"></textarea>
            </div>

            <!-- Campos solo para admin -->
            <?php if ($es_admin): ?>
                <div class="campo-checkbox">
                    <input type="checkbox" id="texto_publico" name="texto_publico" checked>
                    <label for="texto_publico">Texto público</label>
                </div>

                <div class="campo" id="campo_categoria">
                    <label for="categoria">Categoría:</label>
                    <select id="categoria" name="categoria">
                        <option value="">-- Selecciona categoría --</option>
                    </select>
                </div>
            <?php endif; ?>

            <button type="button" id="btn_subir_texto">Subir</button>
        </div>

        <div class="columna-derecha">
            <div class="anuncio">
                Anuncio superior
            </div>
            <div class="anuncio">
                Anuncio inferior
            </div>
        </div>
    </div>
</div>
