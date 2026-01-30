/// <reference types="cypress" />

// waiting for an API helps to make tests more stable
// we have to define an intercept before every scenario
// and provide the alias name for the API
it('waiting for apis', () => {
  cy.intercept('GET', '**/articles*').as('articleApiCall')
  cy.uiLogin()
  cy.wait('@articleApiCall').then(apiArticleObject => {
    console.log(apiArticleObject)
    expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
  })
  cy.get('app-article-list').invoke('text').then(allArticleTexts => {
    expect(allArticleTexts).to.contain('Bondar Academy')
  })
})