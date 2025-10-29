# Documentación de la Función de Subir Texto

Esta sección describe la funcionalidad para subir nuevos textos a la aplicación, incluyendo la interfaz de usuario, la lógica del frontend y el procesamiento del backend.

## 1. Interfaz de Usuario (Frontend - PHP)

**Archivo:** `php/pestanas/subir_texto.php`

Este archivo PHP es responsable de renderizar la interfaz de usuario para que los usuarios puedan introducir y subir nuevos textos.

### Componentes Principales:
- **Título del Texto:** Un campo de entrada (`input type="text"`) para que el usuario introduzca un título. Si se deja vacío, el sistema generará uno automáticamente a partir de las primeras tres palabras del contenido.
- **Contenido del Texto:** Un área de texto (`textarea`) donde el usuario escribe o pega el texto completo.
- **Texto Público:** Un checkbox (`input type="checkbox"`) que permite al usuario decidir si el texto será visible públicamente o solo para él. Por defecto, está marcado como público.
- **Categoría:** Un menú desplegable (`select`) para seleccionar una categoría existente para el texto. Las categorías se cargan dinámicamente desde el backend.
- **Botón "Subir":** Un botón (`button`) que, al ser clicado, inicia el proceso de envío del texto al servidor.

### Estructura:
El archivo incluye un script JavaScript (`php/pestanas/js/subir_texto.js`) que maneja la interactividad del formulario y la comunicación con el backend.

## 2. Lógica del Frontend (JavaScript)

**Archivo:** `php/pestanas/js/subir_texto.js`

Este script JavaScript gestiona la interacción del usuario con el formulario de subida de texto y la comunicación asíncrona con el servidor.

### Funcionalidades:
- **Carga de Categorías:** Al cargar la página, realiza una petición `fetch` a `php/pestanas/php/get_categoria.php` para obtener y popular el menú desplegable de categorías.
- **Manejo del Envío del Formulario:**
    - Escucha el evento `click` del botón "Subir".
    - Recopila los datos del título, contenido, estado público y categoría del formulario.
    - Crea un objeto `FormData` con estos datos.
    - Realiza una petición `fetch` de tipo `POST` a `php/pestanas/php/subirTextoFuncion.php` para enviar el texto.
    - Incluye las credenciales de sesión (`credentials: 'include'`) para asegurar que el usuario esté autenticado.
- **Respuestas del Servidor:**
    - Procesa la respuesta JSON del servidor.
    - Si la subida es exitosa (`data.success` es `true`), muestra un mensaje de éxito, limpia el formulario y redirige al usuario a la pestaña "Mis textos" después de un breve retraso.
    - Si hay un error (`data.success` es `false`), muestra un mensaje de error con la información proporcionada por el servidor.
- **Mensajes de Notificación:** Implementa una función `mostrarMensaje` para mostrar notificaciones flotantes (éxito, error, info) al usuario.

## 3. Lógica del Backend (PHP)

**Archivo:** `php/pestanas/php/subirTextoFuncion.php`

Este script PHP es el endpoint del servidor que recibe los datos del formulario de subida de texto, los valida y los almacena en la base de datos.

### Funcionalidades:
- **Inicio de Sesión:** Inicia la sesión (`session_start()`) y verifica que el usuario esté autenticado (`$_SESSION['user_id']`). Si no lo está, devuelve un error.
- **Conexión a la Base de Datos:** Incluye el archivo de conexión a la base de datos (`db/conexion.php`).
- **Recolección y Validación de Datos:**
    - Recoge el `user_id` de la sesión.
    - Obtiene el `titulo`, `contenido`, `texto_publico` (convertido a 0 o 1) y `categoria` (category_id) de la petición `POST`.
    - Valida que el `contenido` no esté vacío.
- **Generación Automática de Título:** Si el `titulo` está vacío, genera uno automáticamente tomando las primeras tres palabras del `contenido`. Si el contenido es muy corto, usa "Sin título".
- **Inserción en la Base de Datos:**
    - Prepara una sentencia SQL `INSERT` para añadir el texto a la tabla `texts`.
    - Utiliza parámetros preparados (`bind_param`) para prevenir inyecciones SQL.
    - Ejecuta la sentencia.
- **Respuesta JSON:**
    - Si la inserción es exitosa, establece `success` en `true` y añade el `id` del nuevo texto.
    - Si ocurre un error durante la inserción o una excepción, establece `success` en `false` y proporciona un mensaje de error detallado.
    - Finalmente, devuelve una respuesta JSON al frontend.
- **Cierre de Conexión:** Cierra la conexión a la base de datos.
