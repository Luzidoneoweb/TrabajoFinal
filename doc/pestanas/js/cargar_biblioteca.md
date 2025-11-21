# Documentación del archivo `pestanas/js/cargar_biblioteca.js`

## Descripción
El archivo `cargar_biblioteca.js` es el script principal que gestiona la carga y visualización de la sección "Biblioteca" de la aplicación. Se encarga de obtener los datos de categorías y textos públicos desde el servidor, renderizarlos dinámicamente en la interfaz utilizando plantillas HTML, y configurar la interactividad, como la apertura de textos para lectura y el comportamiento de acordeón para las categorías.

## Funciones Clave

### 1. `cargarBiblioteca()` (función global)
*   **Propósito:** Carga el contenido de la biblioteca (categorías con textos públicos) y lo renderiza en la interfaz.
*   **Funcionamiento:**
    1.  **Obtener Elementos DOM:** Obtiene referencias al contenedor principal (`#bulkForm`) y a las plantillas HTML (`#template-categoria`, `#template-texto`).
    2.  **Validación:** Verifica que todos los elementos necesarios estén presentes. Si falta alguno, registra un error y detiene la ejecución.
    3.  **Petición `fetch`:** Realiza una petición `fetch` (GET) a `/trabajoFinal/pestanas/php/get_biblioteca_contenido.php` para obtener los datos de categorías y textos.
    4.  **Manejo de Respuesta Exitosa (`.then(data => ...)`):**
        *   Si `data.success` es `true` y `data.categorias` contiene elementos:
            *   Limpia el contenido existente de `contenedorTextos`.
            *   Itera sobre cada `categoria` recibida:
                *   Clona la plantilla `#template-categoria`.
                *   Rellena el `nombre-categoria` con el nombre de la categoría.
                *   Obtiene el contenedor de la lista de textos dentro de la categoría (`.lista-textos-categoria`).
                *   Itera sobre cada `texto` dentro de la categoría:
                    *   Clona la plantilla `#template-texto`.
                    *   Rellena el `titulo-texto`, `traduccion-titulo` y `preview-contenido` con los datos del texto.
                    *   Establece el atributo `data-texto-id` del botón "Leer" con el ID del texto.
                    *   Añade el texto clonado a la `listaTextosContenedor`.
                *   Añade la categoría clonada al `contenedorTextos`.
            *   **Event Listeners para Botones "Leer":** Después de renderizar todos los textos, añade un `event listener` a cada botón `.btn-leer-texto` para que, al hacer clic, llame a `abrirTextoLectura()` con el ID del texto.
            *   **Acordeón de Categorías:** Añade un `event listener` a cada `.nombre-categoria` para alternar la visibilidad de su `.lista-textos-categoria` (comportamiento de acordeón).
        *   Si no hay categorías o `data.success` es `false`, muestra un mensaje "No hay textos disponibles."
    5.  **Manejo de Errores de `fetch` (`.catch(error => ...)`):**
        *   Registra el error en consola y muestra un mensaje de error en la interfaz.

### 2. `abrirTextoLectura(textoId)` (función local)
*   **Propósito:** Gestiona la apertura de un texto específico en la pestaña de lectura.
*   **Funcionamiento:**
    *   Actualmente, solo registra el ID del texto en consola y muestra una alerta.
    *   **Nota:** En una implementación completa, esta función debería guardar el `textoId` en `localStorage` (como hace `pestanas/js/texto.js`) y luego llamar a `window.cambiarPestana('lectura')` para navegar a la pestaña de lectura y cargar el texto.

## Inicialización
*   El script se ejecuta automáticamente cuando el DOM está listo (`DOMContentLoaded`) o inmediatamente si el DOM ya está cargado, llamando a `cargarBiblioteca()`.
*   La función `cargarBiblioteca` también se exporta al objeto `window` para permitir llamadas manuales desde otros scripts si es necesario.

## Archivos relacionados
*   `pestanas/biblioteca.php`: Incluye este script y proporciona la estructura HTML con los contenedores y plantillas que este script utiliza.
*   `pestanas/php/get_biblioteca_contenido.php`: Endpoint PHP al que este script hace la petición `fetch` para obtener los datos de la biblioteca.
*   `pestanas/js/global.js`: Contiene `window.cambiarPestana`, que sería utilizada por `abrirTextoLectura` en una implementación completa.
