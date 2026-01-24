const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://conduit.bondaracademy.com/",
    setupNodeEvents(on, config) {
      
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720
});
