/// <reference types="cypress" />

it('intercept api', () => {
  cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
  cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
  cy.loginToApplication()
})