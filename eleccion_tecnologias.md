# Elección de Tecnologías y Justificación para MiApp

Este documento detalla las tecnologías seleccionadas para el desarrollo de MiApp y la justificación detrás de cada elección.

## 1. Tecnologías Frontend

### HTML5
*   **Justificación:** Es el lenguaje estándar para la creación de contenido web. Proporciona la estructura semántica necesaria para la aplicación.

### CSS3
*   **Justificación:** Utilizado para el diseño y la presentación visual de la aplicación. Permite una estilización flexible y responsiva, esencial para una buena experiencia de usuario en diferentes dispositivos. Se observa el uso de archivos CSS separados para modularidad (`global_estilos.css`, `pestanas/css/global_pestanas.css`, etc.).

### JavaScript (Vanilla JS)
*   **Justificación:** Es el lenguaje de programación del lado del cliente que permite la interactividad en la interfaz de usuario. Se utiliza para:
    *   Manejo de eventos (clics, envío de formularios).
    *   Manipulación del DOM (mostrar/ocultar elementos, cargar contenido dinámico).
    *   Realización de peticiones asíncronas (AJAX) para comunicarse con el backend sin recargar la página.
    *   Lógica de autenticación y gestión de sesiones en el cliente (`js/login_registos/auth_auntentif.js`).
    *   Funcionalidades específicas de las pestañas (`pestanas/js/lectura.js`, `pestanas/js/palabras.js`, etc.).
*   **Ventajas:** Ligero, no requiere frameworks adicionales, lo que reduce la complejidad y el tamaño del bundle.

## 2. Tecnologías Backend

### PHP
*   **Justificación:** Es un lenguaje de scripting del lado del servidor ampliamente utilizado para el desarrollo web. Se eligió por:
    *   **Facilidad de integración con HTML:** Permite incrustar código PHP directamente en archivos HTML, lo que facilita la generación de contenido dinámico.
    *   **Amplia base de datos de recursos y comunidad:** Facilita la resolución de problemas y el acceso a librerías.
    *   **Gestión de sesiones y autenticación:** Utilizado para la lógica de seguridad y autenticación de usuarios (`php/login_seguridad/seguridad.php`, `php/login_seguridad/login.php`, `php/login_seguridad/registros.php`).
    *   **Interacción con la base de datos:** Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la base de datos para gestionar usuarios, textos y palabras guardadas.
    *   **API de Traducción:** Se utiliza para procesar las solicitudes de traducción (`traducion_api/translate.php`).

## 3. Base de Datos

### MySQL / MariaDB
*   **Justificación:** Es un sistema de gestión de bases de datos relacionales (RDBMS) muy popular y robusto.
    *   **Fiabilidad y Rendimiento:** Adecuado para aplicaciones web con un volumen moderado de datos y usuarios.
    *   **Soporte para SQL:** Permite consultas complejas y eficientes para la gestión de datos.
    *   **Integración con PHP:** PHP tiene un excelente soporte para MySQL/MariaDB, lo que facilita la conexión y manipulación de datos.
    *   **Estructura de Tablas:** Se observa el uso de tablas como `users`, `saved_words`, `texts`, etc., con relaciones bien definidas (ej. `saved_words` con `users` a través de `user_id`).

## 4. Servidor Web

### Apache (a través de XAMPP)
*   **Justificación:** Apache es el servidor web más utilizado y es parte de la pila LAMP/XAMPP.
    *   **Facilidad de Configuración:** Especialmente en entornos de desarrollo local como XAMPP, que simplifica la instalación y configuración de Apache, MySQL y PHP.
    *   **Compatibilidad:** Ampliamente compatible con PHP y otras tecnologías web.

## 5. Entorno de Desarrollo

### XAMPP
*   **Justificación:** Proporciona un entorno de desarrollo local completo que incluye Apache, MariaDB (un fork de MySQL), PHP y Perl.
    *   **Todo en uno:** Simplifica la configuración del servidor web, la base de datos y el intérprete de PHP en una sola instalación.
    *   **Portabilidad:** Permite desarrollar y probar la aplicación localmente antes de desplegarla en un servidor de producción.

## 6. Herramientas Adicionales

### Mermaid (para diagramas)
*   **Justificación:** Permite la creación de diagramas y diagramas de flujo directamente desde texto en formato Markdown. Facilita la documentación y visualización de la arquitectura y el flujo de la aplicación de manera sencilla y versionable.

### Material Icons
*   **Justificación:** Proporciona una colección de iconos vectoriales de alta calidad que se pueden integrar fácilmente en la interfaz de usuario, mejorando la estética y la usabilidad.

## Resumen de la Arquitectura

La aplicación sigue una arquitectura cliente-servidor tradicional, donde el frontend (HTML, CSS, JavaScript) se encarga de la presentación y la interactividad, y el backend (PHP, MySQL/MariaDB) gestiona la lógica de negocio, la persistencia de datos y la comunicación con servicios externos (como la API de traducción). XAMPP facilita el desarrollo local de esta pila tecnológica.
