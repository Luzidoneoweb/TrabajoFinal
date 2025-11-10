# Sistema de Actualización de Número de Textos Subidos

## Descripción General
Este documento describe cómo funciona el sistema que muestra el número de textos subidos por el usuario en la tarjeta de estadísticas de la pestaña "Progreso".

## Flujo de Funcionamiento

### 1. **Carga Inicial de la Aplicación**
```
Usuario accede a la aplicación
    ↓
index.php carga cargar-estadisticas.js
    ↓
cargar-estadisticas.js ejecuta cargarTextosSubidos()
    ↓
Obtiene datos de get_textos.php
    ↓
Actualiza elemento #textos-subidos con el número de textos
```

### 2. **Cuando el Usuario Visualiza "Mis Textos"**
```
Usuario hace clic en pestaña "Mis Textos"
    ↓
texto.js -> cargarTextos()
    ↓
Obtiene textos de get_textos.php
    ↓
Actualiza contador en la pestaña
    ↓
Llama a cargarTextosSubidos() para sincronizar Progreso
```

### 3. **Cuando el Usuario Sube un Nuevo Texto**
```
Usuario completa formulario y hace clic en "Subir"
    ↓
subir_texto.js envía datos a subirTextoFuncion.php
    ↓
Texto se guarda en base de datos
    ↓
cargarTextosSubidos() actualiza la estadística
    ↓
Usuario es redirigido a "Mis Textos"
```

### 4. **Cuando el Usuario Elimina Textos**
```
Usuario selecciona textos y hace clic en "Eliminar"
    ↓
texto.js envía IDs a eliminar_textos.php
    ↓
Textos se eliminan de base de datos
    ↓
cargarTextos() recarga la lista
    ↓
cargarTextosSubidos() actualiza la estadística
```

## Archivos Involucrados

### Backend (PHP)
| Archivo | Ubicación | Función |
|---------|-----------|---------|
| `get_textos.php` | `pestanas/php/` | Obtiene la lista de textos del usuario logueado |
| `subirTextoFuncion.php` | `pestanas/php/` | Procesa la subida de nuevo texto |
| `eliminar_textos.php` | `pestanas/php/` | Procesa la eliminación de textos |
| `conexion.php` | `db/` | Conexión a la base de datos |
| `seguridad.php` | `php/login_seguridad/` | Verifica autenticación del usuario |

### Frontend (JavaScript)
| Archivo | Ubicación | Función |
|---------|-----------|---------|
| `cargar-estadisticas.js` | `pestanas/js/` | Carga y actualiza la estadística de textos |
| `texto.js` | `pestanas/js/` | Maneja la visualización y gestión de textos |
| `subir_texto.js` | `pestanas/js/` | Maneja el formulario de subida de textos |
| `global.js` | `pestanas/js/` | Funciones globales (cambiarPestana, etc.) |

### Frontend (HTML)
| Archivo | Ubicación | Función |
|---------|-----------|---------|
| `progreso.php` | `pestanas/` | Contiene la tarjeta con ID #textos-subidos |
| `textos.php` | `pestanas/` | Contiene el contador de textos encontrados |
| `subir_texto.php` | `pestanas/` | Formulario para subir textos |
| `index.php` | `/` | Punto de entrada principal |
| `conten_logueado.php` | `php/` | Incluye todas las pestañas |

## Función Principal: `cargarTextosSubidos()`

**Ubicación:** `pestanas/js/cargar-estadisticas.js`

```javascript
function cargarTextosSubidos() {
    // 1. Busca el elemento con ID #textos-subidos
    const elementoTextos = document.getElementById('textos-subidos');
    
    // 2. Realiza petición fetch a get_textos.php
    fetch('pestanas/php/get_textos.php', {...})
    
    // 3. Obtiene la respuesta JSON
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            // 4. Actualiza el contenido con el número de textos
            elementoTextos.textContent = data.data.length;
        }
    })
}
```

## Llamadas a `cargarTextosSubidos()`

La función se ejecuta en los siguientes momentos:

### 1. Carga Inicial
```
Evento: DOMContentLoaded
Archivo: cargar-estadisticas.js (línea 45-46)
```

### 2. Cuando se Cargan Textos
```
Evento: Usuario abre pestaña "Mis Textos"
Archivo: texto.js (línea 40-43)
Función: cargarTextos()
```

### 3. Cuando se Sube un Texto
```
Evento: Éxito en subirTextoFuncion.php
Archivo: subir_texto.js (línea 113-118)
Función: Evento click en btn_subir_texto
```

### 4. Cuando se Eliminan Textos
```
Evento: Éxito en eliminar_textos.php
Archivo: texto.js (línea 252-257)
Función: manejarEliminacionTextos()
```

## Elemento HTML Actualizado

```html
<!-- Ubicado en: pestanas/progreso.php (línea 4) -->
<div class="tarjeta-estadistica">
    <span class="icono-estadistica">📄</span>
    <p class="valor-estadistica" id="textos-subidos">0</p>
    <p class="nombre-estadistica">TEXTOS SUBIDOS</p>
</div>
```

## Base de Datos

**Tabla:** `texts`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | ID único del texto |
| `user_id` | INT | ID del usuario propietario |
| `title` | VARCHAR | Título del texto |
| `content` | TEXT | Contenido del texto |
| `is_public` | BOOLEAN | Indica si es público |
| `category_id` | INT | Categoría del texto |
| `created_at` | TIMESTAMP | Fecha de creación |

**Consulta SQL:**
```sql
SELECT id, title, title_translation, content, content_translation, is_public, category_id, created_at 
FROM texts 
WHERE user_id = :user_id 
ORDER BY created_at DESC
```

## Diagrama de Flujo Completo

```
┌─────────────────────────────────────┐
│   Usuario Accede a la Aplicación    │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  DOMContentLoaded    │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │  cargar-estadisticas.js          │
    │  → cargarTextosSubidos()         │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │  get_textos.php                  │
    │  (obtiene count de textos)       │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │  Actualiza #textos-subidos       │
    │  en tarjeta de Progreso          │
    └──────────┬───────────────────────┘
               │
        ┌──────┴──────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ User ve      │  │ User hace clic   │
│ Progreso     │  │ en Mis Textos    │
└──────────────┘  └────────┬─────────┘
                           │
                           ▼
                  ┌────────────────────┐
                  │ texto.js           │
                  │ cargarTextos()     │
                  └────────┬───────────┘
                           │
                           ▼
        ┌──────────────────────────────┐
        │ cargarTextosSubidos()        │
        │ (actualiza nuevamente)       │
        └──────────────────────────────┘
```

## Consideraciones de Seguridad

- ✅ Se valida `user_id` desde sesión (`$_SESSION['user_id']`)
- ✅ Se utilizan prepared statements para prevenir SQL injection
- ✅ Se verifica autenticación en `seguridad.php`
- ✅ Se valida credenciales en requests fetch (`credentials: 'include'`)

## Notas de Desarrollo

1. La función `cargarTextosSubidos()` se exporta a `window` para ser accesible globalmente
2. Incluye validaciones con `typeof` para evitar errores si la función no existe
3. Los errores se manejan silenciosamente para no interrumpir la experiencia del usuario
4. El valor predeterminado es "0" si hay error en la consulta
