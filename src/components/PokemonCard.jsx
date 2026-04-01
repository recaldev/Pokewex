import '../styles/PokemonCard.css'

function formatId(id) {
  return `#${String(id).padStart(4, '0')}`
}

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function PokemonCard({ id, name, sprite, types, onClick }) {
  return (
    <div className="pokemon-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="card-image-wrap">
        {sprite
          ? <img className="card-image" src={sprite} alt={name} loading="lazy" />
          : <div className="card-image-placeholder" />
        }
      </div>
      <div className="card-info">
        <span className="card-number">{formatId(id)}</span>
        <span className="card-name">{capitalize(name)}</span>
        <div className="card-types">
          {types.map(type => (
            <span key={type} className={`type-badge type-${type}`}>
              {capitalize(type)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
