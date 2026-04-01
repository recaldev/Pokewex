import { useState, useEffect, useCallback } from 'react'
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  flattenEvolutionChain,
  getEnglishFlavorText,
} from '../api/pokeapi'
import '../styles/PokemonModal.css'

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function formatId(id) {
  return `#${String(id).padStart(4, '0')}`
}

function formatHeight(dm) {
  return `${(dm / 10).toFixed(1)} m`
}

function formatWeight(hg) {
  return `${(hg / 10).toFixed(1)} kg`
}

export default function PokemonModal({ pokemonId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [description, setDescription] = useState('')
  const [evolutions, setEvolutions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!pokemonId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setDetail(null)
      setDescription('')
      setEvolutions([])
      try {
        const d = await fetchPokemonDetail(pokemonId)
        if (cancelled) return
        setDetail(d)

        const species = await fetchPokemonSpecies(d.id)
        if (cancelled) return
        setDescription(getEnglishFlavorText(species))

        const evoData = await fetchEvolutionChain(species.evolution_chain.url)
        if (cancelled) return
        setEvolutions(flattenEvolutionChain(evoData.chain))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [pokemonId])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {loading && (
          <div className="modal-status">
            <div className="spinner" />
            <p>Loading...</p>
          </div>
        )}
        {error && (
          <div className="modal-status modal-error">
            <p>Error: {error}</p>
          </div>
        )}
        {!loading && !error && detail && (
          <div className="modal-content">
            <div className="modal-left">
              <div className="modal-image-wrap">
                <img
                  className="modal-image"
                  src={
                    detail.sprites?.other?.['official-artwork']?.front_default ||
                    detail.sprites?.front_default
                  }
                  alt={detail.name}
                />
              </div>
            </div>
            <div className="modal-right">
              <p className="modal-number">{formatId(detail.id)}</p>
              <h2 className="modal-name">{capitalize(detail.name)}</h2>

              <div className="modal-types">
                {detail.types.map(t => (
                  <span key={t.type.name} className={`type-badge type-${t.type.name}`}>
                    {capitalize(t.type.name)}
                  </span>
                ))}
              </div>

              <div className="modal-stats">
                <div className="stat-item">
                  <span className="stat-label">Height</span>
                  <span className="stat-value">{formatHeight(detail.height)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Weight</span>
                  <span className="stat-value">{formatWeight(detail.weight)}</span>
                </div>
              </div>

              <div className="modal-description">
                <h3 className="section-title">Description</h3>
                <p>{description}</p>
              </div>

              <div className="modal-evolutions">
                <h3 className="section-title">Evolutions</h3>
                {evolutions.length <= 1
                  ? <p className="no-evolutions">No evolutions</p>
                  : (
                    <div className="evolution-chain">
                      {evolutions.map((name, i) => (
                        <span key={name} className="evolution-item">
                          {i > 0 && <span className="evolution-arrow">→</span>}
                          <span className="evolution-name">{capitalize(name)}</span>
                        </span>
                      ))}
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
