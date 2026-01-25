/// <reference types="cypress" />

it('intercept api', () => {
  cy.intercept('GET', '**/tags', { fixture: 'tags.json' })
  cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })
  cy.loginToApplication()
})

// for more granular api interception configuration we can use route matcher
it('intercept api with router matcher', () => {
  cy.intercept({ method: 'GET', pathname: 'tags' }, { fixture: 'tags.json' })
  cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })
  cy.loginToApplication()
})

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

// waiting for an API helps to make tests more stable
// we have to define an intercept before every scenario
// and provide the alias name for the API
it('waiting for apis', () => {
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

it.only('e2e api test', () => {
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