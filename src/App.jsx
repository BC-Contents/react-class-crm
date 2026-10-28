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
