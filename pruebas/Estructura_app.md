# Documentación de Estructura - MiApp: Aprende Idiomas Leyendo

## 📋 Descripción General

**MiApp** es una aplicación web para el aprendizaje de idiomas a través de la lectura interactiva. Los usuarios pueden hacer clic en palabras para traducirlas, crear tarjetas de memoria y practicar vocabulario en contexto.

## 🏗️ Arquitectura de la Aplicación

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP
- **Servidor**: XAMPP (Apache + MySQL + PHP)
- **Base de Datos**: MySQL
- **Estructura**: Aplicación web tradicional con separación de responsabilidades

## 📁 Estructura de Directorios

```
trabajoFinal/
├── index.php                      # Punto de entrada principal de la aplicación
├── css/
│   ├── colores.css                # Definición de colores globales
│   ├── estilo.css                 # Estilos principales de la aplicación
│   ├── floating-menu.css          # Estilos para el menú flotante
│   ├── global_estilos.css         # Estilos globales adicionales
│   └── modal.css                  # Estilos para modales
├── db/
│   └── (archivos de base de datos, e.g., conexion.php, .sql)
├── doc/                           # Documentación adicional
├── funcinaeliminar/               # Funcionalidades en proceso de eliminación o refactorización
│   ├── get_total_words.php
│   ├── muestramuestraeliminar_textos.php
│   ├── muestrapalabras.js
│   ├── muestrapalabras.php
├── img/
│   └── aprenderIngles.png         # Imágenes de la aplicación
├── js/
│   ├── global.js                  # Funcionalidad JavaScript global
│   └── login_registos/
│       └── auth_auntentif.js      # Lógica para el modal de login y registro
├── lector/                        # Componentes relacionados con el lector de textos
│   ├── electron-voice-integration.js
│   └── reading-engine.js
├── pestanas/                      # Contenido de las diferentes pestañas de usuario
│   ├── biblioteca.php             # Pestaña de biblioteca de textos
│   ├── lectura.php                # Pestaña de lectura interactiva
│   ├── palabras.php               # Pestaña de gestión de palabras guardadas
│   ├── practicas.php              # Pestaña de prácticas de vocabulario
│   ├── progreso.php               # Pestaña de progreso del usuario
│   ├── subir_texto.php            # Pestaña para subir nuevos textos
│   ├── textos.php                 # Pestaña de gestión de textos del usuario
│   ├── css/
│   │   ├── biblioteca.css
│   │   ├── global_pestanas.css
│   │   ├── global.css
│   │   ├── lectura.css
│   │   ├── loading_message.css
│   │   ├── palabras.css
│   │   ├── practicas.css
│   │   ├── progreso.css
│   │   ├── subir_texto.css
│   │   └── textos.css
│   ├── js/
│   │   ├── cargar_biblioteca.js
│   │   ├── cargar-estadisticas.js
│   │   ├── global.js
│   │   ├── lectura.js
│   │   ├── loading_message.js
│   │   ├── modalFinalizacion.js
│   │   ├── multi-word-selection.js
│   │   ├── palabras.js
│   │   ├── subir_texto.js
│   │   ├── text-management.js
│   │   ├── text-utils.js
│   │   ├── texto.js
│   │   └── textoPublicCategoria.js
│   └── php/
│       ├── eliminar_textos.php
│       ├── get_biblioteca_contenido.php
│       ├── get_categoria.php
│       ├── get_lectura_data.php
│       ├── get_textos.php
│       ├── get_total_words.php
│       ├── loading_message.php
│       ├── save_translated_word.php
│       ├── save_word.php
│       └── subirTextoFuncion.php
├── php/                           # Scripts PHP de lógica de servidor
│   ├── conten_logueado.php        # Contenedor principal para contenido logueado
│   ├── menu_logueado.php          # Menú de navegación para usuarios logueados
│   ├── menuMovil.php              # Menú de navegación para dispositivos móviles
│   └── login_seguridad/           # Scripts relacionados con autenticación y seguridad
│       ├── auto_login.php         # Lógica de auto-login
│       ├── login.php              # Maneja la lógica de inicio de sesión
│       ├── logout.php             # Cierra la sesión del usuario
│       ├── modal_login.php        # Contenido HTML del modal de login/registro
│       ├── registros.php          # Maneja la lógica de registro de nuevos usuarios
│       ├── seguridad.php          # Funciones de seguridad (limpieza de input, hashing)
│       └── verificar_sesion.php   # Verifica el estado de la sesión del usuario
├── practica/                      # Componentes y lógica para la sección de prácticas
│   ├── ajax_practice_content.php
│   ├── ajax_practice_data.php
│   ├── ajax_saved_words_content.php
│   ├── ajax_user_texts.php
│   └── js/
│       └── practice-functions.js
└── traducion_api/                 # Scripts para la integración con la API de traducción
    ├── get_content_translation.php
    ├── lectura-translation-functions.js
    ├── save_complete_translation.php
    ├── save_content_translation.php
    ├── save_title_translation.php
    └── translate.php
```

