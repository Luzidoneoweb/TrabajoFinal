# Estudio Completo: Sistema de Lectura y Traducción de Palabras

## Visión General

El proyecto implementa un **sistema integrado de lectura en voz alta con traducción simultánea de palabras en tiempo real**. Los usuarios pueden leer textos mientras ven traducciones debajo de cada frase original. También pueden seleccionar palabras individuales o múltiples para obtener traducciones bajo demanda.

---

## Arquitectura General

### 1. **Sistema de Lectura (Motor de Voz)**
- **Archivo Principal**: `lector/reading-engine.js`
- **Objeto**: `MotorLectura`
- Usa la API nativa `SpeechSynthesisUtterance` del navegador
- Estados: `inactivo`, `reproduciendo`, `pausado`
- Características:
  - Lectura de párrafos secuencial
  - Resaltado visual del párrafo en lectura
  - Avance automático a la siguiente página
  - Pausa/reanudación desde la última posición
  - Sincronización con traducción de frases

### 2. **Sistema de Traducción de Frases**
- **Archivo Principal**: `traducion_api/lectura-translation-functions.js`
- **Backend**: `traducion_api/translate.php`
- Características:
  - Caché local (`window.contentTranslationsCache`)
  - Caché en base de datos
  - Traducción bajo demanda (frase por frase)
  - Fallback: DeepL → Google Translate
  - Sincronización con lectura en voz

### 3. **Sistema de Selección y Traducción de Palabras**
- **Archivo Principal**: `traducion_api/palabras/multi-word-selection.js`
- **Clase**: `MultiWordSelector`
- Características:
  - Clic simple: traduce palabra individual
  - Arrastrar: traduce múltiples palabras
  - Detección de frases idiomáticas (phrasal verbs)
  - Tooltip con traducción automáticamente oculto después de 3 segundos
  - Guarda palabras traducidas en base de datos

### 4. **Gestión de Textos**
- **Archivo Principal**: `traducion_api/palabras/text-management.js`
- **Backend**: `pestanas/js/lectura.js`
- Características:
  - Carga de contenido desde servidor
  - División de texto en frases
  - Paginación dinámica según tamaño de pantalla
  - Ajuste responsivo (zoom, redimensionamiento de ventana)
  - Persistencia de posición de lectura

---

## Flujo de Lectura con Traducción Simultánea

### Fase 1: Inicialización
1. Usuario abre un texto para leer
2. `pestanas/js/lectura.js::cargarContenidoLectura()` se ejecuta
3. El texto original y su traducción completa se cargan desde la BD
4. Texto se divide en frases: `window.todasLasFrasesOriginales[]`
5. Se calcula `window.frasesPorPagina` basado en viewport
6. Se carga caché de traducciones: `cargarCacheTraducciones(textId)`

### Fase 2: Usuario inicia reproducción (clic en play)
1. `MotorLectura.iniciar()` se llama
2. Determina posición inicial (inicio o última pausada)
3. Establece estado a `reproduciendo`
4. Llama a `MotorLectura.hablarActual()`

### Fase 3: Lectura y Traducción Sincronizadas (el corazón del sistema)
```javascript
MotorLectura.hablarActual() {
  1. Obtiene párrafo actual (p.paragraph)
  2. Calcula índice global: indiceGlobal = paginaActual * frasesPorPagina + indiceActual
  3. Obtiene frase original: window.todasLasFrasesOriginales[indiceGlobal]
  4. Busca elemento HTML donde mostrar traducción (p.texto-traduccion-original)
  5. PUNTO CLAVE:
     - Verifica si traducción existe en window.todasLasFrasesTraduccion[]
     - Si no, busca en cache: window.contentTranslationsCache[]
     - Si no existe, traduce en tiempo real: await window.traducirFrase()
  6. Inserta traducción en el DOM
  7. Inicia lectura de voz: this.hablar(text)
}

hablar(text) {
  1. Crea SpeechSynthesisUtterance con el texto
  2. Configura velocidad, pitch, volumen, idioma
  3. Al terminar (utt.onend):
     - Incrementa indiceActual++
     - Llama a this.siguiente()
}

siguiente() {
  1. Si hay más frases en página actual:
     - Llama a hablarActual() para siguiente frase
  2. Si no hay más frases pero hay siguiente página:
     - Clic automático en btn-siguiente
     - Espera 300ms para que DOM se actualice
     - Reinicia indiceActual = 0
     - Llama a hablarActual()
  3. Si no hay más contenido:
     - Llama a finalizarLecturaNatural()
}
```

### Fase 4: Estructura HTML Renderizada
```html
<div class="page active">
  <div class="frase frase-original">
    <p class="paragraph reading-current">This is the original text...</p>
  </div>
  <div class="frase-traduccion-original">
    <p class="texto-traduccion-original">Esto es el texto original...</p>
  </div>
  <!-- Siguiente frase... -->
</div>
```

---

## Sistema de Traducción en Detalle

### Funciones Clave en `lectura-translation-functions.js`

