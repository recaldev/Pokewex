const BASE = 'https://pokeapi.co/api/v2'

async function apiFetch(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PokeAPI error ${res.status}: ${url}`)
  return res.json()
}

export async function fetchPokemonList(limit, offset) {
  const data = await apiFetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`)
  return { results: data.results, count: data.count }
}

export async function fetchPokemonDetail(idOrName) {
  return apiFetch(`${BASE}/pokemon/${idOrName}`)
}

export async function fetchPokemonSpecies(id) {
  return apiFetch(`${BASE}/pokemon-species/${id}`)
}

export async function fetchEvolutionChain(url) {
  return apiFetch(url)
}

export async function enrichPokemonList(list) {
  const details = await Promise.all(list.map(p => fetchPokemonDetail(p.name)))
  return details.map(d => ({
    id: d.id,
    name: d.name,
    sprite:
      d.sprites?.other?.['official-artwork']?.front_default ||
      d.sprites?.front_default,
    types: d.types.map(t => t.type.name),
  }))
}

export function flattenEvolutionChain(chain) {
  const result = []
  let current = chain
  while (current) {
    result.push(current.species.name)
    current = current.evolves_to?.[0] ?? null
  }
  return result
}

export function getEnglishFlavorText(speciesData) {
  const entry = speciesData.flavor_text_entries?.find(
    e => e.language.name === 'en'
  )
  return entry
    ? entry.flavor_text.replace(/\f|\n/g, ' ').trim()
    : 'No description available.'
}
