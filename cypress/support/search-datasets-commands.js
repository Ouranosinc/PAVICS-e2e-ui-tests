
import * as constants from './../constants';

// Search datasets section should be opened as well as some facets loaded
Cypress.Commands.add('selectFacet', (key, value) => {
  cy.get(`#cy-search-facet-${key} button`).click()
  cy.get(`#cy-search-facet-${key}-${value} input`).check({force: true})
  cy.get(`#cy-search-facet-${key} button`).click() // TODO a backdrop click outside should also work eventually
})

// Search datasets section should be opened as well as some facets loaded
Cypress.Commands.add('selectCMIP5PRMonFacets', () => {
  // cy.server()
  // cy.route('/wps/pavicsearch?**').as('pavicsSearch')
  cy.selectFacet('project', 'CMIP5')
  cy.selectFacet('variable', 'pr')
  cy.selectFacet('frequency', 'mon')
  // cy.wait('@pavicsSearch')
  cy.wait(15000) // FIXME
  cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "1") 
})

// Search datasets section should be opened as well as some facets loaded
Cypress.Commands.add('selectOuranosPCPFacets', () => {
  cy.selectFacet('project', 'Ouranos')
  cy.selectFacet('variable', 'PCP')
})

// Search datasets section should be opened and some facets should be selected
Cypress.Commands.add('resetFacets', (key, value) => {
  cy.get('#cy-reset-criterias-btn').click()
  cy.wait(3000)
  cy.get('#cy-search-no-results-sh').should('contain', constants.NO_RESULTS_FOUND_LABEL)
  cy.get('#cy-reset-criterias-btn').should('have.attr', 'disabled')
  cy.get('#cy-save-criterias-btn').should('have.attr', 'disabled')
})

// Search datasets section should be opened and some facets should be selected
Cypress.Commands.add('saveSearchCriterias', (name) => {
  cy.get('#cy-criterias-name-tf').clear().type(name)
  cy.get('#cy-save-criterias-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
})

Cypress.Commands.add('addFirstDatasetToProject', () => {
  cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
  cy.get('#cy-add-datasets-btn').click()

  cy.wait(1000)
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
})