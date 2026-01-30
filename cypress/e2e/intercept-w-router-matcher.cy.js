/// <reference types="cypress" />

// for more granular api interception configuration we can use route matcher
it('intercept api with router matcher', () => {
  cy.intercept({ method: 'GET', pathname: 'tags' }, { fixture: 'tags.json' })
  cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })
  cy.uiLogin()
})