/**
 * Format a name string to capitalize the first letter
 * @param {string} name - The name to format
 * @returns {string} The formatted name
 */
export function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Format a Pokemon ID to a padded string
 * @param {number} id - The Pokemon ID
 * @returns {string} The formatted ID with leading zeros
 */
export function formatPokemonId(id) {
  return String(id).padStart(4, '0');
}

/**
 * Format Pokemon abilities as a comma-separated list with capitalized names
 * @param {Array} abilities - Array of ability objects
 * @returns {string} Comma-separated list of ability names
 */
export function formatAbilities(abilities) {
  return abilities
    .map(a => formatName(a.ability.name))
    .join(', ');
}

/**
 * Format height from decimeters to meters and feet/inches
 * @param {number} height - Height in decimeters
 * @returns {string} Formatted height string
 */
export function formatHeight(height) {
  const heightInMeters = height / 10;
  const feet = Math.floor(heightInMeters * 3.28084);
  const inches = Math.round((heightInMeters * 3.28084 - feet) * 12);
  return `${heightInMeters.toFixed(1)}m (${feet}'${inches}")`;
}

/**
 * Format weight from hectograms to kilograms and pounds
 * @param {number} weight - Weight in hectograms
 * @returns {string} Formatted weight string
 */
export function formatWeight(weight) {
  const weightInKg = weight / 10;
  const weightInLbs = weightInKg * 2.20462;
  return `${weightInKg.toFixed(1)}kg (${weightInLbs.toFixed(1)}lbs)`;
}

/**
 * Format stat names to be more readable
 * @param {string} statName - The stat name from the API
 * @returns {string} The formatted stat name
 */
export function formatStatName(statName) {
  const statNameMap = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  };
  
  return statNameMap[statName] || formatName(statName);
}
