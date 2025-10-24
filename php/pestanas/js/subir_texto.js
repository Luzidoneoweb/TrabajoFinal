document.addEventListener('DOMContentLoaded', function() {
    const checkboxTextoPublico = document.getElementById('texto_publico');
    const campoCategoria = document.getElementById('campo_categoria');

    // Función para actualizar la visibilidad del campo de categoría
    function actualizarVisibilidadCategoria() {
        if (checkboxTextoPublico.checked) {
            campoCategoria.style.display = 'block';
        } else {
            campoCategoria.style.display = 'none';
        }
    }

    // Escuchar cambios en el checkbox
    checkboxTextoPublico.addEventListener('change', actualizarVisibilidadCategoria);

    // Ejecutar al cargar la página para establecer el estado inicial
    actualizarVisibilidadCategoria();
});
