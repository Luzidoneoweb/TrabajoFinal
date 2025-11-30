# Documentación de la API de Traducción

Este documento explica el funcionamiento de la API de traducción, los archivos involucrados, las APIs externas utilizadas, las funciones principales y una revisión de código.

## 1. Visión General

La API de traducción implementa un sistema híbrido que combina DeepL y Google Translate, priorizando DeepL como primera opción. Gestiona tres niveles de caché para optimizar el rendimiento:

1. **Caché en memoria del navegador** (`window.contentTranslationsCache`) - Más rápido
2. **Base de datos** - Persistencia entre sesiones
3. **APIs externas** (DeepL/Google Translate) - Última opción

El flujo de traducción es:
- Verificar caché local → Buscar en BD → Llamar API externa

Esto evita llamadas innecesarias a APIs externas cuando las traducciones ya existen en BD.

## 2. Archivos Involucrados

Los archivos principales que intervienen en el sistema de traducción son:

*   **`traducion_api/translate.php`**: El *endpoint* principal de la API de traducción. Recibe texto y devuelve su traducción usando DeepL o Google Translate.
*   **`traducion_api/lectura-translation-functions.js`**: Contiene las funciones JavaScript que orquestan el proceso de traducción, gestionan caché en tres niveles (memoria, BD, APIs externas).
*   **`traducion_api/get_content_translation.php`**: Recupera las traducciones de contenido previamente guardadas para un texto específico desde la BD.
*   **`traducion_api/save_content_translation.php`**: Guarda la traducción de frases/fragmentos de contenido en la BD.
*   **`traducion_api/save_title_translation.php`**: Guarda la traducción de un título en el campo `title_translation` de la BD.
*   **`traducion_api/save_complete_translation.php`**: Guarda o actualiza la traducción completa en el campo `content_translation` de la BD.
*   **`db/conexion.php`**: Archivo de conexión a la base de datos (incluido por los scripts PHP).

## 3. Flujo de Trabajo

### 3.1 Desde el Frontend (JavaScript)

El archivo `lectura-translation-functions.js` proporciona las funciones para interactuar con la API:

**1. `traducirFrase(fraseOriginal, textId)`** (ACTUALIZADO):
   - Es la función principal para traducir una frase.
   - Implementa un flujo de tres niveles:
     - **Nivel 1 (Caché local)**: Verifica si la traducción ya está en `window.contentTranslationsCache`. Si existe, devuelve inmediatamente.
     - **Nivel 2 (Base de datos)**: Si no está en caché, llama a `obtenerTraduccionDesBD()` para buscar en la BD. Si existe, la carga en caché y devuelve.
     - **Nivel 3 (API Externa)**: Solo si no existe en caché ni en BD, realiza una petición POST a `translate.php`.
   - Una vez traducida, guarda en caché local y, de forma asíncrona, persiste en BD.
   - Devuelve una `Promise` con la traducción.

**2. `obtenerTraduccionDesBD(fraseOriginal, textId)`** (NUEVA):
   - Busca una traducción específica en la BD sin consumir caché.
   - Llama a `get_content_translation.php` para obtener todas las traducciones del texto.
   - Busca la coincidencia exacta de la frase en el array de traducciones.
   - Devuelve la traducción si existe, `null` en caso contrario.
   - En caso de error, devuelve `null` sin interrumpir el flujo (fallback a API externa).

**3. `cargarCacheTraducciones(textId)`**:
   - Carga de forma anticipada todas las traducciones de un texto desde la BD.
   - Útil para precargar traducciones al iniciar la lectura de un texto.
   - Almacena en `window.contentTranslationsCache` para acceso instantáneo.

**4. `traducirTitulo(title, textId)`**:
   - Traduce el título de un texto llamando a `translate.php`.
   - Una vez traducido, llama a `guardarTraduccionTituloEnBD` para persistir.

**5. `guardarTraduccionCompletaEnBD(textId, contentTranslation)`**:
   - Guarda la traducción completa de un texto en la BD.

