# Estructura del Contenido de las Pestañas

Este documento explica cómo se organiza y gestiona el contenido de las pestañas en la aplicación, basándose en la implementación actual y el uso de `js/global.js`.

## 1. Archivos de Contenido de las Pestañas

Cada pestaña tiene un archivo PHP dedicado (o HTML si no requiere lógica de servidor) que contiene su contenido específico. Estos archivos se encuentran en el directorio `php/pestanas/`.

*   **`php/pestanas/progreso.php`**: Contenido de la pestaña "Progreso".
*   **`php/pestanas/textos.php`**: Contenido de la pestaña "Mis Textos".
*   **`php/pestanas/vocabulario.php`**: Contenido de la pestaña "Vocabulario".
*   **`php/pestanas/practicas.php`**: Contenido de la pestaña "Prácticas".
*   **`php/pestanas/biblioteca.php`**: Contenido de la pestaña "Biblioteca".

 La pestaña "Configuración" *   **`php/pestanas/configuracion.php`** Contenido de la pestaña "configuracion ".

## 2. Integración del Contenido en `php/conten_logueado.php`

El archivo `php/conten_logueado.php` es el encargado de incluir los archivos de contenido de las pestañas dentro de sus respectivos paneles. Cada panel es un `div` con un ID específico.

**Ejemplo de inclusión (para "Progreso", "Mis Textos", "Vocabulario", "Prácticas", "Biblioteca"):**

```php
            <!-- Pestaña: Progreso -->
            <div class="panel-pestana activo" id="panelProgreso">
                <div class="encabezado-panel">
                    <h2>Mi Progreso</h2>
                </div>
                <div class="contenido-panel">
                    <?php include 'pestanas/progreso.php'; ?>
                </div>
            </div>
```

**Ejemplo de contenido directo (para "Configuración"):**

```html
            <!-- Pestaña: Configuración -->
            <div class="panel-pestana" id="panelConfiguracion">
                <div class="encabezado-panel">
                    <h2>Configuración</h2>
                </div>
                <div class="contenido-panel">
                    <div class="grupo-configuracion">
                        <h3>Idioma de aprendizaje</h3>
                        <label for="idioma-select" class="visually-hidden">Selecciona idioma</label>
                        <select id="idioma-select" class="selector-idioma" aria-label="Selecciona idioma">
                            <option value="en">Inglés</option>
                            <option value="fr">Francés</option>
                            <option value="de">Alemán</option>
                            <option value="it">Italiano</option>
                        </select>
                    </div>
                    <div class="grupo-configuracion">
                        <h3>Notificaciones</h3>
                        <label class="interruptor">
                            <input type="checkbox" checked>
                            <span class="deslizador"></span>
                            Recordatorios diarios
                        </label>
                    </div>
                </div>
            </div>
```

## 3. Navegación de las Pestañas en `php/menu_logueado.php`

Los botones de navegación de las pestañas se encuentran en `php/menu_logueado.php`. Cada botón tiene un atributo `data-pestana` que coincide con el nombre de la pestaña (en minúsculas).

**Ejemplo de botones de pestaña:**

```html
                <div class="pestanas-aplicacion">
                    <button class="pestana activa" data-pestana="progreso">Progreso</button>
                    <button class="pestana" data-pestana="textos">Mis Textos</button>
                    <button class="pestana" data-pestana="vocabulario">Vocabulario</button>
                    <button class="pestana" data-pestana="practicas">Prácticas</button>
                    <button class="pestana" data-pestana="biblioteca">Biblioteca</button>
                    <button class="pestana" data-pestana="configuracion">Configuración</button>
                </div>
```

## 4. Lógica de Cambio de Pestañas (`js/global.js`)

El archivo `js/global.js` contiene la función `cambiarPestana(nombrePestana)` que gestiona la visibilidad de las pestañas y sus paneles:

*   Al hacer clic en un botón de pestaña (`.pestana`), se obtiene su `data-pestana`.
*   Se remueve la clase `activa` de todos los botones de pestaña y la clase `activo` de todos los paneles (`.panel-pestana`).
*   Se añade la clase `activa` al botón de la pestaña seleccionada.
*   Se añade la clase `activo` al panel de contenido correspondiente (cuyo ID es `panel` + NombreDeLaPestanaConMayusculaInicial).

## Pasos para Añadir una Nueva Pestaña:

1.  **Crear el archivo de contenido**: Crea un nuevo archivo PHP en `php/pestanas/` (ej. `php/pestanas/nueva_pestana.php`) con el HTML/PHP deseado.
2.  **Añadir el botón de navegación**: En `php/menu_logueado.php`, añade un nuevo `<button class="pestana" data-pestana="nueva_pestana">Nombre de la Pestaña</button>`.
3.  **Añadir el panel de contenido**: En `php/conten_logueado.php`, añade un nuevo `<div class="panel-pestana" id="panelNuevaPestana">` e incluye el archivo de contenido: `<?php include 'pestanas/nueva_pestana.php'; ?>`.
