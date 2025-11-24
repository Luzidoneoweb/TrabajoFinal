# Análisis de Código: Funciones Duplicadas, Reutilizables y Archivos No Utilizados

Este documento presenta un análisis del código JavaScript y PHP de la aplicación, identificando áreas de mejora en cuanto a reutilización de código y limpieza de archivos no utilizados.

## 1. Funciones Duplicadas o con Lógica Similar

Se han identificado las siguientes funciones o bloques de lógica que presentan duplicidad o una similitud que sugiere una posible refactorización para mejorar la mantenibilidad y reducir el tamaño del código:

*   **`mostrarNotificacion` / `mostrarMensaje`:**
    *   `pestanas/js/global.js` define `mostrarNotificacion`.
    *   `pestanas/js/subir_texto.js` define `mostrarMensaje`.
    *   Ambas funciones tienen el mismo propósito: mostrar mensajes flotantes al usuario. Aunque `mostrarMensaje` tiene estilos en línea, la lógica subyacente es idéntica.
    *   **Recomendación:** Unificar estas funciones en una única función global (por ejemplo, en `js/global.js` o `pestanas/js/global.js` si se decide que es más apropiado para el contexto de pestañas) y que todos los módulos la utilicen. Los estilos podrían ser gestionados por CSS.

*   **Lógica de `fetch` para obtener textos:**
    *   `pestanas/js/texto.js` (`cargarTextos`) y `pestanas/js/practicas.js` (`cargarTextosPractica`) realizan una petición `fetch` a `pestanas/php/get_textos.php` con una estructura muy similar para obtener la lista de textos.
    *   **Recomendación:** Crear una función de utilidad (`fetchTextosUsuario()`) que encapsule esta lógica de `fetch` y el manejo básico de la respuesta, y que sea llamada por `cargarTextos` y `cargarTextosPractica`.

*   **Lógica de `fetch` para obtener categorías:**
    *   `pestanas/js/subir_texto.js` (`cargarCategorias`) realiza una petición `fetch` a `pestanas/php/get_categoria.php`.
    *   **Recomendación:** Si otras partes de la aplicación necesitan cargar categorías, esta lógica podría ser una función reutilizable.

*   **Manejo de `DOMContentLoaded` y `MutationObserver` para activación de paneles:**
    *   `pestanas/js/texto.js`, `pestanas/js/practicas.js` y `pestanas/js/lectura.js` tienen bloques de código casi idénticos para detectar cuando su panel (`panelTextos`, `panelPracticas`, `panelLectura`) se activa y luego llamar a su función de carga principal.
    *   **Recomendación:** Centralizar esta lógica en `pestanas/js/global.js` con una función genérica que reciba el ID del panel y la función de carga a ejecutar. Esto reduciría la duplicación y simplificaría la gestión de la activación de pestañas.

## 2. Funciones Reutilizables (ya expuestas o con potencial)

Muchas funciones ya están expuestas globalmente (`window.nombreFuncion`), lo que facilita su reutilización. Aquí se listan las más destacadas y algunas con potencial de serlo:

### Funciones JavaScript Globales (ya expuestas en `window`)

*   **`js/global.js`:**
    *   `window.verificarEstadoSesion()`: Fundamental para la autenticación.
    *   `window.toggleEncabezadoPrincipal(ocultar)`: Para controlar la visibilidad del encabezado.
    *   `window.cambiarPestana(nombrePestana)` (en `pestanas/js/global.js`): Esencial para la navegación entre pestañas.
    *   `window.showLoadingMessage()` y `window.hideLoadingMessage()` (en `pestanas/js/loading_message.js`): Para mostrar/ocultar indicadores de carga.
    *   `window.mostrarNotificacion()` (en `pestanas/js/global.js`): Para mensajes al usuario.

*   **`traducion_api/lectura-translation-functions.js`:**
    *   `window.traducirFrase(fraseOriginal, textId)`: Para traducir frases.
    *   `window.guardarTraduccionEnBD(textId, content, translation)`: Para persistir traducciones de frases.
    *   `window.cargarCacheTraducciones(textId)`: Para precargar traducciones.
    *   `window.traducirTitulo(title, textId)`: Para traducir títulos.
    *   `window.guardarTraduccionTituloEnBD(textId, title, translation)`: Para persistir traducciones de títulos.
    *   `window.guardarTraduccionCompletaEnBD(textId, contentTranslation)`: Para persistir la traducción completa de un texto.
    *   `window.construirTextoCompletoTraducido(frasesTraduccion)`: Utilidad para unir frases traducidas.

