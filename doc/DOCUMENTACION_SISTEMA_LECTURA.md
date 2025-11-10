# Documentación del Sistema de Lectura

Este documento describe el funcionamiento del sistema de lectura, los archivos que intervienen y su rol dentro de la aplicación.

## Visión General

El sistema de lectura permite a los usuarios leer textos cargados dinámicamente, con funcionalidades como paginación, resaltado de frases y lectura en voz alta. Está diseñado para ser adaptable a diferentes tamaños de pantalla y niveles de zoom.

## Archivos Involucrados

Los siguientes archivos son los componentes clave del sistema de lectura:

### 1. `pestanas/lectura.php`

*   **Descripción:** Es el archivo de vista principal que renderiza la interfaz de usuario del lector. Contiene la estructura HTML básica, incluyendo el encabezado, la zona de frases, los botones de paginación y el botón de reproducción/pausa.
*   **Función:** Carga los estilos CSS (`pestanas/css/lectura.css`) y los scripts JavaScript (`pestanas/js/lectura.js`, `lector/reading-engine.js`, `lector/electron-voice-integration.js`) necesarios para el funcionamiento del lector.

### 2. `pestanas/css/lectura.css`

*   **Descripción:** Contiene todos los estilos CSS específicos para la página de lectura.
*   **Función:** Define la apariencia visual de los elementos del lector, como el contenedor principal, el encabezado, las frases, la paginación y los botones. Incluye reglas para la adaptación responsiva y el manejo del overflow.

### 3. `pestanas/js/lectura.js`

*   **Descripción:** Es el script JavaScript principal que maneja la lógica de la interfaz de usuario y la interacción del lector.
*   **Función:**
    *   Carga el contenido del texto desde el servidor (`pestanas/php/get_lectura_data.php`).
    *   Divide el texto en frases para la paginación.
    *   Calcula dinámicamente cuántas frases caben por página según el tamaño de la pantalla y el zoom.
    *   Maneja la navegación entre páginas (botones "Anterior" y "Siguiente").
    *   Actualiza el estado de la paginación y el progreso de lectura.
    *   Controla el botón de reproducción/pausa, interactuando con `MotorLectura`.
    *   **Implementa la detención automática de la lectura** cuando el usuario cambia de pestaña o abandona la página, utilizando los eventos `visibilitychange` y `beforeunload`.

### 4. `lector/reading-engine.js`

*   **Descripción:** Es el motor de lectura de texto a voz. Proporciona una API para iniciar, pausar, reanudar y detener la lectura de párrafos.
*   **Función:**
    *   Interactúa con la API `SpeechSynthesisUtterance` del navegador para la lectura en voz alta.
    *   Gestiona el estado de la lectura (`inactivo`, `reproduciendo`, `pausado`).
    *   Resalta el párrafo actual que se está leyendo.
    *   Maneja la transición automática entre párrafos y páginas durante la lectura continua.
    *   Define cómo se detiene la lectura y cómo se actualiza el estado visual del botón de reproducción/pausa.

### 5. `lector/electron-voice-integration.js`

*   **Descripción:** Este script se encarga de la integración y configuración de la librería ResponsiveVoice para la síntesis de voz, asegurando su funcionamiento tanto en entornos web como en Electron.
*   **Función:**
    *   Carga dinámicamente la librería ResponsiveVoice desde un CDN.
    *   Proporciona funciones globales (`window.leerTexto`, `window.detenerLectura`, etc.) que actúan como una interfaz unificada para la síntesis de voz.
    *   Silencia los logs verbosos de ResponsiveVoice para mantener la consola limpia.

### 6. `pestanas/php/get_lectura_data.php`

*   **Descripción:** Es un endpoint PHP que se encarga de obtener los datos de un texto específico desde la base de datos.
*   **Función:** Recibe un ID de texto y devuelve el título, contenido original y contenido traducido del texto en formato JSON. Es consumido por `pestanas/js/lectura.js` para cargar el contenido en el lector.

## Flujo de Funcionamiento

1.  **Carga Inicial:** `pestanas/lectura.php` se carga en el navegador, trayendo consigo los estilos CSS y los scripts JavaScript.
2.  **Inicialización JS:** `pestanas/js/lectura.js` se ejecuta al cargar el DOM. Detecta la activación del panel de lectura.
3.  **Carga de Contenido:** Cuando el panel de lectura está activo, `pestanas/js/lectura.js` realiza una petición a `pestanas/php/get_lectura_data.php` para obtener el texto.
4.  **Procesamiento del Texto:** El texto recibido se divide en frases y se calcula la paginación dinámica.
5.  **Renderizado:** `pestanas/js/lectura.js` renderiza la página actual con las frases correspondientes.
6.  **Control de Voz:** `lector/electron-voice-integration.js` carga ResponsiveVoice. `lector/reading-engine.js` proporciona la lógica para la lectura en voz alta, interactuando con ResponsiveVoice a través de las funciones expuestas globalmente.
7.  **Interacción del Usuario:**
    *   Los botones de paginación en `pestanas/lectura.php` son manejados por `pestanas/js/lectura.js`.
    *   El botón de reproducción/pausa en `pestanas/lectura.php` es manejado por `pestanas/js/lectura.js`, que a su vez llama a las funciones de `MotorLectura` en `lector/reading-engine.js`.
8.  **Detención Automática:** Si el usuario cambia de pestaña o sale de la página, los `event listeners` en `pestanas/js/lectura.js` detectan estos eventos y llaman a `MotorLectura.detener()` para parar la lectura y restablecer su estado.
