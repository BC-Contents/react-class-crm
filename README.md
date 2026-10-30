# Guía Paso a Paso: Desplegar un Proyecto de React + Vite en GitHub Pages

Esta guía explica paso a paso todas las configuraciones necesarias para publicar una aplicación de **React con Vite** en **GitHub Pages**, tanto para un **proyecto sin React Router** como para un **proyecto con React Router**, además de cómo configurar la rama **`gh-pages`** en los ajustes del repositorio.

---

## 🌿 ¿Qué es la rama `gh-pages` y qué hace exactamente?

Cuando subimos un proyecto normal a GitHub con `git push`, subimos nuestro **código fuente** (la carpeta `src/`, archivos `.jsx`, `package.json`, etc.) a la rama `main`. Sin embargo, **el navegador y GitHub Pages no entienden archivos `.jsx` ni saben ejecutar React directamente**; si intentas publicar la rama `main`, la página se quedará en blanco con error `404 (main.jsx not found)`.

Aquí es donde entra el paquete **`gh-pages`** y la rama automática **`gh-pages`**:

1. **Compilación (`npm run build`)**: Vite toma todo tu proyecto de React (`src/`) y lo traduce/empaqueta en una carpeta llamada **`dist/`**, que contiene únicamente un `index.html` y una carpeta `assets/` con código HTML, CSS y JavaScript puro que cualquier navegador entiende.
2. **Creación automática de la rama `gh-pages`**: Al ejecutar el despliegue (`npm run deploy` o `npx gh-pages -d dist`), la librería crea automáticamente en tu repositorio de GitHub una rama nueva llamada **`gh-pages`** y sube a ella **únicamente el contenido de la carpeta `dist/`** (sin `src/`, sin `package.json` y sin `node_modules/`).
3. **Separación limpia**:
   - Tu rama **`main`** (o tu rama de trabajo) **conserva todo tu código de React intacto** para seguir programando.
   - La rama **`gh-pages`** contiene **solo la web ya compilada (`index.html` + `assets/`)** lista para que el servidor de GitHub Pages la muestre funcionando en internet.

---

## 🚀 Caso 1: Proyecto de React SIN React Router

Si tu proyecto de React no utiliza `react-router` (o es un proyecto estándar con `App.jsx`), sigue estos **4 pasos**:

### Paso 1: Instalar el paquete `gh-pages`
Ejecuta en la terminal dentro de la carpeta de tu proyecto:

```bash
npm install -D gh-pages
```
*(Nota: Si en consola sale un error de dependencias `ERESOLVE`, ejecuta `npm install -D gh-pages --legacy-peer-deps`)*.

---

### Paso 2: Configurar `base` en [`vite.config.js`](./vite.config.js)
GitHub Pages publica los proyectos dentro de una subcarpeta con el **nombre exacto de tu repositorio** (`https://usuario.github.io/nombre-de-tu-repo/`).

Abre [`vite.config.js`](./vite.config.js) y añade la propiedad `base` con el nombre exacto de tu repositorio de GitHub entre barras `/`:

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/react-class-crm/', // 👈 Pon aquí el nombre exacto de tu repositorio entre barras /
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```
> **¡Importante! Guarda el archivo (`Ctrl + S` / `Cmd + S`)** después de añadir `base`. Si no pones `base`, la web en GitHub Pages se quedará en blanco porque no encontrará la carpeta `assets/`.

---

### Paso 3: Configurar `predeploy` y `deploy` en [`package.json`](./package.json)
Abre tu [`package.json`](./package.json) y dentro de `"scripts"` añade `"predeploy"` y `"deploy"`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
> **¡Recuerda guardar el archivo `package.json` (`Ctrl + S` / `Cmd + S`) antes de seguir!**

- **`"predeploy": "npm run build"`**: Se ejecuta automáticamente antes de `deploy` y genera la carpeta `dist/`.
- **`"deploy": "gh-pages -d dist"`**: Sube la carpeta `dist/` a la rama `gh-pages` de tu GitHub.

---

### Paso 4: Ejecutar el despliegue en la terminal
Ejecuta en la terminal:

```bash
npm run deploy
```

> [!TIP]
> **¿Te sale el error `ENOENT: no such file or directory, stat '.../build'` al hacer `npm run deploy`?**
> Eso ocurre si `package.json` no se ha guardado (`Ctrl + S`), si pusiste `-d build` en vez de `-d dist`, o si tienes otra carpeta abierta en el editor.
> También puedes compilar y subir manualmente con estos dos comandos directos:
> ```bash
> npm run build
> npx gh-pages -d dist
> ```

Cuando termine correctamente, aparecerá la palabra **`Published`** en la terminal.

---

## 🧭 Caso 2: Proyecto de React CON React Router

Si tu proyecto utiliza **React Router** (`react-router`), se hacen los mismos pasos anteriores pero teniendo en cuenta las rutas:

1. **Instalar `gh-pages`**:
   ```bash
   npm install -D gh-pages
   ```
2. **Añadir `base: '/nombre-de-tu-repo/'` en [`vite.config.js`](./vite.config.js)**.
3. **Añadir los scripts en [`package.json`](./package.json)** (copiando también `index.html` a `404.html` para que GitHub Pages no dé error 404 al recargar rutas como `/contacto` o `/tema/1`):
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "lint": "eslint .",
     "preview": "vite preview",
     "predeploy": "npm run build && cp dist/index.html dist/404.html",
     "deploy": "gh-pages -d dist"
   }
   ```
   *(En Windows CMD, si `cp` falla, puedes usar simplemente `"predeploy": "npm run build"`).*
