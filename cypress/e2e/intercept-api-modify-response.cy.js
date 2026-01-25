/// <reference types="cypress" />

it('intercept api and modify response', () => {
  cy.intercept('GET', '**/articles*', req => {
    req.continue(res => {
      res.body.articles[0].favoritesCount = 999999
      res.send(res.body)
    })
  })
  cy.loginToApplication()
  cy.get('app-favorite-button').first().should('contain.text', '999999')
})