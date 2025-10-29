### Documento de Trabajo para `textos.php`

#### 1. `php/pestanas/textos.php`
Esta es la página principal que muestra la lista de textos. Su estructura HTML incluye:
- Un contenedor principal (`.contenedor-textos`).
- Un encabezado (`.encabezado-textos`) con un contador de textos y acciones en lote.
- Un área (`.lista-textos`) que se rellena dinámicamente con los textos de la base de datos.
- Un enlace al archivo JavaScript `js/texto.js` para la carga dinámica.

#### 2. `php/pestanas/js/texto.js`
Este archivo JavaScript es responsable de:
- Realizar una petición `fetch` al endpoint `/trabajoFinal/php/pestanas/php/get_textos.php` cuando el DOM está completamente cargado.
- Procesar la respuesta JSON del endpoint.
- Limpiar el contenido existente en `.lista-textos`.
- Iterar sobre los datos recibidos y crear elementos `div` con la clase `item-texto` para cada texto.
- Cada `item-texto` contiene:
    - Un checkbox (`.chk-texto`).
    - Un `div` con la información del texto (`.info-texto`), que incluye el título (`.titulo-texto`) y su traducción (`.traduccion-texto`).
    - El número de palabras (`.palabras-texto`).
    - El estado de lectura/privacidad (`.estado-leido`).
    - Un botón para el estado público/privado (`.btn-estado-publico`).

#### 3. `php/pestanas/php/get_textos.php`
Este es el endpoint PHP que proporciona los datos de los textos.
- Requiere el archivo de conexión a la base de datos (`../../../db/conexion.php`).
- Establece el encabezado `Content-Type` a `application/json`.
- Realiza una consulta SQL para seleccionar `id`, `title`, `title_translation`, `content`, `content_translation`, `is_public`, `category_id` y `created_at` de la tabla `texts`, ordenados por `created_at` de forma descendente.
- Devuelve los resultados en formato JSON, incluyendo un indicador de éxito (`success`) y los datos (`data`) o un mensaje de error (`error`).

#### 4. `db/conexion.php`
Este archivo gestiona la conexión a la base de datos.
- Define las credenciales de conexión (`$host`, `$user`, `$pass`, `$dbname`).
- Utiliza PDO para establecer la conexión a la base de datos.
- Configura el modo de error de PDO para lanzar excepciones en caso de fallos.
- En caso de error de conexión, detiene la ejecución y muestra un mensaje.

#### 5. Estructura de la tabla `texts` (basada en `db/proyecto.sql`)
```sql
CREATE TABLE `texts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_translation` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `content_translation` text DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `texts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

#### 6. Flujo de Trabajo Actual
1.  El navegador carga `php/pestanas/textos.php`.
2.  El script `php/pestanas/js/texto.js` se ejecuta.
3.  `texto.js` realiza una petición AJAX a `/trabajoFinal/php/pestanas/php/get_textos.php`.
4.  `get_textos.php` se conecta a la base de datos a través de `db/conexion.php` (usando PDO).
5.  `get_textos.php` consulta la tabla `texts` y devuelve los datos en JSON.
6.  `texto.js` recibe los datos, los procesa y los inserta dinámicamente en el `div.lista-textos` de la página.

#### 7. Posibles Mejoras / Próximos Pasos
-   **Funcionalidad de clic en el título**: Implementar la función para que al hacer clic en un título, se muestre el contenido completo del texto. Esto requeriría un nuevo endpoint PHP para obtener el contenido de un texto específico por su ID y una lógica JavaScript para mostrarlo (posiblemente en un modal o en una nueva sección de la página).
-   **Paginación/Carga infinita**: Si hay muchos textos, implementar paginación o carga infinita para mejorar el rendimiento y la experiencia del usuario.
-   **Filtrado y búsqueda**: Añadir opciones para filtrar textos por categoría, estado (público/privado) o una barra de búsqueda por título.
-   **Edición/Eliminación de textos**: Integrar la funcionalidad para editar o eliminar textos directamente desde la interfaz.
-   **Contador de textos**: Actualizar dinámicamente el `<p class="contador-textos">7 textos encontrados</p>` con el número real de textos cargados.
