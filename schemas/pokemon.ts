import { z } from 'zod'

// Ability Schema
export const PokemonAbilitySchema = z.object({
  ability: z.object({
    name: z.string(),
  }),
  is_hidden: z.boolean(),
})

// Type Schema
export const PokemonTypeSchema = z.object({
  slot: z.number(),
  type: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
})

// Sprites Schema
export const PokemonSpritesSchema = z.object({
  front_default: z.string().url(),
  front_shiny: z.string().url().optional(),
  other: z.object({
    'official-artwork': z.object({
      front_default: z.string().url(),
      front_shiny: z.string().url().optional(),
    }),
  }),
})

// Main Pokemon Schema
export const PokemonSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  height: z.number().nonnegative(),
  weight: z.number().nonnegative(),
  abilities: z.array(PokemonAbilitySchema),
  sprites: PokemonSpritesSchema,
  types: z.array(PokemonTypeSchema),
})

// Pokemon List Item Schema
export const PokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

// Pokemon List Response Schema
export const PokemonListResponseSchema = z.object({
  count: z.number().nonnegative(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(PokemonListItemSchema),
})

// Infer types from schemas
export type Pokemon = z.infer<typeof PokemonSchema>
export type PokemonListResponse = z.infer<typeof PokemonListResponseSchema>
