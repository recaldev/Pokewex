# Pokédex

A Pokédex web app built with React + Vite, consuming [PokeAPI v2](https://pokeapi.co/api/v2/).

## Features

- Browse Pokémon with pagination (20 per page)
- Each card shows: image, number, name, and type badges with colors
- Click a Pokémon to open a detail modal with:
  - Official artwork, number, name, types
  - Height and weight
  - Pokédex description
  - Evolution chain
- Visual style inspired by the official Pokémon Pokédex
- Loading and error states

## Run locally

```bash
git clone https://github.com/recaldev/pokewex.git
cd pokewex
npm install
npm run dev
```

Then open http://localhost:5173

## Tech stack

- React 19 + Vite 8
- Plain CSS (no UI framework)
- PokeAPI v2 (no backend, no auth)
