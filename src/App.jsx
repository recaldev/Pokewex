import { useState, useEffect } from 'react'
import PokemonGrid from './components/PokemonGrid'
import PokemonModal from './components/PokemonModal'
import Header from './components/Header'
import { fetchPokemonList, enrichPokemonList } from './api/pokeapi'
import './index.css'

const PAGE_SIZE = 20

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPokemonId, setSelectedPokemonId] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { results, count } = await fetchPokemonList(PAGE_SIZE, offset)
        const enriched = await enrichPokemonList(results)
        if (!cancelled) {
          setPokemonList(enriched)
          setTotalCount(count)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [offset])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <PokemonGrid
          pokemonList={pokemonList}
          loading={loading}
          error={error}
          onCardClick={setSelectedPokemonId}
          offset={offset}
          totalCount={totalCount}
          onPrev={() => setOffset(o => Math.max(0, o - PAGE_SIZE))}
          onNext={() => setOffset(o => o + PAGE_SIZE)}
          pageSize={PAGE_SIZE}
        />
      </main>
      {selectedPokemonId && (
        <PokemonModal
          pokemonId={selectedPokemonId}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}
    </div>
  )
}

export default App
