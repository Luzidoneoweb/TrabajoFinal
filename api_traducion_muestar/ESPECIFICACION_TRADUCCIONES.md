# Especificación del Sistema de Traducción

## 🌐 Descripción General

El sistema de traducción de LeerEntender se basa en **Google Translate** para traducir automáticamente de inglés a español. Incorpora un sistema de caché inteligente, traducción párrafo por párrafo y manejo de errores.

## 🔧 Configuración Técnica

### Proveedor Principal
- **Servicio**: Google Translate
- **Idioma origen**: Inglés (en)
- **Idioma destino**: Español (es)
- **Método**: API directa

### Archivos Principales Involucrados
- `translate.php`: Endpoint principal para realizar las traducciones.
- `save_content_translation.php`: Gestiona el guardado de las traducciones en la base de datos.
- `get_content_translation.php`: Se encarga de recuperar las traducciones previamente guardadas.

## 🏗️ Arquitectura y Flujo de Traducción

El sistema maneja dos tipos principales de traducción:

### 1. Traducción de Párrafos (Línea por Línea)

Esta funcionalidad se activa cuando el usuario está leyendo un párrafo.

**Flujo:**
1.  **Usuario inicia lectura**: Un párrafo se resalta.
2.  **Verificación de caché local**: Se comprueba si la traducción del párrafo ya existe en `window.contentTranslationsCache` (caché JavaScript).
3.  **Verificación de base de datos**: Si no está en caché local, se intenta recuperar de la base de datos a través de `get_content_translation.php`.
4.  **Traducción con API**: Si no se encuentra en ninguna caché, se envía el párrafo a `translate.php` para ser traducido por Google Translate.
5.  **Guardado**: La traducción obtenida se guarda en la caché local (`window.contentTranslationsCache`) y en la base de datos (`save_content_translation.php`).
6.  **Visualización**: La traducción se muestra al usuario.

**Función JavaScript clave (ejemplo):**
```javascript
function translateAndSaveParagraph(text, box, textId) {
    // ... lógica de caché y fetch a translate.php ...
    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'word=' + encodeURIComponent(text)
    })
    .then(res => res.json())
    .then(data => {
        if (data.translation) {
            box.innerText = data.translation;
            window.contentTranslationsCache[text] = data.translation;
            saveToDatabase(text, data.translation, textId); // Esta función llama a save_content_translation.php
        }
    });
}
```

### 2. Traducción de Palabras Individuales

Esta funcionalidad se activa cuando el usuario hace clic en una palabra.

**Flujo:**
1.  **Clic en palabra**: El usuario hace clic en una palabra dentro del texto.
2.  **Traducción con API**: La palabra se envía a `translate.php` para obtener su traducción.
3.  **Visualización**: La traducción se muestra en un tooltip.
4.  **Guardado**: La palabra traducida se guarda para futuras prácticas (`saveTranslatedWord`).

**Función JavaScript clave (ejemplo):**
```javascript
function handleWordClick(event) {
    const word = this.textContent.trim();
    fetch('translate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'word=' + encodeURIComponent(word)
    })
    .then(res => res.json())
    .then(data => {
        if (data.translation) {
            showSimpleTooltip(this, word, data.translation);
            saveTranslatedWord(word, data.translation, sentence);
        }
    });
}
```

## 💾 Sistema de Caché

El sistema utiliza una estrategia de caché de tres niveles para optimizar el rendimiento y reducir las llamadas a la API de Google Translate:

1.  **Caché Local (JavaScript)**: `window.contentTranslationsCache`. Es la primera en ser consultada y se carga al inicio de la lectura de un texto (`window.loadContentTranslationsCache`).
2.  **Base de Datos**: Las traducciones de párrafos se almacenan en la tabla `content_translations`.
3.  **API de Google Translate**: Es la última opción si la traducción no se encuentra en ninguna de las cachés.

## 🚨 Manejo de Errores

El sistema incluye mecanismos para manejar errores como timeouts de traducción y problemas de red, mostrando mensajes al usuario y, en algunos casos, utilizando traducciones anteriores como fallback.

## 🎯 Funciones de Traducción Identificadas

Basado en la documentación, las funciones principales relacionadas con la traducción son:

**Lado del cliente (JavaScript):**
-   `translateAndSaveParagraph(text, box, textId)`: Gestiona la traducción y guardado de párrafos.
-   `handleWordClick(event)`: Gestiona la traducción de palabras individuales al hacer clic.
-   `window.loadContentTranslationsCache()`: Carga las traducciones de la base de datos en la caché local.
-   `saveToDatabase(text, translation, textId)`: (Implícita, llamada por `translateAndSaveParagraph`) Guarda la traducción en la BD.
-   `saveTranslatedWord(word, translation, sentence)`: (Implícita, llamada por `handleWordClick`) Guarda palabras traducidas para práctica.

**Lado del servidor (PHP):**
-   `translate.php`: Recibe un texto y devuelve su traducción usando Google Translate.
-   `save_content_translation.php`: Recibe el contenido original, la traducción y el ID del texto para guardarlos en la base de datos.
-   `get_content_translation.php`: Recibe un ID de texto y devuelve las traducciones de contenido asociadas desde la base de datos.

## 🔮 Futuras Mejoras (según la documentación)

La documentación sugiere mejoras como la integración con otros proveedores de traducción (DeepL, Microsoft Translator, OpenAI), la implementación de traducción offline y la mejora de la traducción contextual.

---
