# Environment Variables

This document describes the environment variables used in the Pokedex project.

## Setup

Create a `.env` file in the root of your project with the following variables:

```
NUXT_PUBLIC_API_BASE=https://pokeapi.co/api/v2
```

## Available Variables

### API Configuration

- `NUXT_PUBLIC_API_BASE`: The base URL for the Pokemon API
  - Default: `https://pokeapi.co/api/v2`
  - Used for fetching Pokemon data

## Usage in Development

When running the project locally with `npm run dev`, environment variables from the `.env` file will be automatically loaded.

## Usage in Production

For production deployments, set these environment variables in your hosting platform's configuration (e.g., Vercel, Netlify, etc.).

## Adding New Variables

When adding new environment variables, follow these guidelines:

1. Prefix with `NUXT_PUBLIC_` for client-accessible variables
2. Prefix with `NUXT_` for server-only variables
3. Document the variable in this file
4. Add a default value in `nuxt.config.ts`
