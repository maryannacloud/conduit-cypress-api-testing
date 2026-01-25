/// <reference types="cypress" />

it('e2e api test', () => {
  const uniqueTitle = `AI Article ${Date.now()}`
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
    })
    cy.request({
      method: 'GET',
      url: 'https://conduit-api.bondaracademy.com/api/articles',
      headers: {'Authorization': accessToken}
    }).then(response => {
      expect(response.status).to.equal(200)
      expect(response.body.articles[0].title).to.equal(uniqueTitle)
      const slugID = response.body.articles[0].title.slug

      cy.request({
        method: 'DELETE',
        url: `https://conduit-api.bondaracademy.com/api/articles/${slugID}`,
        headers: {'Authorization': accessToken}
      }).then(response.status).to.equal(204)
    })

    cy.request({
      method: 'GET',
      url: 'https://conduit-api.bondaracademy.com/api/articles',
      headers: {'Authorization': accessToken}
    }).then(response => {
      expect(response.status).to.equal(200)
      expect(response.body.articles[0].title).to.not.equal(uniqueTitle)
    })
  })
})