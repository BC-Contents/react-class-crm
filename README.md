# Guía Paso a Paso: Navegación con React Router y `useParams`

Este proyecto está diseñado como material didáctico para aprender a configurar y utilizar **React Router**, creando una **SPA (Single Page Application)** con múltiples rutas, plantillas compartidas (`Layout`), rutas dinámicas con **`useParams`** y página de error 404 sin que el navegador recargue la página.

---

## 📁 Estructura de carpetas para el enrutado

```text
src/
├── Layout/
│   └── Layout.jsx          # Estructura común (Header, Outlet, Footer)
├── pages/
│   ├── Home/
│   │   └── Home.jsx        # Página principal ("/")
│   ├── Contact/
│   │   └── Contact.jsx     # Página de contacto ("/contacto")
│   ├── Topics/
│   │   └── TopicsPage.jsx  # Página dinámica por ID ("/tema/:id") usando useParams
│   └── NotFound/
│       └── NotFound.jsx    # Página de error 404 ("*")
├── router/
│   └── index.jsx           # Definición de rutas con createBrowserRouter
└── main.jsx                # Punto de entrada con <RouterProvider />
```

---

## 🛠️ Paso 1: Instalar React Router

Instalamos el paquete `react-router` en el proyecto:

```bash
npm install react-router
# o con pnpm:
pnpm add react-router
```

---

## 🧱 Paso 2: Crear el `Layout.jsx` (`<Link>` y `<Outlet />`)

El archivo [`src/Layout/Layout.jsx`](./src/Layout/Layout.jsx) define la plantilla fija que se mantiene visible en todas las pantallas (como la barra de navegación superior y el pie de página):

```jsx
import { Outlet, Link } from "react-router"

function Layout() {
  return (
    <div>
        <header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/contacto">Contact</Link>
                <Link to="/tema/1">Componentes tontos</Link>
                <Link to="/tema/2">Props and children</Link>
            </nav>
        </header>
        <main>
            <Outlet/>
        </main>
        <footer>
            <p>Todos derechos estan reservados en esta web</p>
        </footer>
    </div>
  )
}

export default Layout
```

### Conceptos clave en `Layout.jsx`:
- **`<Link to="...">`**: Sustituye a la etiqueta `<a href="...">` tradicional de HTML. Cambia la URL y renderiza la nueva vista instantáneamente **sin recargar la página**.
- **`<Outlet />`**: Es el "hueco" o marcador de posición dinámico donde React Router inyectará el componente de la página hija que coincida con la URL actual (`Home`, `Contact`, `TopicsPage` o `NotFound`).

---

## 📄 Paso 3: Crear las Páginas Estáticas (`Home`, `Contact`, `NotFound`)

### 1. Página de Inicio ([`src/pages/Home/Home.jsx`](./src/pages/Home/Home.jsx))
Es la vista que se carga en la ruta raíz `"/"`:

```jsx
import Card from "../../components/Card"
import Counter from "../../components/Counter"
import Timer from "../../components/Timer"

function Home() {
  return (
    <div>
        <section id="center">
            <Card/>
            <Counter/>
            <Timer/>
        </section>
    </div>
  )
}

export default Home
```

### 2. Página de Contacto ([`src/pages/Contact/Contact.jsx`](./src/pages/Contact/Contact.jsx))
Es la vista que se muestra al navegar a `"/contacto"`:

```jsx
function Contact() {
  return (
    <div>Contact</div>
  )
}

export default Contact
```

### 3. Página 404 No Encontrada ([`src/pages/NotFound/NotFound.jsx`](./src/pages/NotFound/NotFound.jsx))
Se muestra cuando el usuario intenta acceder a una URL que no existe:

```jsx
function NotFound() {
  return (
    <div>La página solicitada no existe</div>
  )
}

export default NotFound
```

---

## 🗺️ Paso 4: Configurar el Router (`src/router/index.jsx`)

En [`src/router/index.jsx`](./src/router/index.jsx) usamos `createBrowserRouter` para definir el árbol de rutas. Colocamos `Layout` como ruta padre (`path: "/"`) y todas las páginas dentro de su propiedad `children`:

```jsx
import { createBrowserRouter } from "react-router";
import Layout from "../Layout/Layout";
import Home from "../pages/Home/Home";
import Contact from "../pages/Contact/Contact";
import TopicsPage from "../pages/Topics/TopicsPage";
import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/contacto",
                element: <Contact/>
            },
            {
                path: "/tema/:id",
                element: <TopicsPage/>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ],
    },
])
```

### Resumen de tipos de rutas configuradas:
| Ruta (`path`) | Componente | Tipo de ruta | Explicación |
| :--- | :--- | :--- | :--- |
| `"/"` (padre) | `<Layout />` | **Ruta contenedora** | Envuelve a las rutas hijas con el `<header>` y `<footer>`, renderizando cada hija dentro de `<Outlet />`. |
| `"/"` (hija) | `<Home />` | **Ruta estática raíz** | Se muestra al entrar a la página de inicio. |
| `"/contacto"` | `<Contact />` | **Ruta estática** | Se muestra al navegar a `/contacto`. |
| `"/tema/:id"` | `<TopicsPage />` | **Ruta dinámica** | `:id` es un segmento dinámico cuyo valor leemos con `useParams()`. |
| `"*"` | `<NotFound />` | **Ruta comodín (404)** | Captura cualquier URL que no coincida con ninguna de las rutas anteriores. |

