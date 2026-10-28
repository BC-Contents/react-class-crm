# Guía de React: `useState` y `useEffect`

Este proyecto está diseñado como material didáctico para aprender y dominar dos de los Hooks más importantes de React: **`useState`** (manejo de estado local) y **`useEffect`** (manejo de efectos secundarios y ciclo de vida del componente).

---

## 🔢 1. El Hook `useState` (`Counter.jsx`)

### ¿Qué es `useState`?
`useState` es un Hook de React que permite añadir **estado local** a un componente funcional. Cuando el estado cambia mediante su función actualizadora, React **vuelve a renderizar** el componente automáticamente para reflejar el nuevo valor en la pantalla.

### Sintaxis básica
```jsx
const [estado, setEstado] = useState(valorInicial)
```
- **`estado`**: El valor actual de la variable de estado.
- **`setEstado`**: La función encargada de actualizar ese valor y disparar el re-renderizado.
- **`valorInicial`**: El valor con el que arranca el estado en el primer renderizado.

### Implementación en [`src/components/Counter.jsx`](./src/components/Counter.jsx)

```jsx
import { useState } from "react"

function Counter() {
    const [count, setCount] = useState(0)

  return (
    <div>
        <h1>{count}</h1>
        <button onClick={() => setCount((c) => c - 1)}>-1</button>
        <button onClick={() => setCount(0)}>Reiniciar</button>
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}

export default Counter
```

### Puntos clave explicados:
1. **Inicialización (`useState(0)`)**: El contador empieza en `0`.
2. **Actualización con función callback (`setCount((c) => c + 1)`)**: En lugar de pasar `count + 1` directamente, pasamos una función `(c) => c + 1`. Esto es una **buena práctica en React** porque garantiza que siempre trabajamos con el valor más reciente del estado (`c`), evitando errores si ocurren múltiples actualizaciones seguidas.
3. **Actualización con valor directo (`setCount(0)`)**: En el botón "Reiniciar", como no dependemos del valor anterior sino que queremos fijarlo directamente a `0`, le pasamos `0` como argumento.

---

## ⏱️ 2. El Hook `useEffect` (`Timer.jsx`)

### ¿Qué es `useEffect`?
`useEffect` permite ejecutar **efectos secundarios** (*side effects*) en componentes funcionales, tales como temporizadores (`setInterval`, `setTimeout`), peticiones a APIs (`fetch`), o suscripciones a eventos del navegador.

Su estructura consta de tres partes fundamentales:
```jsx
useEffect(() => {
  // 1. Código del efecto (se ejecuta al montar o cuando cambia una dependencia)

  return () => {
    // 2. Función de limpieza / cleanup (se ejecuta antes de re-ejecutar el efecto o al desmontar el componente)
  }
}, [/* 3. Array de dependencias */])
```

---

### Evolución del componente `Timer`: De `[]` vacío a `[isActive]`

En clase construimos [`src/components/Timer.jsx`](./src/components/Timer.jsx) en **dos fases** para comprender cómo funciona el array de dependencias `[]`.

#### Fase 1: `useEffect` con el array de dependencias vacío `[]`

Primeramente creamos el temporizador dejando el array de dependencias vacío `[]`:

```jsx
import { useState, useEffect } from "react"

function Timer() {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSeconds((prev) => prev + 1)
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, []) // 👈 Array vacío: solo se ejecuta UNA vez al montar el componente

    return (
        <div>
            <h1>{seconds}</h1>
        </div>
    )
}
```

**¿Por qué funcionaba así?**
- **Con `[]` vacío**: Le indicamos a React que el efecto **no depende de ningún estado ni prop**, por lo que el `setInterval` se crea **únicamente una vez** cuando el componente aparece en pantalla (*mount*).
- **Uso de `(prev) => prev + 1`**: Como el efecto solo se ejecuta una vez al principio, usar la función actualizadora `(prev) => prev + 1` permite incrementar los segundos cada segundo sin necesitar incluir `seconds` dentro de `[]`.
- **Función de limpieza (`clearInterval`)**: Si el componente se elimina de la pantalla (*unmount*), React ejecuta el `return` para detener el intervalo y evitar fugas de memoria (*memory leaks*).

---

#### Fase 2: Añadiendo `[isActive]` al array de dependencias (Versión Final)

Después quisimos añadir un botón para **Pausar y Reanudar** el temporizador mediante un segundo estado: `const [isActive, setIsActive] = useState(true)`.

Si hubiéramos dejado `[]` vacío, el `useEffect` **nunca se enteraría** de que `isActive` cambió de `true` a `false` (o viceversa). Por ello, metimos `[isActive]` dentro de los corchetes:

```jsx
import { useState, useEffect } from "react"

function Timer() {
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        if (!isActive) return

        const intervalId = setInterval(() => {
            setSeconds((prev) => prev + 1)
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [isActive]) // 👈 Se vuelve a ejecutar cada vez que cambia 'isActive'

  return (
    <div>
        <h1>{seconds}</h1>
        <button onClick={() => setIsActive(!isActive)}>
            {isActive ? 'Pausar' : 'Reanudar'}
        </button>
        <button onClick={() => setSeconds(0)}>Reiniciar</button>
    </div>
  )
}

export default Timer
```

**¿Qué ocurre paso a paso cuando `isActive` está en `[isActive]`?**

1. **Al cargar la página (`isActive` es `true`)**:
   - Se ejecuta el `useEffect`. Como `isActive` es `true`, no entra en el `if (!isActive) return` y arranca el `setInterval` sumando 1 cada segundo.
2. **Al pulsar "Pausar" (`isActive` pasa a `false`)**:
   - React detecta que `isActive` ha cambiado.
   - **Primero** ejecuta la función de limpieza (`return () => clearInterval(intervalId)`) del efecto anterior, deteniendo el reloj inmediatamente.
   - **Segundo** vuelve a ejecutar el `useEffect` con el nuevo valor (`isActive = false`). Al llegar a `if (!isActive) return`, sale de la función sin crear ningún intervalo nuevo. El reloj queda pausado.
3. **Al pulsar "Reanudar" (`isActive` vuelve a `true`)**:
   - React detecta el cambio en `[isActive]` y vuelve a correr el `useEffect`, creando un nuevo `setInterval` que continúa sumando desde el segundo en que se había quedado.

### Resumen del Array de Dependencias en `useEffect`

| Configuración | Cuándo se ejecuta el efecto | Caso de uso típico |
| :--- | :--- | :--- |
| **Sin array** `useEffect(() => {})` | En el primer render y **después de cada renderizado**. | Rara vez usado (cuidado con bucles infinitos). |
| **Array vacío** `useEffect(() => {}, [])` | **Solo una vez**, cuando el componente se monta. | Cargar datos iniciales o iniciar un timer que no depende de estados externos (Fase 1). |
| **Con dependencias** `useEffect(() => {}, [isActive])` | Al montarse y **cada vez que `isActive` cambie de valor**. | Reaccionar a cambios de estado o props, como pausar/reanudar un timer (Fase 2). |

---

## 🚀 3. Integración en `App.jsx`

En [`src/App.jsx`](./src/App.jsx) se importan y muestran los componentes [`Counter`](./src/components/Counter.jsx) y [`Timer`](./src/components/Timer.jsx):

```jsx
import Card from './components/Card'
import Counter from './components/Counter'
import Timer from './components/Timer'
import './App.css'

function App() {

  return (
    <>
      <section className='bg-red-500' id="center">
        <Card/>
        <Counter/>
        <Timer/>
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
