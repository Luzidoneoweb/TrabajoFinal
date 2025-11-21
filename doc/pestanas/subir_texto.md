# Documentación del archivo `pestanas/subir_texto.php`

## Descripción
El archivo `subir_texto.php` es un fragmento de código PHP y HTML que se incluye en `php/conten_logueado.php`. Su propósito es proporcionar la interfaz de usuario para que los usuarios puedan subir nuevos textos a la aplicación. Incluye campos para el título y el contenido del texto, y campos adicionales (como "Texto público" y "Categoría") que solo son visibles para usuarios con rol de administrador.

## Lógica PHP
1.  **Inicio de Sesión:**
    *   Verifica si la sesión ya está iniciada (`session_status() === PHP_SESSION_NONE`) y la inicia si no lo está.
2.  **Verificación de Rol de Administrador:**
    *   Establece la variable `$es_admin` a `true` si `$_SESSION['is_admin']` está definido y es `true`. Esto controla la visibilidad de ciertos campos en el formulario.

## Estructura HTML
El archivo se organiza en un contenedor principal (`.contenedor-subir-texto`) que incluye:

### 1. Título
*   Un encabezado `<h2>` con el texto "Subir nuevo texto".

### 2. Formulario de Subida (`.formulario-subir`)
El formulario está dividido en dos columnas:

#### Columna Izquierda (`.columna-izquierda`)
*   **Campo Título:**
    *   `label` y `input` de tipo `text` con ID `titulo`.
    *   Un párrafo de ayuda que indica que el título se generará automáticamente si no se proporciona.
*   **Campo Contenido:**
    *   `label` y `textarea` con ID `contenido`.
*   **Campos Exclusivos para Administradores (condicional `<?php if ($es_admin): ?>`):**
    *   **Checkbox "Texto público":** `input` de tipo `checkbox` con ID `texto_publico`. Por defecto, está marcado.
    *   **Campo Categoría:**
        *   `label` y `select` con ID `categoria`.
        *   Un `option` por defecto para "Selecciona categoría". Las opciones de categoría se espera que se carguen dinámicamente con JavaScript.
*   **Botón Subir:** `button` de tipo `button` con ID `btn_subir_texto`.

#### Columna Derecha (`.columna-derecha`)
*   Contiene dos `div` con la clase `anuncio`, que son marcadores de posición para anuncios.

## Archivos JavaScript incluidos
*   `pestanas/js/subir_texto.js`: Este es el script principal que se espera que maneje la lógica de esta sección, incluyendo:
    *   La lógica para enviar el formulario de subida de texto (probablemente a un endpoint PHP como `pestanas/php/subirTextoFuncion.php`).
    *   La generación automática del título si el usuario no lo proporciona.
    *   La carga dinámica de las opciones de categoría en el `select` (si el usuario es administrador).

## Archivos PHP relacionados
*   `php/conten_logueado.php`: Incluye este archivo para mostrar el contenido de la pestaña "Subir Texto".
*   `pestanas/php/subirTextoFuncion.php`: Se espera que sea el endpoint PHP que procesa la subida del texto.
*   `pestanas/php/get_categoria.php`: Podría ser un endpoint para obtener las categorías disponibles.
