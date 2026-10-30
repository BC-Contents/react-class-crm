import { useParams,Link } from "react-router"


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
    const {id} = useParams()

    const topic = topics.find((item)=>item.id === Number(id))
  return (
    <section>
        <span>{topic.id}</span>
        <h2>{topic.title}</h2>
        <p>{topic.description}</p>
    </section>
  )
}

export default TopicsPage