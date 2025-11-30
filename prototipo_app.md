# Prototipo de la Aplicación "MiApp - Aprende idiomas leyendo"

Este documento describe el prototipo de la interfaz de usuario de la aplicación, incluyendo su estructura funcional y diseño visual, con un enfoque en la estética y el uso de colores para una memoria.

---

## 1. Paleta de Colores y Tipografía General

Basándonos en los estilos existentes y una estética moderna y amigable para el aprendizaje de idiomas:

*   **Colores Primarios:**
    *   `#4CAF50` (Verde Esmeralda): Para botones de acción principal, elementos destacados, indicadores de éxito. Transmite frescura y progreso.
    *   `#2196F3` (Azul Vibrante): Para enlaces, iconos interactivos, barras de progreso. Sugiere confianza y claridad.
*   **Colores Secundarios:**
    *   `#FFC107` (Amarillo Ámbar): Para alertas, notificaciones, elementos que requieren atención.
    *   `#FF5722` (Naranja Intenso): Para acciones de advertencia o énfasis.
*   **Colores Neutros:**
    *   `#F5F5F5` (Gris Claro): Fondos de secciones, contenedores. Aporta limpieza y espacio.
    *   `#E0E0E0` (Gris Medio): Bordes, separadores, fondos de campos de entrada.
    *   `#333333` (Gris Oscuro): Texto principal, encabezados. Alta legibilidad.
    *   `#666666` (Gris Suave): Texto secundario, descripciones.
*   **Tipografía:**
    *   **Principal:** `Roboto` o `Segoe UI` (sans-serif) para la mayoría del texto, por su legibilidad y modernidad.
    *   **Encabezados:** `Montserrat` o `Open Sans` (sans-serif) para títulos, aportando un toque más distintivo.

---

## 2. Vistas Principales (Wireframes Visuales)

### 2.1. Página de Inicio (Estado No Logueado)

**Estructura General:**
La página se divide en un encabezado fijo, una sección hero prominente, varias secciones informativas desplazables y un pie de página.

**Diseño Visual:**

*   **Encabezado (`.encabezado-principal`):**
    *   **Fondo:** `Blanco` o `Gris Claro (#F5F5F5)` con una ligera sombra inferior para darle profundidad.
    *   **Logo (`.logo`):** Imagen `aprenderIngles.png` (icono de libro/cerebro) en `Verde Esmeralda (#4CAF50)` o `Azul Vibrante (#2196F3)`. Texto "MiProyecto" en `Gris Oscuro (#333333)`.
    *   **Navegación Principal (`.navegacion-principal`):** Enlaces (`.enlace-menu`) en `Gris Suave (#666666)` que cambian a `Azul Vibrante (#2196F3)` al pasar el ratón.
    *   **Botón "Iniciar Sesión" (`#botonLogin`):** Estilo de botón primario. Fondo `Verde Esmeralda (#4CAF50)`, texto `Blanco`. Bordes ligeramente redondeados.

*   **Sección Hero (`.seccion-hero`):**
    *   **Fondo:** Degradado suave de `Azul Vibrante (#2196F3)` a un `Azul más claro` o una imagen de fondo sutil relacionada con el aprendizaje.
    *   **Título Principal (`.titulo-principal`):** Texto grande en `Blanco`, tipografía `Montserrat` o `Open Sans`.
    *   **Subtítulo (`.subtitulo`):** Texto en `Blanco` o `Gris Claro (#F5F5F5)`.
    *   **Botón "Comenzar a Aprender" (`.boton-comenzar`):** Fondo `Verde Esmeralda (#4CAF50)`, texto `Blanco`. Más grande y prominente que el botón de login.
    *   **Demo de Traducción (`.demo-traduccion`):**
        *   `Texto de ejemplo`: Fondo `Blanco` translúcido, texto `Gris Oscuro (#333333)`. `Palabra destacada` en `Verde Esmeralda (#4CAF50)`.
        *   `Tarjeta de traducción`: Fondo `Verde Esmeralda (#4CAF50)`, texto "Demo" en `Blanco`.

