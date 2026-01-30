const { defineConfig } = require("cypress");

module.exports = defineConfig({

  env: {
    loginEmail: "maryanna_cloud@softwaretesting.com",
    loginPassword: "Password123",
    apiUrl: "https://conduit-api.bondaracademy.com/api"
  },

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },

  e2e: {
    baseUrl: "https://conduit.bondaracademy.com/",
    setupNodeEvents(on, config) {
        require('cypress-mochawesome-reporter/plugin')(on);
        config.env.username = process.env.USER_NAME
        config.env.password = process.env.PASSWORD
        return config
    },

    retries: {
      openMode: 0,
      runMode: 1
    }
  },
  viewportWidth: 1280,
  viewportHeight: 720
});