*   **`pestanas/js/text-utils.js`:**
    *   `window.dividirEnFrases(texto, limitePalabras)`: Utilidad para dividir textos.
    *   `window.truncarTexto(texto, limitePalabras)`: Utilidad para truncar textos.

*   **`pestanas/js/texto.js`:**
    *   `cargarTextos()`: Aunque no está en `window`, es una función principal que se llama al activar la pestaña. Podría ser expuesta si se necesita recargar la lista desde otro lugar.

*   **`lector/electron-voice-integration.js`:**
    *   `window.leerTexto(...)`, `window.detenerLectura()`, `window.estaLeyendo()`, `window.pausarLectura()`, `window.reanudarLectura()`: API de voz.
    *   `window.obtenerSistemaVozListo()`: Promesa para asegurar la inicialización del sistema de voz.

*   **`lector/reading-engine.js`:**
    *   `window.MotorLectura`: Objeto con toda la lógica del motor de lectura.
    *   `window.iniciarLectura()`, `window.iniciarLecturaDesdeIndice()`, `window.pausarVoz()`, `window.reanudarVoz()`, `window.detenerLectura()`: Funciones de control del motor de lectura.

*   **`pestanas/php/text-management.js`:**
    *   `window.saveTranslatedWord(...)`: Para guardar palabras traducidas.
    *   `window.showFloatingButton()`, `window.hideFloatingButton()`, `window.updateFloatingButton()`: Para gestionar botones flotantes.
    *   `window.continueFromLastParagraph()`: Para reanudar lectura.
    *   `window.countWordsInText(text)`, `window.countLettersInText(text)`: Utilidades de conteo.

*   **`pestanas/js/modalFinalizacion.js`:**
    *   `window.mostrarModalFinalizacion(...)`: Para mostrar el modal de fin de lectura.

*   **`pestanas/js/cargar_biblioteca.js`:**
    *   `window.cargarBiblioteca()`: Para cargar la biblioteca.

*   **`pestanas/js/practicas.js`:**
    *   `cargarTextosPractica()`: Podría ser expuesta globalmente si se necesita recargar el selector de textos de práctica desde otro lugar.

*   **`pestanas/js/subir_texto.js`:**
    *   `cargarCategorias()`: Podría ser expuesta globalmente si se necesita recargar las categorías desde otro lugar.

*   **`pestanas/js/cargar-estadisticas.js`:**
    *   `window.cargarTextosSubidos()`: Para actualizar el contador de textos subidos.
    *   `window.cargarPalabrasGuardadas()`: Para actualizar el contador de palabras guardadas.

### Potencial de Reutilización Adicional

*   **Manejo de Notificaciones/Mensajes:** Como se mencionó en duplicados, una única función global para mostrar notificaciones sería ideal.
*   **Funciones de `fetch` genéricas:** Podría crearse una función `fetchApi(url, options)` que maneje la verificación `response.ok` y la conversión a JSON, reduciendo la repetición en cada llamada `fetch`.

## 3. Archivos No Utilizados Actualmente

Basado en la estructura de archivos proporcionada y las inclusiones/referencias encontradas en la documentación, los siguientes archivos parecen no estar siendo utilizados directamente en el flujo principal de la aplicación o no se han encontrado referencias explícitas a ellos en los archivos analizados:

