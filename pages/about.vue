<template>
  <main class="about-page">
    <div class="about-container">
        <section class="about-section about-section--personal">
          <h1 class="about-section__title">About Me</h1>
          
          <div class="about-section__content personal-info">
            <div class="personal-info__header">
              <h2 class="personal-info__name">Brandon S. Dallon</h2>
              <div class="personal-info__contact">
                <a href="mailto:bsdallon@gmail.com" class="contact-link contact-link--email">
                  <span class="icon">📧</span> bsdallon@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/brandon-dallon-66a13916/" target="_blank" class="contact-link contact-link--linkedin">
                  <span class="icon">👔</span> LinkedIn Profile
                </a>
                <a href="https://docs.google.com/document/d/1G6YV9fh2YKNMIL0qe4MIo_0i81ES4XUC/edit?usp=sharing&ouid=106743989384516095459&rtpof=true&sd=true" target="_blank" class="contact-link contact-link--resume">
                  <span class="icon">📄</span> Resume
                </a>
              </div>
            </div>

            <div class="personal-info__bio">
              <p>I'm a developer passionate about creating interactive web applications with modern technologies.</p>
              <p>This Pokedex application is my first time using Vue.js, and Nuxt 3. I enjoyed this opportunity to learn and grow as a developer.</p>
              <p>The app features a responsive design, state management with Pinia, and test coverage with Vitest.</p>
            </div>
          </div>
        </section>

        <section class="about-section about-section--project">
          <h2 class="about-section__title">About This Project</h2>
          <p>This Pokedex application was an assessment project aimed at exploring my capabilities of Vue.js and Nuxt 3.</p>
          <div class="about-section__content">
            <p>This Pokedex app was built using:</p>
            <ul class="tech-stack">
              <li><strong>Vue.js 3</strong> with Composition API</li>
              <li><strong>TypeScript</strong> for type safety</li>
              <li><strong>Nuxt 3</strong> for routing and application structure</li>
              <li><strong>Pinia</strong> for state management</li>
              <li><strong>Custom CSS</strong> using BEM methodology</li>
              <li><strong>Vitest</strong> for unit testing</li>
            </ul>
            
            <p>The app integrates with the <a href="https://pokeapi.co/" target="_blank">PokeAPI</a> to provide comprehensive Pokémon data, with features like searching, filtering by type or weakness, and detailed Pokémon information pages.</p>
          </div>
        </section>

        <section class="about-section about-section--future">
          <h2 class="about-section__title">Future Improvements</h2>
          
          <div class="about-section__content">
            <p>While the current version of the app meets all requirements, here are some features I'd like to add in the future:</p>
            
            <div class="future-features">
              <div class="feature-card">
                <h3 class="feature-card__title">More Advanced Search Options</h3>
                <p class="feature-card__description">Being able to search based off height and weight could be a useful addition.</p>
              </div>
              
              <div class="feature-card">
                <h3 class="feature-card__title">Favorite Pokemon</h3>
                <p class="feature-card__description">Allow users to save their favorite Pokemon to a personal collection that persists between sessions.</p>
              </div>
              
              <div class="feature-card">
                <h3 class="feature-card__title">Team Builder</h3>
                <p class="feature-card__description">Create a team-building feature with type analysis and team strength/weakness visualization.</p>
              </div>
              
              <div class="feature-card">
                <h3 class="feature-card__title">Pokemon Comparisons</h3>
                <p class="feature-card__description">Add a side-by-side comparison tool to evaluate different Pokemon stats and abilities.</p>
              </div>
              
              <div class="feature-card">
                <h3 class="feature-card__title">Whos that Pokemon mini-game</h3>
                <p class="feature-card__description">Create a fun mini-game where users guess the Pokemon based on silhouettes or hints.</p>
              </div>
              
              <div class="feature-card">
                <h3 class="feature-card__title">Animations</h3>
                <p class="feature-card__description">Add more sophisticated animations and transitions to enhance the user experience.</p>
              </div>
            </div>
            
            <p class="feedback-note">I really enjoyed working on this project and learning more about Vue.js and Nuxt 3. If you have any feedback or suggestions, feel free to reach out!</p>
          </div>
        </section>
  </div>
  </main>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background-color: var(--card-color);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.about-section__title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
  font-size: 2rem;
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
}

.personal-info__header {
  margin-bottom: 1.5rem;
}

.personal-info__name {
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.personal-info__contact {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
}

.contact-link {
  display: flex;
  align-items: center;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease;
  margin-right: 1.5rem;
}

.contact-link:hover {
  color: var(--accent-color);
}

.contact-link .icon {
  margin-right: 0.5rem;
}

.personal-info__bio {
  line-height: 1.6;
}

.tech-stack {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.tech-stack li {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border-left: 3px solid var(--accent-color);
}

.future-features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card__title {
  margin-top: 0;
  color: var(--accent-color);
}

.feature-card__description {
  margin-bottom: 0;
  line-height: 1.5;
}

.feedback-note {
  margin-top: 2rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .personal-info__contact {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .future-features {
    grid-template-columns: 1fr;
  }
}
</style>