/// <reference types="cypress" />

it('intercept api', () => {
  cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
  cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
  cy.loginToApplication()
})

// for more granular api interception configuration we can use route matcher
it('intercept api - router matcher', () => {
  cy.intercept({method: 'GET', pathname: 'tags'}, {fixture: 'tags.json'})
  cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
  cy.loginToApplication()
})

it('modify api response', () => {
  cy.intercept('GET', '**/articles*', req => {
    req.continue(res => {
      res.body.articles[0].favoritesCount = 999999
      res.send(res.body)
    })
  })
  cy.loginToApplication()
  cy.get('app-favorite-button').first().should('contain.text', '999999')
})

// waiting for an API helps to make tests more stable
// we have to define an intercept before every scenario
// and provide the alias name for the API
it.only('waiting for apis', () => {
  cy.intercept('GET', '**/articles*').as('articleApiCall')
  cy.loginToApplication()
  cy.wait('@articleApiCall').then(apiArticleObject => {
    console.log(apiArticleObject)
    expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
  })
  cy.get('app-article-list').invoke('text').then(allArticleTexts => {
    expect(allArticleTexts).to.contain('Bondar Academy')
  })
})