*   **Secciones Informativas (Características, Testimonios, Precios, Acerca):**
    *   **Fondos:** Alternando entre `Blanco` y `Gris Claro (#F5F5F5)` para diferenciar las secciones.
    *   **Títulos de Sección (`.titulo-seccion`):** `Gris Oscuro (#333333)`, tipografía `Montserrat`.
    *   **Tarjetas (`.tarjeta-caracteristica`, `.tarjeta-testimonio`, `.tarjeta-precio`):**
        *   Fondo `Blanco`, bordes suaves en `Gris Medio (#E0E0E0)`, ligera sombra.
        *   Texto en `Gris Oscuro (#333333)` y `Gris Suave (#666666)`.
        *   `Tarjetas destacadas` (ej. plan Premium): Fondo `Verde Esmeralda (#4CAF50)` o `Azul Vibrante (#2196F3)`, texto `Blanco`.

*   **Pie de Página (`.pie-pagina`):**
    *   **Fondo:** `Gris Oscuro (#333333)`.
    *   **Texto:** `Blanco` o `Gris Claro (#F5F5F5)`.
    *   **Enlaces:** `Azul Vibrante (#2196F3)`.

### 2.2. Modal de Autenticación (`#authModal`)

**Estructura General:**
Un modal centrado con un panel que contiene pestañas para "Iniciar sesión" y "Crear cuenta", y los formularios correspondientes.

**Diseño Visual:**

*   **Fondo (`.auth-modal__backdrop`):** Oscurecido y semitransparente (`rgba(0,0,0,0.5)`).
*   **Panel del Modal (`.auth-modal__panel`):**
    *   Fondo `Blanco`, bordes redondeados, sombra pronunciada.
    *   **Botón Cerrar (`.auth-close`):** Icono 'x' en la esquina superior derecha, color `Gris Suave (#666666)`, cambia a `Rojo` al pasar el ratón.
    *   **Título (`#authTitle`):** "Acceder / Registrar" en `Gris Oscuro (#333333)`.
    *   **Pestañas (`.auth-tabs`):**
        *   Pestañas inactivas: Fondo `Gris Claro (#F5F5F5)`, texto `Gris Suave (#666666)`.
        *   Pestaña activa: Fondo `Blanco`, borde inferior `Verde Esmeralda (#4CAF50)`, texto `Gris Oscuro (#333333)`.
    *   **Campos de Formulario (`.field`):**
        *   Etiquetas en `Gris Suave (#666666)`.
        *   Inputs con borde `Gris Medio (#E0E0E0)`, que se vuelve `Azul Vibrante (#2196F3)` al enfocar.
        *   Icono de visibilidad de contraseña (`.toggle-password`) en `Gris Suave (#666666)`.
    *   **Mensajes (`.auth-msg`):**
        *   `success`: Texto `Verde Esmeralda (#4CAF50)`.
        *   `error`: Texto `Rojo`.
    *   **Botones de Envío (`.auth-btn`):** Fondo `Verde Esmeralda (#4CAF50)`, texto `Blanco`.

### 2.3. Interfaz de Usuario Logueado (Pestañas)

**Estructura General:**
Similar a la página de inicio, pero el área de contenido principal (`#contenidoLogueado`) se reemplaza por un menú de pestañas lateral o superior y el contenido dinámico de la pestaña seleccionada.

**Diseño Visual:**

*   **Encabezado (`.encabezado-principal`):**
    *   Mismo estilo que el no logueado, pero con:
    *   **Info Usuario (`.info-usuario`):** Nombre de usuario en `Gris Oscuro (#333333)`.
    *   **Botón "Cerrar Sesión" (`#botonCerrarSesion`):** Fondo `Naranja Intenso (#FF5722)` o `Rojo`, texto `Blanco`.

*   **Menú de Navegación (Pestañas - `php/menuMovil.php` y contenido dinámico):**
    *   **Menú Lateral (si aplica):** Fondo `Gris Oscuro (#333333)` o `Azul Vibrante (#2196F3)`.
    *   **Elementos de Menú:**
        *   Inactivos: Texto `Gris Claro (#F5F5F5)`, iconos en `Gris Medio (#E0E0E0)`.
        *   Activos: Fondo `Verde Esmeralda (#4CAF50)` o `Azul Vibrante (#2196F3)` más oscuro, texto `Blanco`, iconos en `Blanco`.
    *   **Contenido de Pestaña:** Fondo `Blanco` o `Gris Claro (#F5F5F5)`.