## 🔧 Componentes Principales

### 1. **index.php** - Punto de Entrada Principal
- **Propósito**: Archivo principal que orquesta toda la aplicación.
- **Funcionalidades**:
  - Landing page para usuarios no registrados.
  - Inclusión de archivos CSS, JavaScript y PHP necesarios.
  - Gestión de estados de autenticación para mostrar la interfaz adecuada.
  - Navegación entre secciones.

### 2. **Sistema de Autenticación y Seguridad (php/login_seguridad/)**
- **Modal de Login/Registro (`modal_login.php`, `js/login_registos/auth_auntentif.js`)**: Permite a los usuarios iniciar sesión o registrarse. Incluye validación de formularios, comunicación asíncrona con el servidor y feedback al usuario.
- **Seguridad en el Servidor (`seguridad.php`, `login.php`, `registros.php`)**: Implementa limpieza de input, hashing de contraseñas, gestión de sesiones PHP y la función "Recordarme" mediante tokens seguros.
- **Verificación y Auto-Login (`verificar_sesion.php`, `auto_login.php`)**: Comprueba el estado de la sesión y permite el auto-login si hay cookies válidas.
- **Cierre de Sesión (`logout.php`)**: Invalida la sesión y las cookies de "recordarme".

### 3. **Interfaz de Usuario (UI) y Navegación**
- **Estado No Logueado**: Muestra la `navegacionPrincipal` y la `paginaInicio` con información sobre la aplicación y un botón para iniciar sesión.
- **Estado Logueado**: Oculta la `navegacionPrincipal` y `paginaInicio`, mostrando la `navegacionUsuario` (definida en `php/menu_logueado.php`) y el `contenidoLogueado` (definido en `php/conten_logueado.php`).
- **Navegación por Pestañas**: El JavaScript (`js/global.js` y `pestanas/js/global.js`) gestiona la activación de pestañas y la carga dinámica de su contenido (e.g., `pestanas/biblioteca.php`, `pestanas/practicas.php`).
- **Menú Móvil (`php/menuMovil.php`)**: Un menú adaptable para dispositivos móviles.

### 4. **Módulos de Pestañas (pestanas/)**
Cada archivo PHP dentro de `pestanas/` representa una sección principal de la aplicación para usuarios logueados, con su propia lógica y estilos (en `pestanas/css/` y `pestanas/js/`).
- **Biblioteca (`biblioteca.php`)**: Gestión y exploración de textos.
- **Lectura (`lectura.php`)**: Interfaz para la lectura interactiva con traducción.
- **Palabras (`palabras.php`)**: Gestión de vocabulario guardado.
- **Prácticas (`practicas.php`)**: Ejercicios para practicar vocabulario.
- **Progreso (`progreso.php`)**: Estadísticas de aprendizaje.
- **Subir Texto (`subir_texto.php`)**: Funcionalidad para que los usuarios suban sus propios textos.

### 5. **Sistema de Traducción (traducion_api/)**
- Scripts PHP y JavaScript para interactuar con una API de traducción, guardar traducciones de contenido y títulos, y gestionar la traducción en tiempo real durante la lectura.

## 🎯 Flujo de la Aplicación

