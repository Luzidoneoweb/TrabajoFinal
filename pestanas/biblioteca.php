
<div class="contenedor-biblioteca">
    <div class="lista-textos-biblioteca" id="bulkForm">
    </div>
</div>

<template id="template-categoria">
    <div class="seccion-categoria">
        <div class="encabezado-categoria">
            <h3 class="nombre-categoria"></h3>
        </div>
        <div class="lista-textos-categoria" style="display: none;"></div>
    </div>
</template>

<template id="template-texto">
    <div class="item-texto">
        <div class="encabezado-texto">
            <h4 class="titulo-texto"></h4>
            <p class="traduccion-titulo"></p>
        </div>
        <div class="contenido-texto-preview">
            <p class="preview-contenido"></p>
        </div>
        <button class="btn-leer-texto" data-texto-id="">Leer</button>
    </div>
</template>


<script src="pestanas/js/cargar_biblioteca.js"></script>
