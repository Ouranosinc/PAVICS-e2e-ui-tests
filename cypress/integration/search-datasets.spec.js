import * as constants from './../constants';

describe('Test search datasets section', () => {
    it('Test initialisation', () => {
        cy.init()
        cy.login()
        cy.createSelectTestProject()
        cy.logout()
    })

    it('No facets should be loaded if not logged', () => {
        cy.ensureSectionOpen('cy-search-datasets', constants.SEARCH_DATASETS_TITLE)
        cy.get('#cy-search-no-facets')
        cy.get('#cy-search-no-facets').should('contain', 'No facets found.')
        cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
        cy.get('.notification-container .notification-warning').click()
    })

    it('Some facets should be loaded if logged', () => {
        cy.login()
        cy.ensureSectionOpen('cy-search-datasets', constants.SEARCH_DATASETS_TITLE)
        cy.wait(1000)
        cy.get('#cy-search-facets')
        cy.get('#cy-search-no-results-sh').should('contain', constants.NO_RESULTS_FOUND_LABEL)

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
        cy.selectFacet('project', 'CMIP5')
        cy.selectFacet('variable', 'pr')
    })

    it('We should see some paginated results', () => {
        // cy.get('#cy-search-results-loader') // Search is way too quick for cypress
        cy.get('#cy-search-results #cy-search-results-count')
        cy.get('#cy-search-results #cy-pagination')
        cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-page-count')
        cy.get('#cy-search-results #cy-pagination').invoke('attr', 'data-cy-page-count').as('pageCount')
        cy.get('#cy-search-results #cy-pagination').invoke('attr', 'data-cy-from').as('from')
        cy.get('#cy-search-results #cy-pagination').invoke('attr', 'data-cy-to').as('to')
        cy.get('#cy-search-results #cy-pagination').invoke('attr', 'data-cy-total').as('total')
        cy.get('@pageCount').then(function(pageCount) {
            cy.get('@from').then(function(from) {
                cy.get('@to').then(function(to) {
                    cy.get('@total').then(function(total) {
                        cy.get('#cy-search-results #cy-pagination-showing').should('contain', `Showing ${from} to ${to} of ${total}`)
                        // TODO: Test pagination
                    })
                })
            })
        })
    })

    it('Saving search criterias without a name should trigger a warning alert', () => {
        cy.get('#cy-save-criterias-btn').click()
        cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
        cy.get('.notification-container .notification-warning').click()
    })

    it('Add a "Search Criteria(s) name and save them in the current project', () => {
        cy.saveSearchCriterias(constants.SEARCH_CRITERIAS_NAME)
    })

    it('Verify search criteria(s) were added to current project', () => {
        // Navigate to project management section
        cy.get('#cy-project-management').click()
        cy.get('#cy-project-search-criterias #cy-pagination')
        cy.get('#cy-project-search-criterias #cy-pagination').should('have.attr', 'data-cy-total')
        cy.get('#cy-project-search-criterias #cy-pagination').invoke('attr', 'data-cy-total').as('total')
        cy.get('@total').should('eq', '1')
        // Navigate back to search datasets section
        cy.get('#cy-search-datasets').click() 
    })

    it('Select two datasets and add them to current project', () => {
        cy.get('#cy-add-datasets-btn').should('have.attr', 'disabled')
        cy.get('.cy-dataset-result-item').should('to.have.length.above', 1)
        cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
        cy.get('.cy-dataset-result-item input[type=checkbox]').last().check()
        cy.get('#cy-add-datasets-btn').should('not.have.attr', 'disabled')
        cy.get('#cy-add-datasets-btn').click()
        cy.wait(1000)
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click({multiple: true}) // There will be one alert by added dataset
    })

    it('Verify two datasets were added to current project', () => {
        // Navigate to project management section
        cy.get('#cy-project-management').click()
        cy.get('#cy-project-datasets #cy-pagination')
        cy.get('#cy-project-datasets #cy-pagination').should('have.attr', 'data-cy-total')
        cy.get('#cy-project-datasets #cy-pagination').invoke('attr', 'data-cy-total').as('total')
        cy.get('@total').should('eq', '2')
        // Navigate back to search datasets section
        cy.get('#cy-search-datasets').click() 
    })

    it('Resetting facets should remove facets ans results', () => {
        cy.resetFacets()
    })
    
    it('Close Search Datasets panel', () => {
        cy.ensureSectionClose('cy-search-datasets', constants.SEARCH_DATASETS_TITLE)
    })

    it('Test closing tasks', () => {
        cy.removeCurrentProject()
        cy.logout()
    })

})
  