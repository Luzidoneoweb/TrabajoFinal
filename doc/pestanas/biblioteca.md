# Documentación del archivo `pestanas/biblioteca.php`

## Descripción
El archivo `biblioteca.php` es un fragmento de código HTML que se incluye en `php/conten_logueado.php`. Su propósito es proporcionar la estructura básica y las plantillas HTML para la sección de la biblioteca de textos públicos. La lógica para cargar y renderizar el contenido dinámicamente se encuentra en el archivo JavaScript asociado.

## Estructura HTML
El archivo contiene un contenedor principal (`.contenedor-biblioteca`) y dos plantillas (`<template>`) que se utilizarán para renderizar dinámicamente las categorías y los textos:

### 1. Contenedor Principal (`.contenedor-biblioteca`)
*   Contiene un `div` con la clase `lista-textos-biblioteca` y el ID `bulkForm`. Este `div` es el punto donde JavaScript insertará el contenido de las categorías y los textos.

### 2. Plantilla de Categoría (`#template-categoria`)
Esta plantilla define la estructura HTML para mostrar una categoría de textos:
*   **Sección de Categoría (`.seccion-categoria`):** Contenedor principal para una categoría.
*   **Encabezado de Categoría (`.encabezado-categoria`):**
    *   Título de la categoría (`.nombre-categoria`).
    *   Traducción de la categoría (`.traduccion-categoria`).
*   **Descripción de Categoría (`.categoria-descripcion`):**
    *   Descripción original (`.descripcion-categoria`).
    *   Descripción traducida (`.descripcion-traducida`).
*   **Número de Textos (`.numero-textos`):**
    *   Muestra el total de textos en esa categoría (`.total-textos`).
*   **Lista de Textos de Categoría (`.lista-textos-categoria`):** Un `div` oculto (`display: none;`) que contendrá los textos individuales de esa categoría, insertados desde la plantilla de texto.

### 3. Plantilla de Texto (`#template-texto`)
Esta plantilla define la estructura HTML para mostrar un texto individual dentro de una categoría:
*   **Ítem de Texto (`.item-texto`):** Contenedor principal para un texto.
*   **Encabezado de Texto (`.encabezado-texto`):**
    *   Título del texto (`.titulo-texto`).
    *   Traducción del título (`.traduccion-titulo`).
*   **Previsualización del Contenido (`.contenido-texto-preview`):**
    *   Un párrafo para mostrar una vista previa del contenido del texto (`.preview-contenido`).
*   **Botón Leer Texto (`.btn-leer-texto`):** Un botón para leer el texto completo, con un atributo `data-texto-id` para identificar el texto.

## Archivos JavaScript incluidos
*   `pestanas/js/cargar_biblioteca.js`: Este es el script principal que se encarga de:
    *   Realizar peticiones a un endpoint PHP (probablemente `pestanas/php/get_biblioteca_contenido.php` o similar) para obtener los datos de categorías y textos.
    *   Clonar y poblar las plantillas `#template-categoria` y `#template-texto` con los datos recibidos.
    *   Insertar el contenido renderizado en el `div` `#bulkForm`.
    *   Manejar la lógica de mostrar/ocultar las listas de textos dentro de cada categoría y la acción del botón "Leer".

## Archivos PHP relacionados
*   `php/conten_logueado.php`: Incluye este archivo para mostrar el contenido de la pestaña "Biblioteca".
*   `pestanas/php/get_biblioteca_contenido.php` (o similar): Se espera que exista un endpoint PHP que proporcione los datos de las categorías y textos públicos para ser consumidos por `pestanas/js/cargar_biblioteca.js`.
*   `pestanas/php/get_categoria.php`: Podría ser un endpoint para obtener categorías específicas.
