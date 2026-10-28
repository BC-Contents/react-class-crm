import { useState, useEffect } from "react"

function Timer() {
    const [seconds, setSeconds]=useState(0)
    const [isActive, setIsActive] = useState(true)

    useEffect(()=>{
        if(!isActive) return

        const intervalId = setInterval(()=>{
            setSeconds((prev)=>prev +1)
        },1000)

        return ()=>{
            clearInterval(intervalId)
        }
    },[isActive])
  return (
    <div>
        <h1>{seconds}</h1>
        <button onClick={()=>setIsActive(!isActive)}>{isActive ? 'Pausar': 'Reanudar'}</button>
        <button onClick={()=> setSeconds(0)}>Reiniciar</button>
    </div>
  )
}

export default Timer