#### 1. `traducirFrase(fraseOriginal, textId)`
```javascript
// Entrada: frase original e ID del texto
// Salida: Promise<string> con la traducción
// Proceso:
// 1. Verifica cache local
// 2. Si no existe, POST a translate.php
// 3. Guarda en cache local
// 4. Guarda en BD de forma asíncrona
// 5. Retorna traducción
```

#### 2. `cargarCacheTraducciones(textId)`
```javascript
// Se ejecuta al iniciar lectura
// GET a get_content_translation.php?text_id={textId}
// Carga todas las traducciones previas al cache local
// Reduce peticiones a API durante lectura
```

#### 3. `guardarTraduccionEnBD(textId, content, translation)`
```javascript
// POST a save_content_translation.php
// Guarda traducción para evitar traducir 2 veces
// Se ejecuta de forma asíncrona (no espera)
```

### Backend PHP: `translate.php`

**Estrategia Híbrida**:
1. Intenta **DeepL API** primero (más rápido, mejor calidad)
2. Si falla, usa **Google Translate** (gratuito, siempre disponible)
3. Si ambos fallan, devuelve error

**Detección Automática de Idioma**:
```php
// Detecta caracteres españoles (á, é, í, ó, ú, ñ) → español → inglés
// Por defecto → inglés → español
```

**Respuesta JSON**:
```json
{
  "translation": "el texto traducido",
  "source": "DeepL",
  "original": "original text",
  "detected_language": "en"
}
```

---

## Sistema de Selección de Palabras

### Clase `MultiWordSelector`

#### Eventos Manejados
1. **mousedown**: Inicia selección
2. **mousemove**: Arrastra selección entre palabras
3. **mouseup**: Completa selección y traduce

#### Modo de Funcionamiento
- **Clic simple**: Traduce palabra individual
- **Arrastrar**: Traduce múltiples palabras (desde palabra inicio hasta palabra fin)

#### Detección de Frases Idiomáticas
- Contiene lista de 300+ phrasal verbs en inglés
- Detecta automáticamente expresiones como "look up", "get away", etc.
- Si usuario hace clic en palabra de un phrasal verb, selecciona automáticamente la expresión completa

#### Tooltip
- Muestra traducción debajo de las palabras seleccionadas
- Se posiciona automáticamente (arriba/abajo de palabras)
- Se oculta automáticamente después de 3 segundos
- Se puede ocultar manualmente haciendo clic fuera

#### Guardado de Palabras
- Cuando se traduce, llama a `window.saveTranslatedWord()`
- Guarda en tabla `saved_words` de la BD
- Incluye:
  - Palabra
  - Traducción
  - Contexto (oración completa)
  - ID del texto
  - Timestamp

---

## Manejo de Pausa y Reanudación

### Variables Clave en `MotorLectura`
```javascript
lastPausedParagraphIndex    // Índice del párrafo donde se pausó
lastPausedPageIndex         // Índice de la página donde se pausó
estado                      // 'inactivo' | 'reproduciendo' | 'pausado'
```

### Proceso de Pausa
```javascript
pausar() {
  1. Cambia estado a 'pausado'
  2. Guarda posición actual:
     - lastPausedParagraphIndex = indiceActual
     - lastPausedPageIndex = window.paginaActual
  3. Cancela SpeechSynthesis
}
```

### Proceso de Reanudación
```javascript
reanudar() {
  1. Cambia estado a 'reproduciendo'
  2. Si página guardada ≠ página actual:
     - Navega a página guardada: await window.mostrarPagina(lastPausedPageIndex)
     - Espera 100ms para actualizar DOM
  3. Establece indiceActual = lastPausedParagraphIndex
  4. Llama a hablarActual() desde esa posición
}
```

---

## Base de Datos

### Tabla: `saved_words`
```sql
id               INT PRIMARY KEY
user_id          INT (FK a users)
word             VARCHAR(255) - palabra original
translation      TEXT - traducción
context          TEXT - oración de contexto
text_id          INT (FK a texts) - nullable
created_at       TIMESTAMP
```

### Tabla: `text_translations` (implícita)
```
text_id          INT (FK)
content          TEXT (frase original)
translation      TEXT (frase traducida)
```

---

## Flujo Técnico Completo (Ejemplo)

