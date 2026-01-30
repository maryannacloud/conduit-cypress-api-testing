/// <reference types="cypress" />

it('e2e api test', {tags: '@e2e'}, () => {
    const uniqueTitle = `AI Article ${Date.now()}`
    cy.request({
        url:  Cypress.env('') + '/users/login',
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
            url: Cypress.env('') + '/articles',
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
            url: Cypress.env('') + '/articles',
            headers: { Authorization: accessToken }
        }).then(response => {
            expect(response.status).to.equal(200)

            const created = response.body.articles.find(a => a.title === uniqueTitle)
            expect(created, 'created article exists').to.exist

            const slugID = created.slug

            cy.request({
                method: 'DELETE',
                url: `${Cypress.env('apiUrl')}/articles/${slugID}`,
                headers: { Authorization: accessToken }
            }).then(deleteResponse => {
                expect(deleteResponse.status).to.equal(204)
            })
        })

        cy.request({
            method: 'GET',
            url: Cypress.env('') + 'articles',
            headers: { 'Authorization': accessToken }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.not.equal(uniqueTitle)
        })
    })
})