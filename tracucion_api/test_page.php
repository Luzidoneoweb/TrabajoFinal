<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página de Prueba de Traducción</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
        .container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
        h1 { color: #333; }
        textarea { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #45a049; }
        #result { margin-top: 20px; padding: 10px; border: 1px solid #eee; border-radius: 4px; background-color: #e9e9e9; }
        .error { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Probar Traducción</h1>
        <textarea id="textToTranslate" rows="5" placeholder="Introduce el texto a traducir..."></textarea>
        <button onclick="translateText()">Traducir</button>
        <div id="result">
            <p><strong>Traducción:</strong> <span id="translationOutput"></span></p>
            <p><strong>Idioma detectado:</strong> <span id="detectedLanguage"></span></p>
            <p><strong>Fuente:</strong> <span id="translationSource"></span></p>
            <p><strong>Original:</strong> <span id="originalText"></span></p>
        </div>
    </div>

    <script>
        async function translateText() {
            const text = document.getElementById('textToTranslate').value;
            const translationOutput = document.getElementById('translationOutput');
            const detectedLanguage = document.getElementById('detectedLanguage');
            const translationSource = document.getElementById('translationSource');
            const originalText = document.getElementById('originalText');

            translationOutput.textContent = 'Traduciendo...';
            detectedLanguage.textContent = '';
            translationSource.textContent = '';
            originalText.textContent = '';

            try {
                const response = await fetch('translate.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `text=${encodeURIComponent(text)}`
                });
                const data = await response.json();

                if (data.error) {
                    translationOutput.textContent = `Error: ${data.error}`;
                    translationOutput.classList.add('error');
                } else {
                    translationOutput.textContent = data.translation;
                    detectedLanguage.textContent = data.detected_language;
                    translationSource.textContent = data.source;
                    originalText.textContent = data.original;
                    translationOutput.classList.remove('error');
                }
            } catch (error) {
                translationOutput.textContent = `Error de conexión: ${error.message}`;
                translationOutput.classList.add('error');
            }
        }
    </script>
</body>
</html>