### Usuario carga "The Quick Brown Fox"
```
1. DOM Inicial: <div id="panelLectura"><div class="zona-frases"></div></div>

2. cargarContenidoLectura() ejecuta:
   - GET pestanas/php/get_lectura_data.php?text_id=5
   - Obtiene: {title: "...", content: "...", content_translation: "..."}
   - window.todasLasFrasesOriginales = ["The", "quick", "brown", "fox", ...]
   - window.frasesPorPagina = 4 (calculado dinámicamente)
   - await cargarCacheTraducciones(5)
   - window.mostrarPagina(0)

3. mostrarPagina(0) renderiza:
   <div class="page active">
     <div class="frase frase-original">
       <p class="paragraph">The quick</p>
     </div>
     <div class="frase-traduccion-original">
       <p class="texto-traduccion-original"></p>
     </div>
     <!-- 3 frases más... -->
   </div>

4. Usuario hace clic en btn-play:
   - MotorLectura.iniciar()
   - indiceActual = 0, paginaActual = 0, estado = 'reproduciendo'
   - hablarActual()

5. hablarActual() (primer párrafo):
   - p = <p class="paragraph">The quick</p>
   - indiceGlobal = 0 * 4 + 0 = 0
   - fraseOriginal = window.todasLasFrasesOriginales[0] = "The quick"
   - pTraduccion = <p class="texto-traduccion-original"></p>
   
   - Busca traducción:
     a) window.todasLasFrasesTraduccion[0] = undefined
     b) window.contentTranslationsCache["The quick"] = undefined
     c) await window.traducirFrase("The quick", 5)
        - POST translate.php con "The quick"
        - DeepL responde: "El rápido"
        - Guarda en cache: window.contentTranslationsCache["The quick"] = "El rápido"
        - POST save_content_translation.php
        - Retorna "El rápido"
   
   - pTraduccion.textContent = "El rápido"
   - hablar("The quick")
   
6. hablar() crea SpeechSynthesisUtterance:
   - Navegador lee en voz alta: "The quick"
   - Mientras se lee, usuario ve: "El rápido" debajo
   
7. Cuando termina la voz (utt.onend):
   - indiceActual++ (ahora 1)
   - siguiente()
   - hablarActual() (segundo párrafo)
   - ... (repite proceso)

8. Si hay siguiente página:
   - siguiente() detecta: indiceActual >= parrafos.length
   - Clic en btn-siguiente
   - mostrarPagina(1) se ejecuta
   - indiceActual = 0
   - hablarActual() continúa automáticamente

9. Usuario hace clic en "brown":
   - MultiWordSelector.onMouseUp()
   - hasDragged = false (fue clic simple)
   - selectedWords = [elemento con "brown"]
   - highlightWord() añade clase word-selection
   - translateSelection()
     - POST translate.php con "brown"
     - Obtiene traducción: "marrón"
     - showTooltip("brown", "marrón")
     - Tooltip aparece debajo de "brown" durante 3 segundos
     - saveTranslatedWord("brown", "marrón", "contexto...")

10. Usuario selecciona "quick brown" arrastrando:
    - MultiWordSelector.updateSelection()
    - selectedWords = [elemento "quick", elemento "brown"]
    - highlightSelection() añade clases start/end
    - translateSelection()
      - POST translate.php con "quick brown"
      - Obtiene: "rápido marrón"
      - showTooltip("quick brown", "rápido marrón")
      - saveTranslatedWord("quick brown", "rápido marrón", "contexto...")
```

---

## Optimizaciones Implementadas

### 1. **Caché Multinivel**
- Cache local en memoria (`window.contentTranslationsCache`)
- Cache en BD (`text_translations`)
- Evita traducir dos veces la misma frase

### 2. **Traducción Asíncrona**
- `guardarTraduccionEnBD()` no espera respuesta
- No bloquea la lectura mientras se guarda en BD

### 3. **Detección de Idioma Automática**
- No requiere parámetro de idioma
- Detecta caracteres españoles

### 4. **API Híbrida**
- DeepL para mejor calidad (rápido)
- Google Translate como fallback gratuito

### 5. **Renderización Eficiente**
- Solo renderiza la página actual
- Recalcula frases por página en responsivo

### 6. **Pausa/Reanudación Robusta**
- Guarda página Y párrafo
- Navega a página guardada si es necesario
- Espera a que DOM se actualice antes de reanudar

---

## Estados Globales Importantes

```javascript
// En window (variables globales accesibles)
window.currentTextId              // ID del texto en lectura
window.paginaActual               // Página actual mostrada
window.frasesPorPagina            // Frases calculadas para página
window.todasLasFrasesOriginales[] // Array con todas las frases
window.todasLasFrasesTraduccion[] // Array con traducciones
window.contentTranslationsCache   // Objeto { frase: traducción }
window.isCurrentlyReading         // Booleano de lectura activa
window.isCurrentlyPaused          // Booleano de pausa
window.MotorLectura               // Objeto de control de lectura
```

---

## Archivos Clave - Resumen

| Archivo | Responsabilidad |
|---------|-----------------|
| `lector/reading-engine.js` | Motor de voz, sincronización |
| `traducion_api/lectura-translation-functions.js` | Traducción de frases, caché |
| `traducion_api/palabras/multi-word-selection.js` | Selección y traducción de palabras |
| `traducion_api/palabras/text-management.js` | Gestión de estado global |
| `pestanas/js/lectura.js` | Paginación, UI, carga de contenido |
| `traducion_api/translate.php` | Backend de traducción (DeepL/Google) |
| `traducion_api/palabras/save_translated_word.php` | Persistencia de palabras guardadas |

---

## Puntos Clave para Entender

1. **La traducción es sincronizada**: Se muestra ANTES de que se lea el texto en voz
2. **Sistema de caché triple**: Memoria → BD → API
3. **Phrasal verbs detectados**: Automáticamente se traducen como unidad
4. **Pausa robusta**: Recuerda página Y párrafo exacto
5. **Responsive**: Se adapta a zoom y tamaño de ventana
6. **Usuario-centric**: Guarda palabras de aprendizaje individual
