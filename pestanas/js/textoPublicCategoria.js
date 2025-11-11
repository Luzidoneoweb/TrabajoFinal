// Cargar categorías de textos públicos al abrir el dropdown
function alternarDesplegableTextosPublicos(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('publicTextsDropdown');
    const content = document.getElementById('publicCategoriesContent');
    dropdown.classList.toggle('show');
    if (content.innerHTML.includes('Cargando')) {
        fetch('textoPublic/categories.php?ajax=1')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    let allBtn = `<button type='button' onclick='cargarTodosTextosPublicos()' style='font-weight:bold;color:#eaa827;'>🌍 Mostrar todo</button>`;
                    let cats = data.map(cat => `<button type='button' onclick='cargarTextosPublicosPorCategoria(${cat.id}, "${cat.name.replace(/'/g, "\\'")}")'>${cat.name}</button>`).join('');
                    content.innerHTML = allBtn + cats;
                } else {
                    content.innerHTML = `<div style="padding:10px; color:#dc2626;">No hay categorías públicas.</div>`;
                }
            })
            .catch(() => {
                content.innerHTML = `<div style="padding:10px; color:#dc2626;">Error al cargar categorías.</div>`;
            });
    }
}
// Cerrar dropdown al hacer click fuera
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('publicTextsDropdown');
    if (dropdown) dropdown.classList.remove('show');
});
// Función placeholder para cargar textos públicos por categoría
function cargarTextosPublicosPorCategoria(catId, catName) {
    const form = document.getElementById('bulkForm');
    if (!form) return;
    form.innerHTML = `<div style='padding:20px; text-align:center; color:#64748b;'>Cargando textos públicos de <b>${catName}</b>...</div>`;
    fetch(`textoPublic/public_texts.php?ajax=1&category_id=${catId}`)
        .then(res => res.json())
        .then(async data => {
            const numSpan = document.querySelector('.contador-textos-biblioteca'); // Usar la clase del span en biblioteca.php
            if (numSpan) numSpan.textContent = `${data.texts.length} textos encontrados`;

            if (Array.isArray(data.texts) && data.texts.length > 0) {
                const wordCounts = await Promise.all(data.texts.map(txt =>
                    fetch(`textoPublic/get_text_content.php?id=${txt.id}`)
                        .then(res => res.json())
                        .then(obj => obj && obj.content ? contarPalabrasEnTexto(obj.content) : '?')
                        .catch(() => '?')
                ));

                let htmlContent = '';
                if (data.categoryName !== 'Todos') {
                    htmlContent += `<h3 style="color:#374151; margin-bottom:10px;">Textos públicos de <span style="color:#3b82f6;">${data.categoryName}</span></h3>`;
                }
                
                data.texts.forEach((txt, i) => {
                    htmlContent += `
                        <div class="item-texto-biblioteca">
                            <div class="info-texto-biblioteca">
                                <p class="titulo-texto-biblioteca">${txt.title}</p>
                                <p class="traduccion-texto-biblioteca">${txt.title_translation || ''}</p>
                            </div>
                            <span class="nivel-texto-biblioteca">N/A</span> <!-- Nivel no proporcionado en los datos simulados -->
                            <p class="palabras-count-biblioteca">${wordCounts[i]} palabras</p>
                        </div>
                    `;
                });
                form.innerHTML = htmlContent;
            } else {
                form.innerHTML = `<div style='padding:20px; text-align:center; color:#dc2626;'>No hay textos públicos en esta categoría.</div>`;
            }
        })
        .catch(() => {
            form.innerHTML = `<div style='padding:20px; text-align:center; color:#dc2626;'>Error al cargar los textos públicos.</div>`;
        });
}



// Función para cargar todos los textos públicos
function cargarTodosTextosPublicos() {
    const form = document.getElementById('bulkForm');
    if (!form) return;
    form.innerHTML = `<div style='padding:20px; text-align:center; color:#64748b;'>Cargando todos los textos públicos...</div>`;
    fetch(`textoPublic/public_texts.php?ajax=1`)
        .then(res => res.json())
        .then(async data => {
            const numSpan = document.querySelector('.contador-textos-biblioteca'); // Usar la clase del span en biblioteca.php
            if (numSpan) numSpan.textContent = `${data.texts.length} textos encontrados`;

            if (Array.isArray(data.texts) && data.texts.length > 0) {
                const wordCounts = await Promise.all(data.texts.map(txt =>
                    fetch(`textoPublic/get_text_content.php?id=${txt.id}`)
                        .then(res => res.json())
                        .then(obj => obj && obj.content ? contarPalabrasEnTexto(obj.content) : '?')
                        .catch(() => '?')
                ));

                let htmlContent = '<h3 style="color:#374151; margin-bottom:10px;">Todos los textos públicos</h3>';
                
                data.texts.forEach((txt, i) => {
                    htmlContent += `
                        <div class="item-texto-biblioteca">
                            <div class="info-texto-biblioteca">
                                <p class="titulo-texto-biblioteca">${txt.title}</p>
                                <p class="traduccion-texto-biblioteca">${txt.title_translation || ''}</p>
                            </div>
                            <span class="nivel-texto-biblioteca">N/A</span> <!-- Nivel no proporcionado en los datos simulados -->
                            <p class="palabras-count-biblioteca">${wordCounts[i]} palabras</p>
                        </div>
                    `;
                });
                form.innerHTML = htmlContent;
            } else {
                form.innerHTML = `<div style='padding:20px; text-align:center; color:#dc2626;'>No hay textos públicos disponibles.</div>`;
            }
        })
        .catch(() => {
            form.innerHTML = `<div style='padding:20px; text-align:center; color:#dc2626;'>Error al cargar los textos públicos.</div>`;
        });
}

// Función local para contar palabras en un texto
function contarPalabrasEnTexto(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
}
