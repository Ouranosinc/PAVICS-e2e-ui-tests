
import * as constants from './../constants';

// Search datasets section should be opened as well as some facets loaded
// Now includes a wait for pavicsearch to complete
Cypress.Commands.add('selectFacet', (key, value) => {
  cy.route('/wps/pavicsearch?**').as('pavicsSearch')
  cy.get(`#cy-search-facet-${key} button`).click()
  cy.get(`#cy-search-facet-${key}-${value} input`).check({ force: true })
  cy.get(`#cy-search-facet-${key} button`).click() // TODO a backdrop click outside should also work eventually
  cy.wait('@pavicsSearch')
})

Cypress.Commands.add('addAdditionnalCriterias', (key) => {
  cy.get('#cy-add-criteria-sf').click()
  cy.get(`#cy-add-criteria-${key}`).click()
})

// Search datasets section should be opened as well as some facets loaded
Cypress.Commands.add('selectCMIP5RCP85PRDayFacets', () => {
  cy.selectFacet('project', 'CMIP5')
  cy.addAdditionnalCriterias('experiment')
  cy.selectFacet('experiment', 'rcp85')
  cy.selectFacet('variable', 'pr')
  cy.selectFacet('frequency', 'day')
  // TODO (hirondelle) Expecting only one result
  cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
  cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)
  // cy.get('.cy-dataset-result-item div').last().text().should('to.match', new RegExp(/(1 file)/))
  // TODO: Dataset should contains only one file
})

Cypress.Commands.add('selectCMIP5RCP45PRDayFacets', () => {
  cy.selectFacet('project', 'CMIP5')
  cy.addAdditionnalCriterias('experiment')
  cy.selectFacet('experiment', 'rcp45')
  cy.selectFacet('variable', 'pr')
  cy.selectFacet('frequency', 'day')
  // TODO (hirondelle) Expecting only one result
  cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
  cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)
  // cy.get('.cy-dataset-result-item div').last.should('to.match', new RegExp(/(2 files)/))
  // TODO: Dataset should contains two files
})


// Search datasets section should be opened as well as some facets loaded
Cypress.Commands.add('selectOuranosPCPFacets', () => {
  cy.selectFacet('project', 'Ouranos')
  cy.selectFacet('variable', 'PCP')
})

// Search datasets section should be opened and some facets should be selected
Cypress.Commands.add('resetFacets', (key, value) => {
  cy.route('/wps/pavicsearch?**').as('pavicsSearch')
  cy.get('#cy-reset-criterias-btn').click()
  cy.wait('@pavicsSearch')
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
  cy.route({ method: 'post', url: new RegExp(/api\/Projects\/.*\/datasets/i) }).as('addDataset')
  cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
  cy.get('#cy-add-datasets-btn').click()
  cy.wait('@addDataset')
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
})