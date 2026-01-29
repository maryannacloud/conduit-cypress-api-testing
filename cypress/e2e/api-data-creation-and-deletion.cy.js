/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

it('delete newly created article', () => {
  cy.loginToApplication()
  const uniqueTitle = faker.person.fullName
  cy.get('@accessToken').then(token => {
    cy.request({
      url: Cypress.env('') + '/articles',
      method: 'POST',
      body: {
        "article": {
          "title": uniqueTitle,
          "description": faker.person.jobTitle,
          "body": faker.lorem.paragraph(10),
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