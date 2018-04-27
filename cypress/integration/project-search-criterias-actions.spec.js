import * as constants from './../constants';
let countResults = 0;
let searchCriteriasCount = 0;

describe('Test project search criterias actions (Remove/Relaunch/Restore)', () => {
    it('Test initialisation', () => {
        cy.init()
        cy.login()
        cy.createSelectTestProject()
    })

    it('Create search criteria(s) and count results', () => {
        cy.get('#cy-search-datasets').click()
        cy.selectFacet('project', 'ObsGrid')
        cy.get('#cy-search-results #cy-search-results-count')

        // Note total results for future validation
        cy.get('#cy-search-results #cy-pagination').invoke('attr', 'data-cy-total').as('total')
        cy.get('@total').then(function(total) {
            countResults = total
            cy.log(countResults)
        })
    })

    it('Save search criterias', () => {
        cy.saveSearchCriterias(constants.SEARCH_CRITERIAS_NAME)
    })

    it('Reset search criterias', () => {
        cy.resetFacets()
    })

    it('There should be one added search criterias in the current project', () => {
        cy.get('#cy-project-management').click()
        cy.get('#cy-project-search-criterias #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "1") 
    })

    it('Select current project newly added search criterias and trigger action "Restore results"', () => {
        cy.get('.cy-project-search-criterias-item .cy-actions-btn').first().click()
        // Should we really valid there will be 3 action buttons
        cy.get('div[role=menu]').children().should('to.have.lengthOf', 3) // 3 actions
        cy.get('div[role=menu] #cy-restore-item').click()

        cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
        cy.get('.notification-container .notification-warning').click()

        // Should be redirected to Search Datasets setion
        cy.get('#cy-sectional-content').should('be.visible')
        cy.get('#cy-sectional-content h1').should('contain', constants.SEARCH_DATASETS_TITLE)
    })

    it('Validate restored results match', () => {
        cy.get('#cy-search-results #cy-search-results-count')
        cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('eq', countResults) 
    })

    it('Reset search criterias', () => {
        cy.resetFacets()
    })

    it('Select current project newly added search criterias and trigger action "Relaunch search"', () => {
        cy.get('#cy-project-management').click()
        cy.get('.cy-project-search-criterias-item .cy-actions-btn').first().click()
        cy.get('div[role=menu] #cy-relaunch-item').click()

        // Should be redirected to Search Datasets setion
        cy.get('#cy-sectional-content').should('be.visible')
        cy.get('#cy-sectional-content h1').should('contain', constants.SEARCH_DATASETS_TITLE)
    })

    it('Validate relaunch results match', () => {
        cy.wait(1000)
        cy.get('#cy-search-results #cy-search-results-count')
        cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('eq', countResults) 
    })

    it('Remove first search criterias in the current project', () => {
        cy.get('#cy-project-management').click()

        cy.get('.cy-project-search-criterias-item .cy-actions-btn').first().click()
        cy.get('div[role=menu] #cy-remove-item').click()
        
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()
    })

    it('There should be no more search criterias in the current project', () => {
        cy.get('#cy-project-search-criterias #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "0") 
    })

    it('Test closing tasks', () => {
        cy.ensureSectionClose('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
        cy.removeCurrentProject()
        cy.logout()
    })

})
  