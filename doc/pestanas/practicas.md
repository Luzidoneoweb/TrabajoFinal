# Documentación del archivo `pestanas/practicas.php`

## Descripción
El archivo `practicas.php` es un fragmento de código PHP y HTML que se incluye en `php/conten_logueado.php`. Su propósito es proporcionar la interfaz de usuario para que los usuarios puedan seleccionar diferentes modos de práctica de vocabulario y elegir un texto específico para practicar.

## Lógica PHP
*   `require_once $_SERVER['DOCUMENT_ROOT'] . '/trabajoFinal/php/login_seguridad/seguridad.php';`: Incluye el archivo de seguridad para asegurar que las funciones de seguridad estén disponibles.

## Estructura HTML
El archivo se organiza en un contenedor principal (`.contenedor-principal-practicas`) que incluye:

### 1. Tarjeta de Practicar Vocabulario (`.tarjeta-practicar-vocabulario`)
*   **Título (`.titulo-practicar-vocabulario`):** "Practicar Vocabulario".
*   **Grupo de Botones de Modo (`.grupo-botones-modo`):** Contiene botones para seleccionar el modo de práctica:
    *   "Selección múltiple" (`data-modo="seleccion-multiple"`)
    *   "Escribir palabra" (`data-modo="escribir-palabra"`)
    *   "Escribir frases" (`data-modo="escribir-frases"`)
*   **Subtítulo (`.subtitulo-elegir-texto`):** "Elige un texto para practicar palabras:".
*   **Selector de Texto de Práctica (`.selector-texto-practica`):**
    *   Un elemento `<select>` con el ID `selectorTextosPractica` que se espera sea poblado dinámicamente con opciones de textos mediante JavaScript.
*   **Información de Textos de Práctica (`.info-textos-practica`):**
    *   Párrafos que explican la diferencia entre "Mis textos" y "Textos públicos".

## Archivos JavaScript incluidos
*   `pestanas/js/practicas.js`: Este es el script principal que se espera que maneje la lógica de esta sección, incluyendo:
    *   Cargar dinámicamente las opciones de textos en el `selectorTextosPractica`.
    *   Manejar los eventos de clic en los botones de modo para iniciar diferentes tipos de práctica.
    *   Gestionar la selección de textos.

## Archivos PHP relacionados
*   `php/conten_logueado.php`: Incluye este archivo para mostrar el contenido de la pestaña "Prácticas".
*   `php/login_seguridad/seguridad.php`: Proporciona funciones de seguridad.
*   `practica/ajax_practice_content.php` o `practica/ajax_practice_data.php`: Es probable que existan endpoints PHP en el directorio `practica/` que se utilicen para obtener los textos disponibles para la práctica y para gestionar los datos de las sesiones de práctica.