### 3.2 Desde el Backend (PHP)

**`translate.php`** es el corazón de la lógica de traducción:

*   Recibe el texto a traducir (`text` o `word` en POST).
*   Detecta el idioma de origen usando `detectLanguage()`.
*   Intenta traducir con DeepL (la API de pago más precisa).
*   Si DeepL falla, intenta con Google Translate (fallback gratuito).
*   Devuelve JSON con: traducción, fuente (DeepL/Google), idioma detectado.

**Flujo detallado:**
1. Validación de entrada (no vacío)
2. Detección de idioma
3. Llamada a DeepL con timeout de 3 segundos
4. Si falla → Llamada a Google Translate con timeout de 3 segundos
5. Si ambas fallan → Error JSON

## 4. APIs Externas Utilizadas

### 4.1 DeepL API (Prioridad 1)

*   **Endpoint**: `https://api-free.deepl.com/v2/translate`
*   **Tipo**: Servicio premium de traducción (API oficial)
*   **Método**: POST con `curl`
*   **Parámetros**:
    - `auth_key`: Clave API (actualmente `89bb7c47-40dc-4628-9efb-8882bb6f5fba:fx`)
    - `text`: Texto a traducir
    - `target_lang`: Idioma destino (EN o ES)
*   **Timeout**: 3 segundos (conexión: 2s, lectura: 3s)
*   **Ventajas**: Más precisa, mejor para textos largos
*   **Desventaja**: Requiere clave API (actualmente expuesta en el código)

### 4.2 Google Translate API (Prioridad 2)

*   **Endpoint**: `https://translate.googleapis.com/translate_a/single`
*   **Tipo**: API no oficial pero funcional
*   **Método**: GET con `file_get_contents`
*   **Parámetros**:
    - `client=gtx`: Cliente (necesario para funcionar)
    - `sl`: Idioma de origen
    - `tl`: Idioma de destino
    - `dt=t`: Tipo de traducción
    - `q`: Texto a traducir (URL encoded)
*   **Timeout**: 3 segundos
*   **Ventajas**: Gratuito, sin autenticación requerida
*   **Desventaja**: No oficial, podría dejar de funcionar

## 5. Funciones Principales

### 5.1 PHP (`translate.php`)

*   **`detectLanguage($text)`**:
    - Intenta determinar el idioma de origen.
    - Usa regex para detectar caracteres especiales españoles (áéíóúñ).
    - Si encuentra caracteres especiales → Español → Traducir a Inglés
    - Si no → Inglés → Traducir a Español
    - **Limitación**: Solo detecta español e inglés, puede fallar con otros idiomas o spanglish.

*   **`translateWithDeepL($text, $target_lang, $api_key)`**:
    - Realiza traducción con DeepL usando `curl`.
    - Timeouts optimizados para no bloquear.
    - Retorna traducción si es exitosa, `false` en caso de error.

*   **`translateWithGoogle($text, $source_lang, $target_lang)`**:
    - Realiza traducción con Google usando `file_get_contents`.
    - Retorna traducción si es exitosa, `false` en caso de error.

### 5.2 JavaScript (`lectura-translation-functions.js`)

*   **`traducirFrase(fraseOriginal, textId)`** (ACTUALIZADO):
    - Orquesta el proceso de traducción con tres niveles de caché.
    - Primero local, luego BD, finalmente API.

*   **`obtenerTraduccionDesBD(fraseOriginal, textId)`** (NUEVA):
    - Busca traducción específica en BD.
    - Devuelve `null` si no existe (permite fallback sin errores).

*   **`guardarTraduccionEnBD(textId, content, translation)`**:
    - Envía traducción de frase al backend (asíncrono).
    - POST a `save_content_translation.php`.

*   **`cargarCacheTraducciones(textId)`**:
    - Carga anticipadamente todas las traducciones desde BD.
    - GET a `get_content_translation.php`.

*   **`traducirTitulo(title, textId)`**:
    - Traduce el título y lo guarda en BD.

## 6. Estructura de Datos en BD

