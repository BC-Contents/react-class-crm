# Guía Paso a Paso: Desplegar un Proyecto de React + Vite en GitHub Pages

Esta guía explica paso a paso todas las configuraciones necesarias para publicar una aplicación de **React con Vite** en **GitHub Pages**, tanto si es un **proyecto básico sin React Router** como si es un **proyecto multipágina con React Router**.

---

## 💡 Concepto Previo: ¿Por qué no basta con hacer `git push`?

Los navegadores y el servidor de GitHub Pages **no entienden archivos `.jsx`** ni pueden ejecutar directamente la carpeta `src/` o `node_modules/`.
- **Tus ramas de código (`main`, `react-router`, `github-pages`)**: Guardan el código fuente donde programas.
- **La rama `gh-pages` (automática)**: Guarda únicamente la carpeta **`dist/`** (tu proyecto ya compilado y transformado a HTML, CSS y JavaScript puro mediante `npm run build`). GitHub Pages leerá esta rama `gh-pages` para mostrar la web en internet.

---

## 🚀 Caso 1: Proyecto de React SIN React Router

Si tu proyecto de React solo tiene componentes dentro de `App.jsx` y **no utiliza `react-router`**, sigue estos **4 pasos**:

### Paso 1: Instalar el paquete `gh-pages`
Ejecuta en la terminal dentro de tu proyecto:

```bash
npm install -D gh-pages
```
*(Si aparece un aviso de dependencias `ERESOLVE`, añade `--legacy-peer-deps` al final: `npm install -D gh-pages --legacy-peer-deps`)*.

---

### Paso 2: Configurar `base` en [`vite.config.js`](./vite.config.js)
GitHub Pages no publica tu proyecto en la raíz del dominio (`https://usuario.github.io/`), sino dentro de una subcarpeta con el **nombre exacto de tu repositorio** (`https://usuario.github.io/nombre-de-tu-repo/`).

Abre [`vite.config.js`](./vite.config.js) y añade la propiedad `base` con el nombre de tu repositorio entre barras `/`:

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/react-class-crm/', // 👈 Pon aquí el nombre exacto de tu repositorio de GitHub
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

> [!WARNING]
> **¿Qué ocurre si olvidas poner `base`?**
> La página se quedará completamente en blanco en GitHub Pages porque el navegador intentará buscar los archivos JS y CSS en `https://usuario.github.io/assets/...` en lugar de `https://usuario.github.io/react-class-crm/assets/...`, dando error `404 (Not Found)`.

---

### Paso 3: Añadir los scripts `predeploy` y `deploy` en [`package.json`](./package.json)
Abre tu [`package.json`](./package.json) y dentro de `"scripts"` añade estas dos líneas:

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

- **`predeploy`**: Se ejecuta automáticamente justo antes de `deploy`. Compila el proyecto creando la carpeta `dist/`.
- **`deploy`**: Toma el contenido de la carpeta `dist/` y lo sube automáticamente a una rama llamada **`gh-pages`** en tu repositorio de GitHub.

---

### Paso 4: Publicar el proyecto
Ejecuta en la terminal:

```bash
npm run deploy
```
Cuando termine, verás el mensaje **`Published`** en la consola.

---

## 🧭 Caso 2: Proyecto de React CON React Router

Cuando tu proyecto utiliza **React Router** (`react-router`), además de todo lo anterior existen **dos problemas propios de GitHub Pages** que debemos resolver:

1. **Problema 1 (La subruta del repositorio)**: La URL en GitHub Pages empieza por `/react-class-crm/`, por lo que si tus rutas buscan `"/"`, React Router pensará que estás en una ruta desconocida y mostrará tu componente `<NotFound />` (`404`).
2. **Problema 2 (Recargar subrutas)**: Si navegas a `/react-class-crm/contacto` y recargas la página con `F5`, el servidor de GitHub Pages buscará un archivo físico llamado `contacto/index.html`, no lo encontrará y devolverá la pantalla de error 404 de GitHub.

### ¿Cómo configurarlo con React Router?

