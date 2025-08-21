# Pokedex App

A comprehensive Pokémon information website built with Nuxt 3, TypeScript, and Vue.js. This project fetches data from the PokéAPI and provides a clean, intuitive interface for browsing Pokémon.

## Features

- Display a list of Pokémon with thumbnails
- Search Pokémon by name
- Filter by type/weakness and generation
- Sort by ID or name
- View detailed information for each Pokémon
- Mobile-friendly responsive design

## Setup

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
# npm
npm install

# yarn
yarn install
```

3. Create an environment file:

```bash
cp .env.example .env
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Testing

The application includes unit tests built with Vitest and Vue Test Utils. Run the tests with:

```bash
# npm
npm test

# yarn
yarn test
```

Tests cover:
- Utility functions (formatters)
- Vue components (PokemonCard, SearchBar)
- Pinia stores (pokemon)

To add new tests, create files with the `.spec.js` or `.test.js` extension in the `test` directory.

## Code Organization

- **Components**: Reusable Vue components
- **Pages**: Nuxt pages for routing
- **Stores**: Pinia stores for state management
- **Utils**: Utility functions
- **Assets**: CSS and other static assets
- **Types**: TypeScript interfaces and types
- **Schemas**: Data validation schemas

## Best Practices Implemented

- **BEM CSS Methodology**: For consistent and maintainable CSS
- **TypeScript**: For type safety and better developer experience
- **Centralized State Management**: Using Pinia for predictable state management
- **Environment Variables**: For configuration management
- **Component Testing**: To ensure component functionality
- **Composition API**: For better code organization and reusability
- **CSS Variables**: For theming and consistent styling
