/// <reference types="cypress" />

it('delete newly created article', () => {
  cy.loginToApplication()
  const uniqueTitle = `AI Article ${Date.now()}`
  cy.get('@accessToken').then(token => {
    cy.request({
      url: 'https://conduit-api.bondaracademy.com/api/articles',
      method: 'POST',
      body: {
        "article": {
          "title": uniqueTitle,
          "description": "AI is amazing",
          "body": "This is a body",
          "tagList": []
        }
      },
      headers: {'Authorization': 'Token ' + token}
    }).then(response => {
      expect(response.status).to.equal(201)
      expect(response.body.article.title).to.equal(uniqueTitle)
    })
  })
  cy.contains('AI is amazing').click()
  cy.intercept('GET', '**/articles*').as('articleApiCall')
  cy.contains('button', 'Delete Article').first().click()
  cy.wait('@articleApiCall')
  cy.get('app-article-list').should('not.contain.text', 'AI is amazing')
})