/// <reference types="cypress" />

it('delete newly created article', () => {
  const uniqueTitle = `AI Article ${Date.now()}`
  // Step 1: get the auth token
  cy.request({
    url: 'https://conduit-api.bondaracademy.com/api/users/login',
    method: 'POST',
    body: {
      "user": {
        "email": Cypress.env('loginEmail'),
        "password": Cypress.env('loginPassword')
      }
    }
  }).then(loginResponse => {
    expect(loginResponse.status).to.equal(200)
    const accessToken = `Token ${loginResponse.body.user.token}`
    // Step 2: created a new article with the unique title via API
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
      headers: {
        'Authorization': accessToken
      }
    }).then(response => {
      expect(response.status).to.equal(201)
      expect(response.body.article.title).to.equal(uniqueTitle)
    })
  })
  cy.loginToApplication()
  cy.contains('AI is amazing').click()
  cy.intercept('GET', '**/articles*').as('articleApiCall')

  // Step 3: delete newly created article
  cy.contains('button', 'Delete Article').first().click()
  cy.wait('@articleApiCall')
  cy.get('app-article-list').should('not.contain.text', 'AI is amazing')
})