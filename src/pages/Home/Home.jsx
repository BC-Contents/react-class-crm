import Card from "../../components/Card"
import Counter from "../../components/Counter"
import Timer from "../../components/Timer"
import { Link } from "react-router"

function Home() {
  return (
    <div>
        <section id="center">
            <Card/>
            <Counter/>
            <Timer/>
            {/* <Link to={`/tema/${id}`}>
                Tema 1
            </Link> */}
        </section>
    </div>
  )
}

export default Home