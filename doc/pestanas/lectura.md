# Documentación del archivo `pestanas/lectura.php`

## Descripción
El archivo `lectura.php` es un fragmento de código PHP y HTML que se incluye en `php/conten_logueado.php`. Su propósito es proporcionar la interfaz de usuario para la lectura de textos, permitiendo a los usuarios interactuar con el contenido, ver traducciones, seguir el progreso de lectura y utilizar funciones de voz.

## Lógica PHP
*   `require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/php/login_seguridad/seguridad.php';`: Incluye el archivo de seguridad.
*   `include $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/pestanas/php/loading_message.php';`: Incluye un mensaje de carga que se muestra mientras se carga el contenido.

## Archivos CSS incluidos
*   `pestanas/css/loading_message.css`: Estilos para el mensaje de carga.
*   `css/floating-menu.css`: Estilos para menús flotantes o elementos similares.

## Estructura HTML
El archivo se organiza en un contenedor principal (`.lectura`) que incluye:

### 1. Contenedor de Lectura (`.contenedor-lectura`)
*   **Encabezado de Lectura (`.encabezado-lectura`):**
    *   Botón "Volver" (`.btn-volver`) que redirige a la pestaña "Mis Textos".
    *   Contenedor de títulos (`.titulos-lectura-contenedor`) con `h1` para el título original (`.titulo-lectura`) y su traducción (`.titulo-lectura-traduccion`).
    *   Barra de progreso de lectura (`.progreso-lectura`) con un porcentaje dinámico.
*   **Encabezado Secundario de Lectura (`.encabezado-secundario-lectura`):**
    *   Una versión compacta del encabezado, oculta por defecto, que aparece al hacer scroll.
    *   Incluye botones de acción lateral para "Notas" y "Vocabulario".
*   **Área de Frases (`.zona-frases`):**
    *   Contenedor para la frase original (`.frase-original`) y su traducción completa (`.frase-traduccion-original`).
    *   También incluye un `div` para la traducción resaltada (`.frase-traduccion`).
*   **Controles Inferiores (`.controles-lectura`):**
    *   **Paginación (`.paginacion`):** Botones "Anterior" y "Siguiente" para navegar entre páginas de texto, y un indicador de estado de página.
    *   **Botón Play (`.btn-play`):** Para reproducir o detener la lectura de voz.

## Archivos JavaScript incluidos
*   `pestanas/js/loading_message.js`: Lógica para mostrar/ocultar el mensaje de carga.
*   `lector/electron-voice-integration.js`: Integración con el sistema de voz (posiblemente para Electron o un motor de voz específico).
*   `lector/reading-engine.js`: Motor de lectura que gestiona la reproducción de voz.
*   `traducion_api/lectura-translation-functions.js`: Funciones relacionadas con la traducción de texto durante la lectura.
*   `pestanas/js/text-utils.js`: Utilidades para el manejo de texto.
*   `traducion_api/palabras/text-management.js`: Gestión de palabras guardadas.
*   `pestanas/js/lectura.js`: **Script principal que maneja la lógica de la interfaz de lectura**, incluyendo la carga del texto, paginación, interacción con palabras para traducción, y la integración con el motor de voz.
*   `traducion_api/palabras/multi-word-selection.js`: Lógica para la selección de múltiples palabras.
*   `pestanas/js/modalFinalizacion.js`: Script para un modal que aparece al finalizar la lectura.

## Archivos PHP relacionados
*   `php/conten_logueado.php`: Incluye este archivo para mostrar el contenido de la pestaña "Lectura".
*   `pestanas/php/get_lectura_data.php` (o similar): Se espera que exista un endpoint PHP que proporcione el contenido del texto a leer, su título y traducción.
