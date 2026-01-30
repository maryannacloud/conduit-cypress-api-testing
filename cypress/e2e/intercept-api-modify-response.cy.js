/// <reference types="cypress" />

it('intercept api and modify response', {retries: 2}, () => {
  cy.intercept('GET', '**/articles*', req => {
    req.continue(res => {
      res.body.articles[0].favoritesCount = 9999999
      res.send(res.body)
    })
  })
  cy.uiLogin()
  cy.get('app-favorite-button').first().should('contain.text', '999999')
})