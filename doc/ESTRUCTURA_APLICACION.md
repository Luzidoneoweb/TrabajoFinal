# Documentación de Estructura - MiApp: Aprende Idiomas Leyendo

## 📋 Descripción General

**MiApp** es una aplicación web para el aprendizaje de idiomas a través de la lectura interactiva. Los usuarios pueden hacer clic en palabras para traducirlas, crear tarjetas de memoria y practicar vocabulario en contexto.

## 🏗️ Arquitectura de la Aplicación

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP
- **Servidor**: XAMPP (Apache + MySQL + PHP)
- **Estructura**: Aplicación web tradicional con separación de responsabilidades

## 📁 Estructura de Directorios

```
proyecto/
├── index.php              # Página principal de la aplicación
├── index.html             # Versión HTML estática (backup)
├── css/
│   └── estilo.css         # Estilos principales de la aplicación
├── js/
│   └── global.js          # Funcionalidad JavaScript global
├── php/
│   ├── menuLogin.php      # Navegación para usuarios logueados
│   ├── menuMovil.php      # Menú hamburguesa para móviles
│   ├── panel_usuario.php  # Panel principal de la aplicación
│   └── pestañas.php       # Sistema de pestañas (pendiente)
└── img/
    └── aprenderIngles.png # Imagen de ejemplo
```

## 🔧 Componentes Principales

### 1. **index.php** - Punto de Entrada Principal
- **Propósito**: Archivo principal que orquesta toda la aplicación
- **Funcionalidades**:
  - Landing page para usuarios no registrados
  - Inclusión de componentes PHP modulares
  - Gestión de estados de autenticación
  - Navegación entre secciones

**Secciones principales**:
- Header con navegación dinámica
- Sección Hero con demo de traducción
- Espacios publicitarios
- Características de la aplicación
- Testimonios de usuarios
- Planes de precios
- Panel de usuario (cuando está logueado)

### 2. **Sistema de Navegación Modular (PHP/)**

#### **menuLogin.php**
- Navegación específica para usuarios autenticados
- Pestañas de la aplicación: Textos, Vocabulario, Progreso, Biblioteca, Configuración
- Información del usuario y botón de cerrar sesión

#### **menuMovil.php**
- Botón hamburguesa para dispositivos móviles
- Navegación responsive

#### **panel_usuario.php**
- Panel principal de la aplicación
- Contenido de las diferentes pestañas
- Formularios y controles de usuario

### 3. **Estilos (css/estilo.css)**
- **Arquitectura CSS**: Metodología BEM (Block Element Modifier)
- **Organización**:
  - Reset y configuración base
  - Utilidades generales
  - Componentes modulares
  - Responsive design
  - Estados y animaciones

**Secciones principales del CSS**:
- Reset y configuración base
- Encabezado y navegación
- Sección hero y landing
- Componentes de tarjetas
- Sistema de pestañas
- Responsive design
- Utilidades y estados

### 4. **JavaScript (js/global.js)**
- **Funcionalidades principales**:
  - Gestión de estado de autenticación
  - Navegación entre pestañas
  - Menú móvil responsive
  - Navegación suave (smooth scroll)
  - Event listeners globales

## 🎯 Flujo de la Aplicación

### Estado No Autenticado
1. **Landing Page**: Muestra información sobre la aplicación
2. **Navegación**: Menú principal con enlaces a secciones
3. **Call-to-Action**: Botón "Iniciar Sesión" para autenticarse

### Estado Autenticado
1. **Panel Principal**: Interfaz de usuario con pestañas
2. **Pestañas Disponibles**:
   - **Mis Textos**: Gestión de textos guardados
   - **Vocabulario**: Palabras traducidas y tarjetas de memoria
   - **Progreso**: Estadísticas de aprendizaje
   - **Biblioteca**: Exploración de textos disponibles
   - **Configuración**: Preferencias del usuario

## 🔄 Sistema de Estados

### Gestión de Autenticación
- **Variable global**: `usuarioLogueado` (boolean)
- **Alternancia**: Función `alternarLogin()` para cambiar estados
- **Elementos afectados**:
  - Navegación principal ↔ Navegación de usuario
  - Página de inicio ↔ Panel de aplicación

### Sistema de Pestañas
- **Activación**: Función `cambiarPestana(nombrePestana)`
- **Elementos**: Botones con atributo `data-pestana`
- **Paneles**: Contenedores con ID `panel{NombrePestana}`

## 📱 Responsive Design

### Breakpoints
- **Desktop**: Navegación horizontal completa
- **Tablet**: Adaptación de grid y espaciado
- **Mobile**: Menú hamburguesa y navegación vertical

### Componentes Responsive
- Header con logo y navegación adaptativa
- Grid de características (3 columnas → 1 columna)
- Sistema de pestañas optimizado para touch

## 🎨 Patrones de Diseño

### Metodología CSS
- **BEM**: Nomenclatura consistente (`.bloque__elemento--modificador`)
- **Componentes**: Tarjetas, botones, formularios reutilizables
- **Utilidades**: Clases helper (`.oculto`, `.contenedor-principal`)

### JavaScript
- **Vanilla JS**: Sin dependencias externas
- **Event Delegation**: Gestión eficiente de eventos
- **Modularidad**: Funciones específicas por funcionalidad

## 🚀 Funcionalidades Implementadas

### ✅ Completadas
- Estructura HTML semántica
- Sistema de navegación modular
- Landing page completa
- Panel de usuario con pestañas
- Responsive design básico
- Gestión de estados de autenticación
- Navegación suave

### 🔄 En Desarrollo
- Sistema de pestañas dinámico
- Funcionalidad de traducción
- Gestión de vocabulario
- Sistema de progreso

### 📋 Pendientes
- Backend de autenticación
- Base de datos para usuarios y textos
- API de traducción
- Sistema de tarjetas de memoria
- Funcionalidad de búsqueda
- Gestión de archivos

## 🔧 Configuración del Entorno

### Requisitos
- **XAMPP**: Servidor local con Apache, MySQL y PHP
- **Navegador**: Compatible con ES6+ y CSS Grid
- **PHP**: Versión 7.4 o superior

### Estructura de URLs
- **Desarrollo**: `http://localhost/proyecto/`
- **Archivo principal**: `index.php`
- **Recursos**: Rutas relativas desde la raíz del proyecto

## 📝 Convenciones de Código

### Nomenclatura
- **CSS**: BEM con guiones (`navegacion-principal`)
- **JavaScript**: camelCase (`usuarioLogueado`)
- **PHP**: snake_case (`menu_login.php`)
- **IDs**: kebab-case (`boton-login`)

### Organización
- **Comentarios**: Secciones claramente marcadas
- **Indentación**: 4 espacios
- **Separación**: Líneas en blanco entre secciones lógicas

---

*Documento generado automáticamente - Última actualización: Diciembre 2024*
