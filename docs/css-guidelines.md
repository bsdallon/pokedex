# CSS Guidelines for Pokedex Project

## BEM Methodology

This project uses the BEM (Block, Element, Modifier) methodology for CSS naming conventions.

### Naming Convention

- **Block**: The root or standalone component (e.g., `.pokemon-card`)
- **Element**: A part of a block (e.g., `.pokemon-card__name`)
- **Modifier**: A flag on a block or element for changing appearance (e.g., `.pokemon-card--featured`)

### Examples

```css
/* Block */
.search-bar {
  /* styles */
}

/* Element (belongs to the block) */
.search-bar__input {
  /* styles */
}

/* Element with modifier */
.search-bar__button--disabled {
  /* styles */
}

/* Block modifier */
.pokemon-card--featured {
  /* styles */
}
```

### Rules

1. Block names use kebab-case
2. Elements are connected to blocks with double underscores (`__`)
3. Modifiers are connected to blocks or elements with double dashes (`--`)
4. Don't use nested selectors unnecessarily
5. Each component should have its own CSS file or scoped styles

## Organization

CSS files are organized as follows:

- `/assets/styles/` - Global styles and variables
  - `/assets/styles/main.css` - Main styles and imports
  - `/assets/styles/variables.css` - CSS custom properties
  - `/assets/styles/components/` - Component-specific global styles
  - `/assets/styles/pages/` - Page-specific styles

## Variables

Use the defined CSS custom properties from `variables.css` whenever possible:

```css
:root {
  --background-color: #f5f5f5;
  --card-color: #ffffff;
  --accent-color: #ffcb05;
  --text-color: #333333;
}
```

## Media Queries

Mobile-first approach with breakpoints:

```css
/* Mobile (default) */
.component {
  /* styles */
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    /* styles */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    /* styles */
  }
}
```

## Animation

Prefer transitions over animations for simple state changes. Use keyframes for more complex animations.

## Best Practices

1. Use `scoped` in Vue components to prevent style leakage
2. Comment sections of complex CSS
3. Avoid magic numbers and use variables instead
4. Keep specificity low to maintain maintainability
