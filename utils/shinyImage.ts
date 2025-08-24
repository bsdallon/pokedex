import type { Pokemon } from '~/schemas/pokemon'

export function getPokemonShinyImage(pokemon: Pokemon): string | undefined {
  if (!pokemon?.sprites) return undefined
  const official = pokemon.sprites.other?.['official-artwork']?.front_shiny
  if (official) return official
  return pokemon.sprites.front_shiny || undefined
}