*   **`db/` (directorio):** Contiene `conexion.php`. Aunque `conexion.php` es crucial y se incluye en varios scripts PHP, el directorio en sí no es un archivo ejecutable.
*   **`doc/` (directorio):** Contiene archivos de documentación. No son parte del código de la aplicación en ejecución.
*   **`img/` (directorio):** Contiene imágenes. Se utilizan en el HTML (`index.php`), pero no son archivos de código ejecutables.
*   **`lector/voice-test.js`:** No se encontró ninguna inclusión o referencia a este archivo en los scripts analizados. Parece ser un archivo de prueba.
*   **`php/login_seguridad/auto_login.php`:** Aunque `seguridad.php` menciona la funcionalidad de "recordarme", no se encontró una inclusión directa o llamada a este script en `index.php` o `auth_auntentif.js`. Podría ser un endpoint al que se llama implícitamente o que se usa en otro flujo no cubierto.
*   **`php/login_seguridad/create_admin.php`:** No se encontró ninguna inclusión o referencia a este script. Parece ser un script de utilidad para crear administradores, no parte del flujo normal de la aplicación.
*   **`php/login_seguridad/modal_login.php`:** Este archivo es incluido por `index.php` y su contenido es manipulado por `js/login_registos/auth_auntentif.js`. No es un archivo "no utilizado", pero es un fragmento HTML/PHP que se incluye.
*   **`php/login_seguridad/login.php` y `php/login_seguridad/registros.php`:** Son endpoints PHP a los que `js/login_registos/auth_auntentif.js` hace peticiones `fetch`. No son "no utilizados", sino que son APIs.
*   **`php/login_seguridad/verificar_sesion.php` y `php/login_seguridad/logout.php`:** Son endpoints PHP a los que `js/global.js` hace peticiones `fetch`. No son "no utilizados", sino que son APIs.
*   **`practica/` (directorio):**
    *   `practica/ajax_practice_content.php`
    *   `practica/ajax_practice_data.php`
    *   `practica/get_practice_stats.php`
    *   `practica/progreso/ajax_progress_content.php`
    *   `practica/progreso/save_practice_progress.php`
    *   `practica/progreso/save_practice_time.php`
    *   `practica/progreso/save_reading_time.php`
    *   Aunque `pestanas/practicas.php` y `pestanas/js/practicas.js` están relacionados con la práctica, no se encontraron llamadas `fetch` explícitas a estos archivos en los scripts JavaScript analizados. Es muy probable que `pestanas/js/practicas.js` deba hacer llamadas a algunos de estos endpoints para cargar datos y guardar progreso. Actualmente, no hay evidencia de su uso directo en los JS analizados.
*   **`textoPublic/` (directorio):**
    *   `textoPublic/categories.php`
    *   `textoPublic/get_text_content.php`
    *   `textoPublic/public_texts.php`
    *   No se encontraron llamadas `fetch` explícitas a estos archivos en los scripts JavaScript analizados. `pestanas/js/cargar_biblioteca.js` hace una llamada a `pestanas/php/get_biblioteca_contenido.php`, que a su vez podría usar estos archivos, pero no hay una referencia directa desde el frontend.
*   **`traducion_api/content_functions.php`:** No se encontró ninguna inclusión o referencia a este script.
*   **`traducion_api/diccionario.php`:** No se encontró ninguna inclusión o referencia a este script.
*   **`traducion_api/get_test_text_data.php`:** No se encontró ninguna inclusión o referencia a este script. Parece ser un archivo de prueba.
*   **`traducion_api/translate.php`:** Es un endpoint PHP utilizado por `traducion_api/lectura-translation-functions.js` y `pestanas/php/multi-word-selection.js`. No es "no utilizado", sino una API.
*   **`pestanas/php/datosartraducion.md` y `pestanas/php/marcadoPalabra.md`:** Archivos de documentación, no código ejecutable.
*   **`pestanas/php/ajax_saved_words_content.php`:** No se encontró ninguna llamada `fetch` explícita a este archivo en los scripts JavaScript analizados. `pestanas/js/palabras.js` podría necesitarlo para recargar la lista de palabras.
*   **`pestanas/php/save_translated_word.php` y `pestanas/php/save_word.php`:** Son endpoints PHP a los que `pestanas/php/text-management.js` hace peticiones `fetch`. No son "no utilizados", sino APIs.
*   **`pestanas/php/saved_words.php`:** No se encontró ninguna inclusión o referencia a este script. Podría ser un archivo de prueba o un endpoint no utilizado.

**Nota:** La identificación de "archivos no utilizados" se basa en la ausencia de referencias directas en los archivos JavaScript y PHP analizados. Es posible que algunos de estos archivos sean endpoints de API a los que se accede indirectamente o que se utilicen en otras partes de la aplicación no cubiertas por esta documentación.

## Conclusión

El análisis revela oportunidades significativas para la refactorización de funciones JavaScript duplicadas, especialmente en la gestión de notificaciones y la lógica de activación de paneles. La centralización de estas funciones mejoraría la coherencia y la mantenibilidad del código. Además, se han identificado varios archivos PHP y JavaScript que no parecen estar en uso directo, lo que sugiere una posible limpieza del proyecto para eliminar código muerto y reducir la complejidad.
