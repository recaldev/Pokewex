import PokemonCard from './PokemonCard'
import '../styles/PokemonGrid.css'

export default function PokemonGrid({
  pokemonList, loading, error,
  onCardClick, offset, totalCount, onPrev, onNext, pageSize
}) {
  const currentPage = Math.floor(offset / pageSize) + 1
  const totalPages = Math.ceil(totalCount / pageSize)
  const hasPrev = offset > 0
  const hasNext = offset + pageSize < totalCount

  return (
    <section className="grid-section">
      {loading && (
        <div className="grid-status">
          <div className="spinner" />
          <p>Loading Pokémon...</p>
        </div>
      )}
      {error && (
        <div className="grid-status grid-error">
          <p>Something went wrong: {error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="pokemon-grid">
          {pokemonList.map(p => (
            <PokemonCard
              key={p.id}
              id={p.id}
              name={p.name}
              sprite={p.sprite}
              types={p.types}
              onClick={() => onCardClick(p.id)}
            />
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={onPrev}
          disabled={!hasPrev || loading}
        >
          ← Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={onNext}
          disabled={!hasNext || loading}
        >
          Next →
        </button>
      </div>
    </section>
  )
}
