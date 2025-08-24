import { describe, it, expect } from 'vitest'
import {
  formatName,
  formatPokemonId,
  formatAbilities,
  formatHeight,
  formatWeight,
  formatStatName,
} from '~/utils/formatters'

describe('Formatter Utilities', () => {
  describe('formatName', () => {
    it('capitalizes the first letter', () => {
      expect(formatName('bulbasaur')).toBe('Bulbasaur')
      expect(formatName('charmander')).toBe('Charmander')
    })

    it('handles names with hyphens', () => {
      expect(formatName('mr-mime')).toBe('Mr-mime')
    })

    it('handles empty strings', () => {
      expect(formatName('')).toBe('')
    })
  })

  describe('formatPokemonId', () => {
    it('pads IDs with leading zeros', () => {
      expect(formatPokemonId(1)).toBe('0001')
      expect(formatPokemonId(25)).toBe('0025')
      expect(formatPokemonId(150)).toBe('0150')
    })

    it('handles large IDs correctly', () => {
      expect(formatPokemonId(1000)).toBe('1000')
    })
  })

  describe('formatAbilities', () => {
    it('formats a list of abilities correctly', () => {
      const abilities = [{ ability: { name: 'overgrow' } }, { ability: { name: 'chlorophyll' } }]

      expect(formatAbilities(abilities)).toBe('Overgrow, Chlorophyll')
    })

    it('handles single ability', () => {
      const abilities = [{ ability: { name: 'blaze' } }]

      expect(formatAbilities(abilities)).toBe('Blaze')
    })

    it('handles empty abilities array', () => {
      expect(formatAbilities([])).toBe('')
    })
  })

  describe('formatHeight', () => {
    it('converts height from decimeters to meters and feet/inches', () => {
      // 7dm = 0.7m = ~2'4"
      expect(formatHeight(7)).toMatch(/0.7m \(2'4"\)/)
    })
  })

  describe('formatWeight', () => {
    it('converts weight from hectograms to kg and lbs', () => {
      // 69hg = 6.9kg ≈ 15.2lbs
      expect(formatWeight(69)).toMatch(/6.9kg \(15.2lbs\)/)
    })
  })

  describe('formatStatName', () => {
    it('formats known stat names correctly', () => {
      expect(formatStatName('hp')).toBe('HP')
      expect(formatStatName('attack')).toBe('Attack')
      expect(formatStatName('special-attack')).toBe('Sp. Atk')
      expect(formatStatName('special-defense')).toBe('Sp. Def')
    })

    it('handles unknown stat names by capitalizing', () => {
      expect(formatStatName('custom-stat')).toBe('Custom-stat')
    })
  })
})
