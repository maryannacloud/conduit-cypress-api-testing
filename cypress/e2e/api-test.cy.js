/// <reference types="cypress" />

it('intercept api', () => {
  cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
  cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
  cy.loginToApplication()
})

it.only('modify api response', () => {
  cy.intercept('GET', '**/articles*', req => {
    req.continue(res => {
      res.body.articles[0].favoritesCount = 999999
      res.send(res.body)
    })
  })
  cy.loginToApplication()
  cy.get('app-favorite-button').first().should('contain.text', '999999')
})