/// <reference types="cypress" />

it('first-test', () => {
  cy.visit('/')
  cy.contains('Sign in').click()
  cy.get('[placeholder="Email"]').type(Cypress.env('loginEmail'))
  cy.get('[placeholder="Password"]').type(Cypress.env('loginPassword'))
  cy.contains('button', 'Sign in').click()
})