---

## 🔍 Paso 5: El Hook `useParams` y Rutas Dinámicas (`TopicsPage.jsx`)

### ¿Qué es `useParams` y para qué sirve?
En una aplicación real no creamos un archivo `.jsx` distinto para cada producto, usuario o tema (`/tema/1`, `/tema/2`, `/tema/3`...). En su lugar, creamos **una única plantilla de página** ([`TopicsPage.jsx`](./src/pages/Topics/TopicsPage.jsx)) y una **ruta dinámica** (`/tema/:id`).

**`useParams`** es un Hook de React Router que nos permite **leer los parámetros dinámicos de la URL actual** desde dentro del componente, devolviendo un objeto clave-valor con los segmentos que llevan dos puntos (`:`) en el `path`.

---

### ¿Cómo se conecta todo el flujo de `useParams`?

El funcionamiento de `useParams` se divide en **3 piezas conectadas**:

#### 1️⃣ En el Router ([`src/router/index.jsx`](./src/router/index.jsx)): Definimos el nombre del parámetro con `:id`
```jsx
{
    path: "/tema/:id", // 👈 Los dos puntos (:) indican que "id" es una variable dinámica
    element: <TopicsPage/>
}
```
> El nombre que pongas después de `:` (en este caso `id`) será exactamente el nombre de la propiedad que devolverá `useParams()`.

#### 2️⃣ En la Navegación ([`src/Layout/Layout.jsx`](./src/Layout/Layout.jsx)): Enviamos el valor en la URL
```jsx
<Link to="/tema/1">Componentes tontos</Link>
<Link to="/tema/2">Props and children</Link>
```
- Al hacer clic en el primer enlace, la URL pasa a ser `/tema/1` (`id` vale `"1"`).
- Al hacer clic en el segundo enlace, la URL pasa a ser `/tema/2` (`id` vale `"2"`).

#### 3️⃣ En el Componente ([`src/pages/Topics/TopicsPage.jsx`](./src/pages/Topics/TopicsPage.jsx)): Capturamos el valor con `useParams()`

```jsx
import { useParams } from "react-router"

const topics = [
  {
    id: 1,
    title: 'Componentes Tontos',
    description: 'Funciones puras que reciben props y solo devuelven JSX visual sin lógica interna.',
    tag: 'Básico',
    tagColor: 'purple',
  },
  {
    id: 2,
    title: 'Props & Children',
    description: 'Parámetros e inyección de contenido que permiten reutilizar Card en múltiples casos.',
    tag: 'Fundamental',
    tagColor: 'blue',
  },
  {
    id: 3,
    title: 'Tailwind Tokens',
    description: 'Uso de @theme para definir bg-surface y bg-canvas evitando magic numbers [#...].',
    tag: 'Estilos',
    tagColor: 'cyan',
  },
]

function TopicsPage() {
    // 1. Extraemos el parámetro "id" de la URL (ej: si la URL es /tema/1, id = "1")
    const { id } = useParams()

    // 2. Buscamos en el array el objeto cuyo id coincida (convirtiendo id a número)
    const topic = topics.find((item) => item.id === Number(id))

  return (
    <section>
        <span>{topic.id}</span>
        <h2>{topic.title}</h2>
        <p>{topic.description}</p>
    </section>
  )
}

export default TopicsPage
```

---

### Detalles clave a tener en cuenta con `useParams`:

1. **Desestructuración directa (`const { id } = useParams()`)**:
   - `useParams()` devuelve un objeto. Si la URL es `/tema/2`, devuelve `{ id: "2" }`.
   - Al hacer `const { id } = useParams()`, extraemos directamente la variable `id`.
2. **¡Los parámetros de la URL siempre son `string` (texto)!**:
   - Aunque en la URL veamos un número (`/tema/1`), `useParams()` siempre entrega `"1"` como cadena de texto (`string`).
   - En nuestro array `topics`, la propiedad `id` es un número (`id: 1`).
   - Si comparásemos `item.id === id` con triple igual (`===`), daría `false` porque `1 === "1"` son de distinto tipo.
   - Por eso utilizamos **`Number(id)`** dentro de `topics.find((item) => item.id === Number(id))` para transformarlo a número antes de comparar.

---

## 🚀 Paso 6: Proveer el Router en `src/main.jsx`

Finalmente, en [`src/main.jsx`](./src/main.jsx) importamos `RouterProvider` de `react-router` y nuestro `router`, reemplazando `<App />` por `<RouterProvider router={router} />`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { router } from './router/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
```

---

## 🏃‍♂️ Cómo ejecutar el proyecto localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   # o con pnpm:
   pnpm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   # o con pnpm:
   pnpm run dev
   ```

3. **Abrir en el navegador:**  
   Visita [http://localhost:5173](http://localhost:5173).