4. **En [`src/router/index.jsx`](./src/router/index.jsx)**:
   Para que React Router funcione directamente bajo la subruta del repositorio en GitHub Pages (`https://usuario.github.io/nombre-repo/`) sin mostrar la página de `NotFound`, puedes usar `createHashRouter` (que gestiona las rutas con `#/`) o `createBrowserRouter`.
5. **Publicar con `npm run deploy`** (o `npm run build` seguido de `npx gh-pages -d dist`) hasta ver **`Published`**.

---

## ⚙️ Paso Final Obligatorio: Configurar `Settings → Pages` en GitHub con la rama `gh-pages`

Una vez que en tu terminal ha salido **`Published`**, la rama **`gh-pages`** ya existe en tu repositorio de GitHub. Ahora debes indicarle a GitHub Pages que lea esa rama:

1. Entra a tu repositorio en **GitHub.com**.
2. Arriba del todo, haz clic en la pestaña **Settings** (Configuración).
3. En el menú lateral izquierdo, baja hasta la sección *Code and automation* y haz clic en **Pages**.
4. Dentro de **Build and deployment**:
   - En **Source**, deja seleccionado **`Deploy from a branch`**.
   - En **Branch**, abre el desplegable de ramas y selecciona la rama generada **`gh-pages`** (si tenías la página abierta de antes y no aparece en la lista, recarga la pestaña del navegador con `F5` / `Cmd + R`).
   - En la carpeta de al lado, deja seleccionado **`/ (root)`**.
   - Haz clic en el botón **Save**.

> [!IMPORTANT]
> **¿Por qué hay que elegir `gh-pages` y NO `main`?**
> - Si eliges `main` (o cualquier otra rama de código), GitHub Pages intentará abrir tu `index.html` sin compilar (que llama a `/src/main.jsx`), la pantalla se quedará **en blanco** y en la consola del navegador saldrá `GET .../src/main.jsx 404 (Not Found)`.
> - Al elegir **`gh-pages`**, GitHub Pages sirve el `index.html` y la carpeta `assets/` **ya compilados**, haciendo que tu aplicación de React se vea y funcione correctamente.

5. Espera entre **30 y 60 segundos** tras darle a **Save**, recarga la página de Settings y arriba te aparecerá el enlace público de tu proyecto:
   `https://<tu-usuario>.github.io/<nombre-de-tu-repositorio>/`

---

## 📊 Resumen Rápido de Comandos

| Acción | Comando / Configuración |
| :--- | :--- |
| **1. Instalar herramienta** | `npm install -D gh-pages` |
| **2. En `vite.config.js`** | Añadir `base: '/nombre-del-repositorio/',` |
| **3. En `package.json` (`scripts`)** | `"predeploy": "npm run build"`, `"deploy": "gh-pages -d dist"` |
| **4. Subir a GitHub Pages** | `npm run deploy` *(o `npm run build` + `npx gh-pages -d dist`)* |
| **5. En GitHub (`Settings → Pages`)** | En **Branch**, seleccionar la rama **`gh-pages`** y **`/ (root)`** → **Save** |
