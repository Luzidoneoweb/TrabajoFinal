# Documentación del archivo `pestanas/js/global.js`

## Descripción
El archivo `pestanas/js/global.js` contiene funciones JavaScript globales específicas para la gestión de las pestañas dentro de la sección de usuario logueado de la aplicación. Incluye la lógica para mostrar notificaciones flotantes y, lo más importante, la función `cambiarPestana` que controla la navegación y la visualización de los diferentes paneles de contenido de las pestañas.

## Funciones Clave

### 1. `mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000)`
*   **Propósito:** Muestra un mensaje de notificación flotante en la interfaz de usuario.
*   **Parámetros:**
    *   `mensaje`: El texto a mostrar en la notificación.
    *   `tipo`: (Opcional) El tipo de notificación ('info', 'exito', 'error'), que aplica diferentes estilos CSS. Por defecto es 'info'.
    *   `duracion`: (Opcional) El tiempo en milisegundos que la notificación permanecerá visible. Por defecto es 3000ms (3 segundos).
*   **Funcionamiento:**
    *   Obtiene las referencias a los elementos DOM de la notificación (`#notificacion-flotante` y `#notificacion-mensaje`).
    *   Establece el texto del mensaje y añade clases CSS para mostrar la notificación y aplicar el estilo de tipo (`exito` o `error`).
    *   Utiliza `setTimeout` para ocultar la notificación después de la `duracion` especificada.

### 2. `window.cambiarPestana(nombrePestana)`
*   **Propósito:** Función global para cambiar la pestaña activa en la interfaz de usuario logueada.
*   **Parámetro:** `nombrePestana` (string) - El nombre de la pestaña a activar (ej. 'progreso', 'textos', 'lectura').
*   **Funcionamiento:**
    *   **Mensaje de Carga:** Muestra un mensaje de carga (`window.showLoadingMessage()`) para ciertas pestañas (`textos`, `practicas`, `lectura`) para indicar que el contenido se está cargando.
    *   **Detener Lectura:** Si el `window.MotorLectura` está activo, lo detiene y cancela `speechSynthesis` para evitar que la voz continúe al cambiar de pestaña.
    *   **Restablecer Clases:** Elimina la clase `activa` de todos los botones de pestaña y la clase `activo` de todos los paneles de contenido.
    *   **Restaurar Scroll:** Elimina la clase `lectura-activa` del `body` y restaura las propiedades de `overflow` en `html` y `body` para permitir el scroll normal si se estaba en la pestaña de lectura.
    *   **Activar Pestaña:** Si la pestaña no es 'lectura' (que no tiene un botón directo en el menú), añade la clase `activa` al botón de la pestaña correspondiente.
    *   **Mostrar Panel:** Añade la clase `activo` al panel de contenido correspondiente (ej. `panelProgreso` para `nombrePestana='progreso'`).
    *   **Manejo de Pestaña de Lectura:**
        *   Si el panel activado es `panelLectura`, añade la clase `lectura-activa` al `body` y oculta el scroll en `html` y `body` para una experiencia de lectura inmersiva.
        *   Oculta temporalmente el contenido del lector (`.contenedor-lectura`) para que no se vea mientras se carga.
    *   **Cerrar Menú Móvil:** Si el menú de navegación de usuario (`navegacionUsuario`) está abierto, lo cierra.
    *   **Responsabilidad de Ocultar Carga:** Nota importante: esta función *no* oculta el mensaje de carga automáticamente. Cada script específico de la pestaña (ej. `texto.js`, `practicas.js`, `lectura.js`) es responsable de ocultar el mensaje una vez que su contenido ha sido completamente cargado.

## Event Listeners
*   **Botones de Pestaña:** Se añade un `event listener` a todos los elementos con la clase `pestana`. Al hacer clic, se obtiene el valor del atributo `data-pestana` y se llama a `cambiarPestana()` con ese valor.

## Archivos relacionados
*   `php/menu_logueado.php`: Contiene los botones de las pestañas (`.pestana`).
*   `php/conten_logueado.php`: Contiene los paneles de contenido de las pestañas (`.panel-pestana`).
*   `js/global.js`: El archivo `global.js` principal de la aplicación, que define `window.showLoadingMessage` y `window.hideLoadingMessage` (aunque no se usan directamente aquí, se asume su existencia). También define `navegacionUsuario`.
*   `pestanas/js/texto.js`, `pestanas/js/practicas.js`, `pestanas/js/lectura.js`, etc.: Scripts específicos de cada pestaña que son responsables de cargar su contenido y ocultar el mensaje de carga.
*   `lector/reading-engine.js`: Define `window.MotorLectura`.