#### 1. Mantén `gh-pages` instalado y `base: '/react-class-crm/'` en [`vite.config.js`](./vite.config.js)
Exactamente igual que en el Caso 1 (Pasos 1 y 2).

#### 2. En [`package.json`](./package.json): Duplicar `index.html` a `404.html` en `predeploy`
Para solucionar el **Problema 2** (que no dé error al recargar una ruta como `/contacto` o `/tema/1`), modificamos el script `predeploy` para que copie el `index.html` compilado como `404.html` dentro de `dist/`:

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
> Así, cuando GitHub Pages no encuentre una ruta física al recargar, servirá `404.html` (que contiene tu aplicación de React) y React Router mostrará la página correcta.

#### 3. En [`src/router/index.jsx`](./src/router/index.jsx): Adaptar el Router para la subruta de GitHub Pages
Para solucionar el **Problema 1**, tienes **dos alternativas** según cómo quieras que se vean tus URLs:

##### Alternativa A: Usar `createHashRouter` (La más sencilla para GitHub Pages)
Cambias `createBrowserRouter` por **`createHashRouter`**:
```jsx
import { createHashRouter } from "react-router";
import Layout from "../Layout/Layout";
import Home from "../pages/Home/Home";
import Contact from "../pages/Contact/Contact";
import TopicsPage from "../pages/Topics/TopicsPage";
import NotFound from "../pages/NotFound/NotFound";

export const router = createHashRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            { path: "/", element: <Home/> },
            { path: "/contacto", element: <Contact/> },
            { path: "/tema/:id", element: <TopicsPage/> },
            { path: "*", element: <NotFound/> }
        ],
    },
])
```
- **Ventaja**: Añade un `#` a la URL (`https://usuario.github.io/react-class-crm/#/contacto`). Ignora automáticamente la subcarpeta `/react-class-crm/` y nunca falla al recargar en GitHub Pages.

##### Alternativa B: Mantener `createBrowserRouter`
Si prefieres URLs limpias sin `#` (`https://usuario.github.io/react-class-crm/contacto`), utiliza `createBrowserRouter` junto con el script `cp dist/index.html dist/404.html` del paso anterior.

#### 4. Publicar cambios
Cada vez que hagas cambios y quieras actualizar la web en GitHub Pages:
```bash
npm run deploy
```

---

## ⚙️ Configuración Final en la Web de GitHub (Para Ambos Casos)

Una vez ejecutado `npm run deploy` y aparezca `Published` en tu terminal:

1. Entra a tu repositorio en GitHub.
2. Haz clic en la pestaña **Settings** (arriba) → **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: Selecciona la rama **`gh-pages`** (¡ojo!, tiene que ser **`gh-pages`**, no `main` ni otra rama donde tengas el código fuente sin compilar) y la carpeta **`/ (root)`**.
4. Haz clic en **Save**.
5. Espera entre 30 y 60 segundos, y abre el enlace de tu web:
   `https://bc-contents.github.io/react-class-crm/`

---

## 📊 Resumen Comparativo: Sin React Router vs Con React Router

| Archivo / Paso | Proyecto SIN React Router | Proyecto CON React Router |
| :--- | :--- | :--- |
| **1. Paquete** | `npm install -D gh-pages` | `npm install -D gh-pages` |
| **2. [`vite.config.js`](./vite.config.js)** | `base: '/nombre-repo/'` | `base: '/nombre-repo/'` |
| **3. `predeploy` en [`package.json`](./package.json)** | `"npm run build"` | `"npm run build && cp dist/index.html dist/404.html"` |
| **4. `deploy` en [`package.json`](./package.json)** | `"gh-pages -d dist"` | `"gh-pages -d dist"` |
| **5. [`src/router/index.jsx`](./src/router/index.jsx)** | *(No aplica)* | Usar `createHashRouter` o `createBrowserRouter` |
| **6. GitHub Settings → Pages** | Rama **`gh-pages`** `/ (root)` | Rama **`gh-pages`** `/ (root)` |
