<!--/pokemon/[id]-->
<template>
  <div
    :class="['pokemon-detail-container', { 'no-bg': !isLoading && !pokemon }]"
    :style="{ '--type-color': typeColor }"
  >
    <div v-if="isLoading">
      <LoadingPokeballs />
    </div>

    <ErrorBoundary>
      <div v-if="pokemon">
        <div class="pokemon-detail-header">
          <div class="pokemon-navigation">
            <button
              v-if="pokemon.id > 1"
              class="nav-circle-chevron"
              @click="navigateToPokemon(pokemon.id - 1)"
              :disabled="pokemon.id === 1"
              aria-label="Previous Pokémon"
            >
              <svg
                class="circle-chevron-svg"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="30" fill="#f7f7fa" />
                <polyline
                  points="40,16 24,32 40,48"
                  stroke="#0d47a1"
                  stroke-width="6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </div>

          <div class="pokemon-title-center">
            <h1>
              {{ formatName(pokemon.name) }}
              <span class="pokemon-id">#{{ String(pokemon.id).padStart(4, '0') }}</span>
            </h1>
          </div>

          <div class="pokemon-navigation">
            <button
              v-if="pokemon.id < 1025"
              class="nav-circle-chevron"
              @click="navigateToPokemon(pokemon.id + 1)"
              aria-label="Next Pokémon"
            >
              <svg
                class="circle-chevron-svg"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="30" fill="#f7f7fa" />
                <polyline
                  points="24,16 40,32 24,48"
                  stroke="#0d47a1"
                  stroke-width="6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="pokemon-detail-content">
          <div class="pokemon-image-container">
            <!-- Type SVG background -->
            <img
              v-if="typeSvgPath"
              class="pokemon-type-bg"
              :src="typeSvgPath"
              :alt="getPrimaryType + ' type background'"
              draggable="false"
              aria-hidden="true"
            />
            <div class="pokemon-main-image">
              <img
                :src="
                  pokemon.sprites.other['official-artwork'].front_default ||
                  pokemon.sprites.front_default
                "
                :alt="pokemon.name"
              />
            </div>
          </div>

          <div class="pokemon-info-container">
            <div class="pokemon-description" v-if="pokemon.description">
              <p>{{ pokemon.description }}</p>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Height</span>
                <span class="info-value">{{ formatHeight(pokemon.height) }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Category</span>
                <span class="info-value">{{ pokemon.category || 'Unknown' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Weight</span>
                <span class="info-value">{{ formatWeight(pokemon.weight) }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Abilities</span>
                <span class="info-value">{{ formatAbilities(pokemon.abilities) }}</span>
              </div>
            </div>

            <div>
              <h3>Type</h3>
              <div class="pokemon-type-badges">
                <div
                  v-for="type in pokemon.types"
                  :key="type.slot"
                  :class="['type-badge', type.type.name.toLowerCase()]"
                >
                  {{ type.type.name }}
                </div>
              </div>
            </div>

            <div class="pokemon-weaknesses" v-if="pokemon.weakness && pokemon.weakness.length > 0">
              <h3>Weaknesses</h3>
              <div class="weakness-badges">
                <div
                  v-for="weakness in pokemon.weakness"
                  :key="weakness"
                  :class="['type-badge', weakness.toLowerCase()]"
                >
                  {{ weakness }}
                </div>
              </div>
            </div>

            <div class="stats-container">
              <h3>Stats</h3>
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat">
                <div class="stat-label">
                  <span>{{ formatStatName(stat.stat.name) }}</span>
                  <span>{{ stat.base_stat }}</span>
                </div>
                <div class="stat-bar-container">
                  <div
                    :class="['stat-bar', `type-${getPrimaryType}`]"
                    :style="{ width: `${Math.min(stat.base_stat / 2, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div
              class="evolution-chain"
              v-if="evolutionChainComplete && evolutionChainComplete.length > 1"
            >
              <h3>Evolutions</h3>
              <div class="evolution-chain-container">
                <template v-for="(evo, index) in evolutionChainComplete" :key="evo.id">
                  <div class="evolution-item" @click="navigateToPokemon(evo.id)">
                    <img :src="evo.image" :alt="evo.name" />
                    <div class="evolution-name">{{ formatName(evo.name) }}</div>
                  </div>

                  <div v-if="index < evolutionChainComplete.length - 1" class="evolution-arrow">
                    →
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #fallback="{ error, retry }">
        <div class="error-message">
          <img
            src="~/assets/images/pokemon_not_found.png"
            alt="Pokemon not found"
            class="error-message__image"
          />
          <h3>Oh no! We could not find that Pokémon!</h3>
          <p>{{ error?.message }}</p>
          <button @click="router.push('/')" class="error-message__button">Go Back</button>
        </div>
      </template>
    </ErrorBoundary>

    <div v-if="!isLoading && !pokemon" class="error-message error-message--centered">
      <img
        src="~/assets/images/pokemon_not_found.png"
        alt="Pokemon not found"
        class="error-message__image error-message__image--small"
      />
      <h3>Oh no! We could not find that Pokémon!</h3>
      <div class="error-message__button-group">
        <button @click="router.push('/')" class="error-message__button">Go Back</button>
        <button
          @click="router.go(0)"
          class="error-message__button error-message__button--secondary"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const typeToSvg = {
    bug: '/assets/images/type_bug.svg',
    dark: '/assets/images/type_dark.svg',
    dragon: '/assets/images/type_dragon.svg',
    electric: '/assets/images/type_electric.svg',
    fairy: '/assets/images/type_fairy.svg',
    fighting: '/assets/images/type_fighting.svg',
    fire: '/assets/images/type_fire.svg',
    flying: '/assets/images/type_flying.svg',
    ghost: '/assets/images/type_ghost.svg',
    grass: '/assets/images/type_grass.svg',
    ground: '/assets/images/type_ground.svg',
    ice: '/assets/images/type_ice.svg',
    normal: '/assets/images/type_normal.svg',
    poison: '/assets/images/type_poison.svg',
    psychic: '/assets/images/type_psychic.svg',
    rock: '/assets/images/type_rock.svg',
    steel: '/assets/images/type_steel.svg',
    water: '/assets/images/type_water.svg',
  }

  const typeToColor = {
    bug: '#a8b820',
    dark: '#705848',
    dragon: '#7038f8',
    electric: '#ffe066',
    fairy: '#ee99ac',
    fighting: '#c03028',
    fire: '#f08030',
    flying: '#a890f0',
    ghost: '#705898',
    grass: '#78c850',
    ground: '#e0c068',
    ice: '#98d8d8',
    normal: '#a8a878',
    poison: '#a040a0',
    psychic: '#f85888',
    rock: '#b8a038',
    steel: '#b8b8d0',
    water: '#6890f0',
  }

  const typeSvgPath = computed(() => {
    const type = getPrimaryType.value as keyof typeof typeToSvg
    return typeToSvg[type] || ''
  })

  const typeColor = computed(() => {
    const type = getPrimaryType.value as keyof typeof typeToColor
    return typeToColor[type] || '#ffe066'
  })
  import { useRouter, useRoute } from 'vue-router'
  import type {
    Pokemon,
    PokemonSpecies,
    EvolutionChain,
    EvolutionNode,
    PokemonWithEvolution,
  } from '~/types/pokemon'
  import ErrorBoundary from '~/components/ErrorBoundary.vue'

  const emit = defineEmits(['loading-start', 'loading-end'])
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()

  const pokemon = ref<PokemonWithEvolution | null>(null)
  const isLoading = ref(true)
  const evolutionChainComplete = ref<{ id: number; name: string; image: string }[]>([])

  const formatName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const formatAbilities = (abilities: Pokemon['abilities']): string => {
    return abilities.map((a) => formatName(a.ability.name)).join(', ')
  }

  const formatHeight = (height: number): string => {
    const heightInMeters = height / 10
    const feet = Math.floor(heightInMeters * 3.28084)
    const inches = Math.round((heightInMeters * 3.28084 - feet) * 12)
    return `${heightInMeters.toFixed(1)}m (${feet}'${inches}")`
  }

  const formatWeight = (weight: number): string => {
    const weightInKg = weight / 10
    const weightInLbs = weightInKg * 2.20462
    return `${weightInKg.toFixed(1)} kg (${weightInLbs.toFixed(1)} lbs)`
  }

  const formatStatName = (statName: string): string => {
    const statNameMap: Record<string, string> = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      speed: 'Speed',
    }

    return statNameMap[statName] || formatName(statName)
  }

  const getPrimaryType = computed(() => {
    try {
      if (pokemon.value?.types?.[0]?.type?.name) {
        return pokemon.value.types[0].type.name.toLowerCase()
      }
    } catch (e) {
      console.error('Error getting primary type:', e)
    }
    return 'normal'
  })

  const navigateToPokemon = (id: number) => {
    if (id > 0) {
      router.push(`/pokemon/${id}`)
    }
  }

  const getWeaknesses = (types: Pokemon['types']) => {
    const typeChart: Record<string, { weakTo: string[] }> = {
      normal: { weakTo: ['fighting'] },
      fire: { weakTo: ['water', 'ground', 'rock'] },
      water: { weakTo: ['electric', 'grass'] },
      electric: { weakTo: ['ground'] },
      grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'] },
      ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'] },
      fighting: { weakTo: ['flying', 'psychic', 'fairy'] },
      poison: { weakTo: ['ground', 'psychic'] },
      ground: { weakTo: ['water', 'grass', 'ice'] },
      flying: { weakTo: ['electric', 'ice', 'rock'] },
      psychic: { weakTo: ['bug', 'ghost', 'dark'] },
      bug: { weakTo: ['fire', 'flying', 'rock'] },
      rock: { weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'] },
      ghost: { weakTo: ['ghost', 'dark'] },
      dragon: { weakTo: ['ice', 'dragon', 'fairy'] },
      dark: { weakTo: ['fighting', 'bug', 'fairy'] },
      steel: { weakTo: ['fire', 'fighting', 'ground'] },
      fairy: { weakTo: ['poison', 'steel'] },
    }

    const weaknesses = new Set<string>()

    types.forEach((typeObj) => {
      const typeName = typeObj.type.name
      if (typeChart[typeName]) {
        typeChart[typeName].weakTo.forEach((weakness) => {
          weaknesses.add(weakness)
        })
      }
    })

    return Array.from(weaknesses)
  }

  const processEvolutionChain = async (
    chain: EvolutionNode
  ): Promise<{ id: number; name: string; image: string }[]> => {
    const result: { id: number; name: string; image: string }[] = []

    const processNode = async (node: EvolutionNode) => {
      const id = Number(node.species.url.split('/').filter(Boolean).pop())

      try {
        const pokemonData = await $fetch<Pokemon>(`${config.public.apiBase}/pokemon/${id}`)
        const image =
          pokemonData.sprites.other['official-artwork'].front_default ||
          pokemonData.sprites.front_default

        result.push({
          id,
          name: node.species.name,
          image,
        })
      } catch (error) {
        console.error(`Failed to fetch Pokemon data for evolution ${node.species.name}:`, error)
      }

      for (const evoNode of node.evolves_to) {
        await processNode(evoNode)
      }
    }

    await processNode(chain)
    return result
  }

  const findAdjacentEvolutions = (
    evolutions: { id: number; name: string; image: string }[],
    currentId: number
  ) => {
    const currentIndex = evolutions.findIndex((evo) => evo.id === currentId)

    if (currentIndex === -1) {
      const current = evolutions[0] || { id: currentId, name: 'unknown', image: '' }
      return { previous: undefined, current, next: undefined }
    }

    return {
      previous: currentIndex > 0 ? evolutions[currentIndex - 1] : undefined,
      current: evolutions[currentIndex],
      next: currentIndex < evolutions.length - 1 ? evolutions[currentIndex + 1] : undefined,
    }
  }

  const fetchPokemonData = async (pokemonId: string | number) => {
    isLoading.value = true
    emit('loading-start')

    try {
      const pokemonData = await $fetch<Pokemon>(`${config.public.apiBase}/pokemon/${pokemonId}`)
      const speciesData = await $fetch<PokemonSpecies>(
        `${config.public.apiBase}/pokemon-species/${pokemonId}`
      )

      const descriptionEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      )
      const description = descriptionEntry
        ? descriptionEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
        : 'No description available'

      const genusEntry = speciesData.genera.find((g) => g.language.name === 'en')
      const category = genusEntry ? genusEntry.genus.replace(' Pokémon', '') : 'Unknown'

      const evolutionChainId = speciesData.evolution_chain.url.split('/').filter(Boolean).pop()
      const evolutionData = await $fetch<EvolutionChain>(
        `${config.public.apiBase}/evolution-chain/${evolutionChainId}`
      )
      const evolutions = await processEvolutionChain(evolutionData.chain)
      evolutionChainComplete.value = evolutions

      const adjacentEvolutions = findAdjacentEvolutions(evolutions, pokemonData.id)
      const weaknesses = getWeaknesses(pokemonData.types)

      pokemon.value = {
        ...pokemonData,
        species: speciesData,
        description,
        category,
        weakness: weaknesses,
        evolutionChain: {
          previous: adjacentEvolutions.previous,
          current: adjacentEvolutions.current || {
            id: pokemonData.id,
            name: pokemonData.name,
            image:
              pokemonData.sprites.other['official-artwork'].front_default ||
              pokemonData.sprites.front_default,
          },
          next: adjacentEvolutions.next,
        },
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error)
      pokemon.value = null
    } finally {
      isLoading.value = false
      emit('loading-end')
    }
  }

  watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        fetchPokemonData(newId.toString())
      }
    }
  )

  onMounted(() => {
    if (route.params.id) {
      fetchPokemonData(route.params.id.toString())
    }
  })