### Estado No Autenticado
1.  **Landing Page**: Muestra información sobre la aplicación.
2.  **Navegación**: Menú principal con enlaces a secciones informativas.
3.  **Call-to-Action**: Botón "Iniciar Sesión" para autenticarse.

### Estado Autenticado
1.  **Panel Principal**: Interfaz de usuario con pestañas.
2.  **Pestañas Disponibles**:
    -   **Biblioteca**: Exploración y gestión de textos.
    -   **Lectura**: Acceso a la lectura interactiva de textos.
    -   **Palabras**: Gestión de palabras traducidas y tarjetas de memoria.
    -   **Prácticas**: Ejercicios de vocabulario.
    -   **Progreso**: Estadísticas de aprendizaje.
    -   **Subir Texto**: Herramienta para añadir nuevos textos.
    -   **Textos**: Gestión de textos propios del usuario.

## 🔄 Sistema de Estados

### Gestión de Autenticación
-   El estado de autenticación del usuario determina qué partes de la UI son visibles.
-   Se utilizan sesiones PHP y cookies para mantener el estado.

### Sistema de Pestañas
-   La navegación entre pestañas se gestiona con JavaScript, activando la pestaña correspondiente y mostrando su panel de contenido.

## 📱 Responsive Design

### Breakpoints
-   **Desktop**: Navegación horizontal completa.
-   **Tablet**: Adaptación de grid y espaciado.
-   **Mobile**: Menú hamburguesa y navegación vertical.

### Componentes Responsive
-   Header con logo y navegación adaptativa.
-   Contenido de las pestañas optimizado para diferentes tamaños de pantalla.

## 🎨 Patrones de Diseño

### Metodología CSS
-   **BEM**: Nomenclatura consistente (`.bloque__elemento--modificador`).
-   **Componentes**: Tarjetas, botones, formularios reutilizables.
-   **Utilidades**: Clases helper (`.oculto`, `.contenedor-principal`).

### JavaScript
-   **Vanilla JS**: Sin dependencias externas.
-   **Event Delegation**: Gestión eficiente de eventos.
-   **Modularidad**: Funciones específicas por funcionalidad y archivo.

## 🚀 Funcionalidades Implementadas

### ✅ Completadas
-   Estructura HTML semántica.
-   Sistema de navegación modular (para usuarios logueados y no logueados).
-   Landing page completa.
-   Panel de usuario con pestañas dinámicas.
-   Responsive design.
-   Gestión de estados de autenticación (login, registro, logout, auto-login).
-   Funcionalidad de lectura interactiva con traducción de palabras.
-   Gestión de vocabulario (guardar palabras traducidas).
-   Sección de prácticas de vocabulario.
-   Sección de progreso con estadísticas.
-   Funcionalidad para subir textos.
-   Integración con API de traducción.

### 📋 Pendientes
-   (Se asume que las funcionalidades listadas como "En Desarrollo" y "Pendientes" en la documentación anterior ya están implementadas o se han refactorizado en la estructura actual. Si hay funcionalidades específicas que aún están pendientes, se deberían añadir aquí).

## 🔧 Configuración del Entorno

### Requisitos
-   **XAMPP**: Servidor local con Apache, MySQL y PHP.
-   **Navegador**: Compatible con ES6+ y CSS Grid.
-   **PHP**: Versión 7.4 o superior.
-   **Base de Datos**: MySQL (con los esquemas y datos necesarios).

### Estructura de URLs
-   **Desarrollo**: `http://localhost/trabajoFinal/`
-   **Archivo principal**: `index.php`
-   **Recursos**: Rutas relativas desde la raíz del proyecto.

## 📝 Convenciones de Código

### Nomenclatura
-   **CSS**: BEM con guiones (`navegacion-principal`).
-   **JavaScript**: camelCase (`usuarioLogueado`).
-   **PHP**: snake_case (`menu_login.php`).
-   **IDs**: kebab-case (`boton-login`).

### Organización
-   **Comentarios**: Secciones claramente marcadas.
-   **Indentación**: 4 espacios.
-   **Separación**: Líneas en blanco entre secciones lógicas.

---

*Documento actualizado automáticamente - Última actualización: 1 de Diciembre de 2025*
