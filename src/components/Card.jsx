
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
