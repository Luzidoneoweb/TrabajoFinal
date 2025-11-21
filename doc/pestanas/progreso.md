# Documentación del archivo `pestanas/progreso.php`

## Descripción
El archivo `progreso.php` es un fragmento de código PHP y HTML que se incluye en `php/conten_logueado.php`. Su propósito es mostrar las estadísticas de progreso del usuario, como el número de textos subidos, palabras guardadas, textos leídos, sesiones de práctica y precisión promedio. También incluye un historial de actividad por meses y el progreso de práctica por modo.

## Lógica PHP
1.  **Inicio de Sesión y Conexión a la DB:**
    *   Verifica si la sesión ya está iniciada (`session_status() === PHP_SESSION_NONE`) y la inicia si no lo está.
    *   Incluye `db/conexion.php` para establecer la conexión a la base de datos.
2.  **Obtención de `user_id`:**
    *   Si `$_SESSION['user_id']` está establecido, se obtiene el ID del usuario.
3.  **Consulta de Palabras Guardadas:**
    *   Realiza una consulta a la base de datos (`saved_words`) para contar el total de palabras guardadas por el usuario actual.
    *   El resultado se almacena en la variable `$total_words_saved`, que se utiliza para mostrar el valor en la interfaz. Si no hay sesión o palabras, el valor es 0.

## Estructura HTML
El archivo se divide en dos secciones principales:

### 1. Contenedor de Estadísticas (`.contenedor-estadisticas`)
Muestra varias tarjetas (`.tarjeta-estadistica`) con diferentes métricas de progreso:
*   **Textos Subidos:** Un marcador de posición (`id="textos-subidos"`) que se espera sea actualizado por JavaScript.
*   **Textos Leídos:** Un marcador de posición.
*   **Palabras Guardadas:** Muestra el valor dinámico de `$total_words_saved` obtenido de la base de datos.
*   **Sesiones de Práctica:** Un marcador de posición.
*   **Precisión Promedio:** Un marcador de posición.

### 2. Sección de Historial de Actividad (`.seccion-historial-actividad`)
Contiene un calendario de actividad y un resumen del progreso por modo de práctica:
*   **Calendario de Actividad (`.calendario-actividad`):**
    *   Encabezado con botones de navegación y un indicador de mes/año.
    *   Días de la semana.
    *   Una cuadrícula (`.grid-dias-calendario`) que muestra los días del mes con la actividad (minutos) o "Sin actividad". Algunos días tienen clases `inactivo` o `activo` para estilos visuales.
*   **Progreso por Modo (`.progreso-por-modo`):**
    *   Muestra tarjetas (`.tarjeta-progreso-modo`) para diferentes modos de práctica (Selección Múltiple, Escritura Libre, Práctica de Oraciones).
    *   Cada tarjeta incluye un icono, nombre del modo, estadísticas (sesiones, palabras/frases totales), una barra de progreso y la precisión.

## Archivos relacionados
*   `php/conten_logueado.php`: Incluye este archivo para mostrar el contenido de la pestaña "Progreso".
*   `db/conexion.php`: Proporciona la conexión a la base de datos.
*   `pestanas/css/progreso.css`: Contiene los estilos CSS para esta sección.
*   `pestanas/js/cargar-estadisticas.js`: Es muy probable que este archivo JavaScript sea responsable de cargar y actualizar dinámicamente los valores de las estadísticas (textos subidos, textos leídos, sesiones de práctica, precisión promedio) y la información del calendario, ya que muchos de ellos son marcadores de posición en el HTML.
*   `pestanas/js/global.js`: Puede contener funciones globales que interactúen con esta sección.