</script>

<style scoped>
  .error-message--centered {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
    margin-top: 0;
  }
  .error-message__image--small {
    max-width: 220px;
    width: 100%;
    margin: 0 auto 1.5rem auto;
    display: block;
  }
  .error-message__button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }
  .error-message__button {
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.45em 0;
    font-size: 1.08rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    outline: none;
    width: 170px;
    height: 38px;
    text-align: center;
    display: inline-block;
  }
  .error-message__button:hover {
    background: #0d47a1;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
  }
  .error-message__button--secondary {
    background: #e53935;
    color: #fff;
    border: 2px solid #b71c1c;
  }
  .error-message__button--secondary:hover {
    background: #b71c1c;
    color: #fff;
    border-color: #b71c1c;
  }
  .pokemon-detail-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: flex-start;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .pokemon-title-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: max-content;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: 1;
  }

  .pokemon-detail-header {
    position: relative;
  }
  .nav-circle-chevron {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: none;
    border: none;
    padding: 0;
    margin: 0 16px;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Removed shadow */
    box-shadow: none;
    transition: transform 0.18s;
    position: relative;
    top: -12px;
  }
  .nav-circle-chevron:disabled {
    opacity: 0.3;
    cursor: default;
    pointer-events: none;
  }
  .nav-circle-chevron:hover:not(:disabled) {
    /* No shadow on hover */
    transform: scale(1.08);
  }
  .nav-circle-chevron:hover .circle-chevron-svg polyline {
    stroke: #ffd600 !important;
  }
  .circle-chevron-svg {
    width: 64px;
    height: 64px;
    display: block;
    border-radius: 50%;
    margin: auto;
    .error-message--centered {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }
    box-shadow: none;
  }
  .pokemon-detail-container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 30px 20px;
    min-height: 95vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      135deg,
      #fff 54%,
      color-mix(in srgb, var(--type-color) 70%, white 30%) 54%,
      color-mix(in srgb, var(--type-color) 70%, white 30%) 100%
    );
    position: relative;
    overflow: hidden;
  }
  .pokemon-detail-container.no-bg {
    background: #fff !important;
  }

  .pokemon-type-bg {
    position: absolute;
    left: 30%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 420px;
    height: 420px;
    opacity: 1;
    z-index: 1;
    pointer-events: none;
    filter: drop-shadow(0 4px 32px rgba(0, 0, 0, 0.18));
  }

  @media (max-width: 600px) {
    .pokemon-type-bg {
      width: 220px;
      height: 220px;
    }
  }

  .pokemon-detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .pokemon-detail-header h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin: 0 0 0.2em 0;
    line-height: 1.1;
  }

  .pokemon-navigation {
    display: flex;
    align-items: center;
  }

  .nav-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .pokemon-id {
    color: #666;
    margin-right: 10px;
  }

  .pokemon-detail-content {
    display: grid;
    grid-template-columns: minmax(500px, 1.3fr) 1fr;
    gap: 40px;
    align-items: center;
    min-height: 600px;
    margin-top: 20px;
  }

  .pokemon-image-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
    width: 100%;
    margin: 0 auto;
    overflow: visible;
    flex-direction: column;
    z-index: 2;
  }

  .pokemon-type-bg {
    position: absolute;
    left: 60%;
    top: 8%;
    transform: translate(-50%, -50%) scale(1.1);
    width: 280px;
    height: 280px;
    opacity: 0.7;
    z-index: 1;
    pointer-events: none;
    filter: none;
  }

  .pokemon-main-image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: auto;
  }

  .pokemon-main-image img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    margin: 0 auto;
    width: auto;
    height: auto;
    max-height: 450px;
    transform: scale(1.2);
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
    padding: 10px;
    position: relative;
    z-index: 3;
  }

  .pokemon-info-container {
    background-color: #f2f2f2;
    border-radius: 10px;
    padding: 20px;
    align-self: start;
  }

  .pokemon-description {
    margin-bottom: 20px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
  }

  .info-label {
    font-weight: bold;
    font-size: 14px;
    color: #666;
  }

  .info-value {
    font-size: 16px;
  }

  .pokemon-type-badges {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .type-badge {
    padding: 5px 15px;
    border-radius: 20px;
    color: white;
    font-size: 14px;
    text-transform: capitalize;
  }

  .pokemon-weaknesses {
    margin-top: 20px;
  }

  .weakness-badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .stats-container {
    margin-top: 30px;
  }

  .stat-bar-container {
    height: 15px;
    background-color: #ddd;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .stat-bar {
    height: 100%;
    border-radius: 10px;
  }

  .stat-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .evolution-chain {
    margin-top: 40px;
  }

  .evolution-chain-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 20px;
  }

  .evolution-item {
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .evolution-item:hover {
    transform: scale(1.05);
  }

  .evolution-item.active {
    position: relative;
    font-weight: bold;
  }

  .evolution-arrow {
    font-size: 24px;
  }

  .evolution-item img {
    width: 100px;
    height: 100px;
    cursor: pointer !important;
    transition: filter 0.2s;
  }
  .evolution-item img:hover {
    filter: brightness(1.1) drop-shadow(0 0 8px #ffcb05);
  }

  .evolution-name {
    margin-top: 10px;
    text-transform: capitalize;
  }

  .grass {
    background-color: #78c850;
  }
  .poison {
    background-color: #a040a0;
  }
  .fire {
    background-color: #f08030;
  }
  .flying {
    background-color: #a890f0;
  }
  .water {
    background-color: #6890f0;
  }
  .bug {
    background-color: #a8b820;
  }
  .normal {
    background-color: #a8a878;
  }
  .electric {
    background-color: #f8d030;
  }
  .ground {
    background-color: #e0c068;
  }
  .fairy {
    background-color: #ee99ac;
  }
  .fighting {
    background-color: #c03028;
  }
  .psychic {
    background-color: #f85888;
  }
  .rock {
    background-color: #b8a038;
  }
  .steel {
    background-color: #b8b8d0;
  }
  .ice {
    background-color: #98d8d8;
  }
  .ghost {
    background-color: #705898;
  }
  .dragon {
    background-color: #7038f8;
  }
  .dark {
    background-color: #705848;
  }

  @media (max-width: 950px) {
    .pokemon-detail-content {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .pokemon-image-container {
      height: 450px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pokemon-main-image img {
      transform: scale(1.1);
      max-height: 400px;
    }

    .pokemon-type-bg {
      width: 260px !important;
      height: 260px !important;
      left: 60% !important;
      top: 0% !important;
      transform: translate(-50%, 0) scale(1) !important;
      opacity: 0.7;
    }
  }

  @media (max-width: 600px) {
    .pokemon-image-container {
      height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pokemon-main-image img {
      transform: scale(1);
      max-height: 300px;
    }

    .pokemon-detail-header h1 {
      font-size: 1.5rem;
    }

    .pokemon-type-bg {
      width: 120px !important;
      height: 120px !important;
      left: 55% !important;
      top: 10% !important;
      transform: translate(-50%, 0) scale(1) !important;
      opacity: 0.7;
    }
  }
</style>