#### 2.3.1. Pestaña "Biblioteca" (`pestanas/biblioteca.php`)

*   **Título:** "Mi Biblioteca" en `Gris Oscuro (#333333)`.
*   **Filtros/Búsqueda:** Campos de entrada con estilo similar al modal de autenticación.
*   **Listado de Textos:**
    *   Cada elemento de texto como una "tarjeta" con fondo `Blanco`, borde `Gris Medio (#E0E0E0)`, ligera sombra.
    *   Título del texto en `Gris Oscuro (#333333)`.
    *   Botones "Leer" y "Gestionar": "Leer" en `Verde Esmeralda (#4CAF50)`, "Gestionar" en `Azul Vibrante (#2196F3)`.

#### 2.3.2. Pestaña "Lectura" (`pestanas/lectura.php`)

*   **Área de Texto:** Fondo `Blanco`, texto principal en `Gris Oscuro (#333333)`.
*   **Interacción de Traducción:**
    *   Palabra seleccionada: Resaltado sutil en `Azul Vibrante (#2196F3)` o `Verde Esmeralda (#4CAF50)`.
    *   Panel/Modal de Traducción: Fondo `Blanco` o `Gris Claro (#F5F5F5)`, con la traducción en `Gris Oscuro (#333333)` y opciones de guardar en `Verde Esmeralda (#4CAF50)`.

#### 2.3.3. Pestaña "Palabras" (`pestanas/palabras.php`)

*   **Título:** "Mis Palabras Guardadas" en `Gris Oscuro (#333333)`.
*   **Listado de Palabras:**
    *   Cada palabra como un elemento de lista o tarjeta.
    *   Palabra original en `Gris Oscuro (#333333)`, traducción en `Verde Esmeralda (#4CAF50)`.
    *   Botones de acción (ej. eliminar) en `Naranja Intenso (#FF5722)`.

#### 2.3.4. Pestaña "Prácticas" (`pestanas/practicas.php`)

*   **Título:** "Practicar Vocabulario" en `Gris Oscuro (#333333)`.
*   **Tarjetas de Memoria:**
    *   Fondo `Blanco`, bordes redondeados, sombra.
    *   Texto de la palabra/pregunta en `Gris Oscuro (#333333)`.
    *   Botones de "Mostrar Respuesta", "Conocida", "Desconocida" con colores distintivos (ej. `Verde Esmeralda` para conocida, `Naranja Intenso` para desconocida).

#### 2.3.5. Pestaña "Progreso" (`pestanas/progreso.php`)

*   **Título:** "Mi Progreso" en `Gris Oscuro (#333333)`.
*   **Estadísticas:** Presentadas en tarjetas o gráficos.
    *   Tarjetas de resumen: Fondo `Blanco`, iconos en `Verde Esmeralda (#4CAF50)` o `Azul Vibrante (#2196F3)`.
    *   Gráficos: Barras/líneas en `Verde Esmeralda (#4CAF50)` y `Azul Vibrante (#2196F3)`.

#### 2.3.6. Pestaña "Subir Texto" (`pestanas/subir_texto.php`)

*   **Título:** "Subir Nuevo Texto" en `Gris Oscuro (#333333)`.
*   **Formulario:**
    *   Campos de entrada para Título, Contenido, Idioma, Categoría con el mismo estilo que los inputs del modal de autenticación.
    *   Botón "Subir": Fondo `Verde Esmeralda (#4CAF50)`, texto `Blanco`.

#### 2.3.7. Pestaña "Textos" (`pestanas/textos.php`)

*   **Título:** "Mis Textos" en `Gris Oscuro (#333333)`.
*   **Listado de Textos Subidos:**
    *   Cada texto como una tarjeta.
    *   Botones "Editar" (en `Azul Vibrante (#2196F3)`) y "Eliminar" (en `Naranja Intenso (#FF5722)`).

---

Este prototipo textual proporciona una visión detallada de la estructura y el diseño visual de la aplicación, utilizando descripciones de colores y estilos para simular una experiencia visual.
