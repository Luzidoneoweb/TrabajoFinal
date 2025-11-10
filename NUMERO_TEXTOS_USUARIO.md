# Flujo: Número de Textos del Usuario

## 📍 De Dónde Obtenemos el Dato del Número de Textos

### 1. **Backend - Obtención de Datos**

**Archivo**: `pestanas/php/get_textos.php`

```php
// Línea 21: Query que obtiene TODOS los textos del usuario
$stmt = $pdo->prepare("SELECT id, title, title_translation, content, content_translation, is_public, category_id, created_at FROM texts WHERE user_id = :user_id ORDER BY created_at DESC");
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
$stmt->execute();
$texts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Línea 26-27: Se retorna el array completo de textos
$response['success'] = true;
$response['data'] = $texts;  // ← Array con todos los textos del usuario
```

**Respuesta JSON**:
```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "Texto 1", "content": "...", ... },
    { "id": 2, "title": "Texto 2", "content": "...", ... },
    { "id": 3, "title": "Texto 3", "content": "...", ... }
  ]
}
```

---

### 2. **Frontend - Recepción y Cálculo del Número**

**Archivo**: `pestanas/js/texto.js`

**Función**: `cargarTextos()`

```javascript
// Línea 10: Fetch al endpoint PHP
fetch('pestanas/php/get_textos.php', { 
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
.then(response => response.json())
.then(data => {
    // Línea 25-27: Selecciona el elemento contador
    const listaTextos = document.querySelector('.lista-textos');
    const visor = document.querySelector('.visor-texto');
    const contador = document.querySelector('.contador-textos');
    
    // 🔑 LÍNEA 37: AQUÍ SE CALCULA EL NÚMERO DE TEXTOS
    if (contador) {
        contador.textContent = `${data.data.length} texto${data.data.length !== 1 ? 's' : ''} encontrado${data.data.length !== 1 ? 's' : ''}`;
    }
    //         ↑
    // El número viene de data.data.length
```

---

### 3. **HTML - Dónde se Muestra**

**Archivo**: `pestanas/textos.php`

```html
<!-- Línea 11: Elemento donde se muestra el contador -->
<p class="contador-textos">...textos encontrados</p>
```

**Resultado en pantalla**:
```
3 textos encontrados
```

---

## 🔄 Flujo Completo

```
┌─────────────────────────────────────────┐
│ Usuario abre pestaña "Mis Textos"       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ texto.js: cargarTextos()                │
│ Ejecuta fetch a get_textos.php          │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ get_textos.php                          │
│ - Query: SELECT * FROM texts            │
│ WHERE user_id = ?                       │
│ - Retorna array de textos               │
│ - Ejemplo: [texto1, texto2, texto3]     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ texto.js recibe JSON                    │
│ data.data.length = 3                    │
│ Actualiza contador con: "3 textos ..."  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ HTML: <p class="contador-textos">       │
│ Muestra: "3 textos encontrados"         │
└─────────────────────────────────────────┘
```

---

## 📊 Datos Clave

### **Variable Clave**: `data.data.length`
- **Tipo**: Number
- **Origen**: Longitud del array devuelto por `get_textos.php`
- **Ubicación**: `pestanas/js/texto.js` línea 37
- **Elemento HTML actualizado**: `.contador-textos`

### **Array de Datos Completo**: `data.data`
```javascript
data.data = [
  {
    id: 1,
    title: "The Quick Brown Fox",
    title_translation: "El Rápido Zorro Marrón",
    content: "The quick brown fox...",
    content_translation: "El rápido zorro marrón...",
    is_public: 0,
    category_id: 5,
    created_at: "2024-11-10 10:30:00"
  },
  // ... más textos ...
]
```

---

## 🔌 Conexión a Base de Datos

**Query exacta** (línea 21 de `get_textos.php`):
```sql
SELECT id, title, title_translation, content, content_translation, is_public, category_id, created_at 
FROM texts 
WHERE user_id = :user_id 
ORDER BY created_at DESC
```

**Resultado**: Un array con N elementos (donde N es el número de textos del usuario)

---

## ⚙️ Cálculo del Número

**JavaScript en texto.js (línea 37)**:
```javascript
contador.textContent = `${data.data.length} texto${data.data.length !== 1 ? 's' : ''} encontrado${data.data.length !== 1 ? 's' : ''}`;
```

**Lógica**:
- Si `data.data.length = 1` → "1 texto encontrado"
- Si `data.data.length = 3` → "3 textos encontrados"
- Si `data.data.length = 0` → "0 textos encontrados"

---

## 📱 Otros Lugares donde se Usa el Número

### 1. **Rendimiento de Textos** (`practica/progreso/ajax_progress_content.php`)
```sql
SELECT COUNT(*) as total_texts FROM texts WHERE user_id = ?
```
- Obtiene el número de textos completamente leídos (100%)

### 2. **Cargador de Prácticas** (`pestanas/js/practicas.js`)
- Usa el mismo `get_textos.php`
- Muestra los mismos textos en selector de práctica

### 3. **Interfaz de Eliminación** (`pestanas/js/texto.js` línea 225)
```javascript
if (!confirm(`¿Estás seguro de que quieres eliminar ${idsTextosAEliminar.length} texto(s) seleccionado(s)?`))
```
- Muestra cuántos textos se van a eliminar

---

## ✅ Resumen

| Aspecto | Detalles |
|---------|----------|
| **Obtención** | `pestanas/php/get_textos.php` → Query DB |
| **Cálculo** | `data.data.length` en `pestanas/js/texto.js` |
| **Visualización** | Elemento `.contador-textos` en `pestanas/textos.php` |
| **Actualización** | Automática cada vez que se abre la pestaña "Mis Textos" |
| **Base de Datos** | Tabla `texts`, filtrado por `user_id` |
| **Seguridad** | Solo muestra textos del usuario logueado (sesión verificada) |
