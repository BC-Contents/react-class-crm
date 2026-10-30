import { Outlet,Link } from "react-router"

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