### Campo `content_translation` (JSON Array)

```json
[
  {
    "content": "Texto original en inglés",
    "translation": "Traducción al español"
  },
  {
    "content": "Another sentence",
    "translation": "Otra oración"
  }
]
```

**Características**:
- Se almacena como JSON en la columna `content_translation` de la tabla `texts`
- Permite múltiples traducciones por texto
- Se actualiza incrementalmente (se agrega cada nueva traducción)
- En `get_content_translation.php` se decodifica y devuelve como array

### Campo `title_translation` (String)

- Columna separada que almacena solo la traducción del título
- Se sobrescribe completamente cada vez (no acumulativo como `content_translation`)

## 7. Seguridad y Autorización

Todos los endpoints PHP incluyen verificaciones:

*   **`$_SESSION['user_id']`**: Valida que el usuario esté autenticado.
*   **Verificación de propiedad**: Solo usuarios propietarios del texto pueden guardar/leer sus traducciones.
*   **Textos públicos**: Los usuarios pueden leer traducciones de textos públicos aunque no sean propietarios.

## 8. Manejo de Errores

### Frontend:
- Bloques `try-catch` en todas las funciones async
- `console.error` y `console.warn` para depuración
- Fallback a valor vacío si traducción falla
- Errores en `obtenerTraduccionDesBD` no interrumpen (devuelven `null`)

### Backend:
- Validación de parámetros POST/GET
- Manejo de excepciones PDO
- Respuestas JSON uniformes
- `error_log` en algunos endpoints para registrar problemas

## 9. Revisión de Código y Mejoras Potenciales

### Problemas Identificados

*   **Clave DeepL expuesta**: La clave de API está directamente en el código. Debería estar en variable de entorno.
*   **Detección de idioma simplificada**: Solo detecta español/inglés. Podría mejorar con librería más robusta.
*   **Google Translate no oficial**: API no oficial, podría dejar de funcionar.
*   **`file_get_contents` vs `curl`**: Google Translate debería usar `curl` para mayor control.

### Optimizaciones Implementadas

*   **Búsqueda en BD antes de API**: Evita llamadas innecesarias a APIs externas.
*   **Caché en tres niveles**: Memoria (rápido), BD (persistencia), APIs (fallback).
*   **Timeouts optimizados**: 3 segundos máximo para no bloquear interfaz.

### Mejoras Sugeridas

*   Migrar clave DeepL a `.env` o variables de entorno
*   Considerar librería de detección de idioma más precisa
*   Añadir mecanismo de reintento para errores transitorios
*   Usar `curl` para ambas APIs externas
*   Añadir logging detallado de fallos de traducción

## 10. Flujo Completo de Traducción (Usuario Nuevo vs Usuario Existente)

### Usuario Nuevo (Sin Traducciones en BD)

1. Frontend: `traducirFrase("Hello", 1)`
2. Caché local → No existe
3. BD → No existe
4. API DeepL → "Hola" ✓
5. Guarda en caché local
6. Guarda en BD (asíncrono)
7. Devuelve "Hola"

### Usuario Existente (Con Traducciones en BD)

1. Frontend: `traducirFrase("Hello", 1)`
2. Caché local → No existe (primera carga de sesión)
3. BD → Existe "Hola" ✓
4. Guarda en caché local
5. Devuelve "Hola" (sin llamar API externa)

### Con Precarga de Caché

1. Frontend: `cargarCacheTraducciones(1)` (al iniciar lectura)
2. Carga todas las traducciones de BD al caché
3. `traducirFrase("Hello", 1)`
4. Caché local → Existe "Hola" ✓
5. Devuelve inmediatamente (sin BD ni API)

## Conclusión

La API de traducción es un sistema robusto que optimiza el rendimiento mediante un enfoque de múltiples niveles de caché, evitando llamadas innecesarias a APIs externas. El cambio reciente (búsqueda en BD antes de API) resuelve el problema de no cargar traducciones existentes cuando no hay caché previniendo costos innecesarios de API.
