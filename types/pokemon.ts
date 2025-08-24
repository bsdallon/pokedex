export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  abilities: {
    ability: {
      name: string
    }
    is_hidden: boolean
  }[]
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: {
    slot: number
    type: {
      name: string
      url: string
    }
  }[]
  stats: {
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }[]
}
export interface PokemonSpecies {
  id: number
  name: string
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
    }
    version: {
      name: string
    }
  }[]
  genera: {
    genus: string
    language: {
      name: string
    }
  }[]
  evolution_chain: {
    url: string
  }
}
export interface EvolutionChain {
  id: number
  chain: EvolutionNode
}

export interface EvolutionNode {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionNode[]
}
export interface PokemonWithEvolution extends Pokemon {
  species?: PokemonSpecies
  evolutionChain?: {
    previous?: {
      id: number
      name: string
      image: string
    }
    current: {
      id: number
      name: string
      image: string
    }
    next?: {
      id: number
      name: string
      image: string
    }
  }
  category?: string
  description?: string
  weakness?: string[]
}
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: {
    name: string
    url: string
  }[]
}
