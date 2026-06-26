const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://qauto.forstudy.space/',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    chromeWebSecurity: false,
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
