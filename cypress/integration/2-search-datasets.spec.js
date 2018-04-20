describe('Test search datasets section', () => {
    it('Test initialisation', () => {
        cy.init()
        cy.login()
        cy.createSelectTestProject()
        cy.logout()
    })


    it('No facets should be loaded if not logged', () => {
        cy.ensureSectionOpen('cy-search-datasets', 'Search Datasets')
        cy.get('#cy-search-no-facets')
        cy.get('#cy-search-no-facets').should('contain', 'No facets found.')
        // TODO
    })

    it('Some facets should be loaded if logged', () => {
        cy.login()
        cy.ensureSectionOpen('cy-search-datasets', 'Search Datasets')
        cy.wait(1000)
        cy.get('#cy-search-facets')
        cy.get('#cy-search-no-results-sh').should('contain', 'No results found.')

        // Test project SelectField
        cy.get('#cy-search-facet-project-list > div').children().should('to.have.lengthOf', 1) // List invisible
        cy.get('#cy-search-facet-project button').click()
        cy.get('#cy-search-facet-project-list > div').children().should('to.have.lengthOf', 2) // List is now visible
        cy.get('#cy-search-facet-project-list > div').children().last().children().should('to.have.length.above', 3) // TODO: Could depend on thredds permissions
        cy.get('#cy-search-facet-project button').click() // TODO a backdrop click outside should also work eventually
        cy.get('#cy-search-facet-project-list > div').children().should('to.have.lengthOf', 1) // List invisible

        // TODO: could try same tests for all 4 SelectFields
        cy.get('#cy-search-facet-frequency button')
        cy.get('#cy-search-facet-model button')
        cy.get('#cy-search-facet-variable button')
    })

    it('Select project:CMIP5 and variable:pr facets', () => {
        cy.get('#cy-search-facet-project button').click()
        cy.get('#cy-search-facet-project-CMIP5 input').check()
        cy.get('#cy-search-facet-project button').click() // TODO a backdrop click outside should also work eventually

        cy.get('#cy-search-facet-variable button').click()
        cy.get('#cy-search-facet-variable-pr input').check()
        cy.get('#cy-search-facet-variable button').click() // TODO a backdrop click outside should also work eventually
    })

    it('We should see some paginated results', () => {
        // cy.get('#cy-search-results-loader') // Search is way too quick for cypress
        cy.get('#cy-search-results-count')
        cy.get('#cy-pagination')
        cy.get('#cy-pagination').should('have.attr', 'data-cy-page-count')
        cy.get('#cy-pagination').invoke('attr', 'data-cy-page-count').as('pageCount')
        cy.get('#cy-pagination').invoke('attr', 'data-cy-from').as('from')
        cy.get('#cy-pagination').invoke('attr', 'data-cy-to').as('to')
        cy.get('#cy-pagination').invoke('attr', 'data-cy-total').as('total')
        cy.get('@pageCount').then(function(pageCount) {
            cy.get('@from').then(function(from) {
                cy.get('@to').then(function(to) {
                    cy.get('@total').then(function(total) {
                        cy.get('#cy-pagination-showing').should('contain', `Showing ${from} to ${to} of ${total}`)
                    })
                })
            })
        })
    })

    it('Select datasets', () => {
        // TODO
    })

    it('Save selected datasets', () => {
        // TODO
    })

    it('Save search criterias', () => {
        // TODO
    })

    it('Close Search Datasets panel', () => {
        cy.ensureSectionClose('cy-search-datasets', 'Search Datasets')
    })

    it('Test closing tasks', () => {
        cy.removeTestProject()
        cy.logout()
    })

})
  