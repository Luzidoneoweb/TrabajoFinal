document.addEventListener('DOMContentLoaded', function() {
    fetch('/trabajoFinal/php/pestanas/php/get_textos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const listaTextos = document.querySelector('.lista-textos');
                const visor = document.querySelector('.visor-texto');
                const contador = document.querySelector('.contador-textos');
                listaTextos.innerHTML = ''; // Limpiar el contenido existente

                if (contador) {
                    contador.textContent = `${data.data.length} textos encontrados`;
                }

                data.data.forEach(texto => {
                    const itemTexto = document.createElement('div');
                    itemTexto.classList.add('item-texto');
                    itemTexto.innerHTML = `
                        <input type="checkbox" class="chk-texto">
                        <div class="info-texto">
                            <p class="titulo-texto">${texto.title}</p>
                            <p class="traduccion-texto">${texto.title_translation || 'Sin traducción'}</p>
                        </div>
                        <p class="palabras-texto">${texto.content ? texto.content.split(' ').length : 0} palabras</p>
                        <span class="estado-leido">${texto.is_public ? 'Público' : 'Privado'}</span>
                        <button class="btn-estado-publico">${texto.is_public ? 'PÚBLICO' : 'PRIVADO'}</button>
                    `;
                    // Mostrar contenido al hacer clic (excepto en checkbox y botón)
                    itemTexto.addEventListener('click', (e) => {
                        const target = e.target;
                        if (target && target.classList && (target.classList.contains('chk-texto') || target.classList.contains('btn-estado-publico'))) {
                            return;
                        }
                        if (visor) {
                            visor.innerHTML = `
                                <div class="tarjeta-visor">
                                    <h3 class="visor-titulo">${texto.title}</h3>
                                    <div class="visor-contenido">
                                        <div class="visor-columna">
                                            <h4>Original</h4>
                                            <p>${(texto.content || '').replace(/\n/g, '<br>')}</p>
                                        </div>
                                        <div class="visor-columna">
                                            <h4>Traducción</h4>
                                            <p>${(texto.content_translation || 'Sin traducción').replace(/\n/g, '<br>')}</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    });
                    listaTextos.appendChild(itemTexto);
                });
            } else {
                console.error('Error al cargar los textos:', data.error);
            }
        })
        .catch(error => console.error('Error en la petición fetch:', error));
});
