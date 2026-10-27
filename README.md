# Guía de React + Tailwind CSS

Este proyecto está diseñado como material didáctico para aprender a **utilizar y estructurar Tailwind CSS dentro de React**, analizando cómo aplicar clases de utilidad, estados interactivos y diseño moderno directamente en componentes.

---

## 🛠️ Paso 1: Configurar Tailwind CSS v4 con Vite

En este proyecto utilizamos la integración oficial de Tailwind CSS v4 con Vite:

### 1. Instalación de dependencias

```bash
npm install tailwindcss @tailwindcss/vite
```
*(o con pnpm: `pnpm add -D tailwindcss @tailwindcss/vite`)*

### 2. Configuración en [`vite.config.js`](./vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

> [!IMPORTANT]
> ### ⚠️ Anotación: Si el proyecto no funciona, quita la línea de Babel
> Si el proyecto da error al arrancar o compilar por plugins experimentales o incompatibilidad de Babel, abre [`vite.config.js`](./vite.config.js) y **quita la línea de Babel**:
>
> ```javascript
> // ❌ Quitar esta línea dentro de plugins:
> babel({ presets: [reactCompilerPreset()] })
> ```
>
> y elimina también la importación de Babel arriba:
> ```javascript
> // ❌ Quitar este import si ya no se utiliza:
> import babel from '@rolldown/plugin-babel'
> ```
> Con eso el archivo debe quedar únicamente con los plugins `react()` y `tailwindcss()`.

### 3. Importación en [`src/index.css`](./src/index.css)

Tailwind CSS v4 solo requiere una línea en el archivo de estilos global:

```css
@import "tailwindcss";
```

---

## 🧱 Paso 2: El Componente `Card.jsx`

En este proyecto tenemos un único componente ubicado en [`src/components/Card.jsx`](./src/components/Card.jsx):

```jsx
function Card() {
  return (
    <article className="bg-[#1c1d24] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:-translate-y-1 shadow-lg">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-xl font-semibold text-white">
            Aprende React
          </h3>
          <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-300">
            Frontend
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Descubre cómo crear interfaces modernas y reutilizables con
          componentes de React.
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-end">
        <button
          type="button"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-purple-400 hover:text-purple-300"
        >
          Ver más
        </button>
      </div>
    </article>
  )
}

export default Card
```

### Desglose de Clases de Tailwind CSS utilizadas:

| Elemento | Clases de Tailwind | Explicación |
| :--- | :--- | :--- |
| **Contenedor (`<article>`)** | `bg-[#1c1d24]` | Color de fondo personalizado en formato hexadecimal. |
| | `border border-white/10` | Borde sutil con color blanco al 10% de opacidad. |
| | `rounded-2xl` | Bordes redondeados pronunciados. |
| | `p-6` | Relleno interno (*padding*) en todos los lados. |
| | `flex flex-col justify-between` | Disposición en columna distribuyendo el espacio vertical. |
| | `hover:border-purple-500/40` | Al pasar el cursor, el borde cambia a morado translúcido. |
| | `transition-all` | Suaviza cualquier cambio de estado (hover, movimiento). |
| | `hover:-translate-y-1` | Micro-animación que eleva la tarjeta hacia arriba al hacer hover. |
| | `shadow-lg` | Sombra exterior para dar sensación de elevación. |
| **Cabecera (`<div>`)** | `flex items-center justify-between gap-3 mb-4` | Alinea el título y la etiqueta en extremos opuestos con separación y margen inferior. |
| **Título (`<h3>`)** | `text-xl font-semibold text-white` | Tamaño grande, peso seminegrita y color de texto blanco. |
| **Etiqueta (`<span>`)** | `rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-300` | Forma de píldora con fondo morado suave, texto pequeño y padding ajustado. |
| **Descripción (`<p>`)** | `text-gray-400 text-sm leading-relaxed mb-6` | Color gris legible, tamaño reducido, interlineado cómodo y margen inferior. |
| **Separador (`<div>`)** | `pt-4 border-t border-white/5 flex justify-end` | Línea divisoria superior casi invisible, con el botón alineado a la derecha. |
| **Botón (`<button>`)** | `rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-purple-400 hover:text-purple-300` | Botón delineado interactivo con efectos de hover en color morado. |

---

## 🚀 Paso 3: Uso del Componente en `App.jsx`

En [`src/App.jsx`](./src/App.jsx) se importa y renderiza el componente `Card`:

```jsx
import Card from './components/Card'
import './App.css'

function App() {

  return (
    <>
      <section className='bg-red-500' id="center">
        <Card/>
      </section>
    </>
  )
}

export default App
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

> [!WARNING]
> **Recordatorio:** Si el comando `dev` falla con un error relacionado con Babel, abre [`vite.config.js`](./vite.config.js) y elimina la línea de `babel(...)` y su `import`.
