import {
  NO_RESULTS_FOUND_LABEL,
  SEARCH_CRITERIAS_NAME,
  SEARCH_DATASETS_TITLE
} from './../constants';

describe('Test search datasets section', () => {

  beforeEach(() => {
    cy.initBeforeEach()
  })

  it('Test initialisation', () => {
    cy.init()
    cy.login()
    cy.createSelectTestProject()
  })

  it('No datasets should be loaded when none facet has been selected', () => {
    cy.route('/wps/pavicsearch?**').as('pavicsSearch')
    cy.ensureSectionOpen('cy-search-datasets', SEARCH_DATASETS_TITLE)
    cy.wait('@pavicsSearch')
    cy.get('#cy-search-facets')
    cy.get('#cy-search-no-results-sh').should('contain', NO_RESULTS_FOUND_LABEL)
  })

  it('Minimally 3 project facets should be loaded', () => {
    cy.testFacetKeyContainsValues('project', 3)
  })

  it('Minimally 3 frequency facets should be loaded', () => {
    cy.testFacetKeyContainsValues('frequency', 3)
  })

  it('Minimally 3 model facets should be loaded', () => {
    cy.testFacetKeyContainsValues('model', 3)
  })

  it('Minimally 3 variable facets should be loaded', () => {
    cy.testFacetKeyContainsValues('project', 3)
  })

  it('Select project:CMIP5, variable:pr facets', () => {
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
    cy.get('@pageCount').then( (pageCount) => {
      cy.get('@from').then( (from) => {
        cy.get('@to').then( (to) => {
          cy.get('@total').then( (total) => {
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
    cy.saveSearchCriterias(SEARCH_CRITERIAS_NAME)
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
    cy.route({ method: 'post', url: new RegExp(/api\/Projects\/.*\/datasets/i) }).as('addDataset')
    cy.get('#cy-add-datasets-btn').should('have.attr', 'disabled')
    cy.get('.cy-dataset-result-item').should('to.have.length.above', 1)
    cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
    cy.get('.cy-dataset-result-item input[type=checkbox]').last().check()
    cy.get('#cy-add-datasets-btn').should('not.have.attr', 'disabled')
    cy.get('#cy-add-datasets-btn').click()
    cy.wait('@addDataset')
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').click({ multiple: true }) // There will be one alert by added dataset
  })

  it('Verify two datasets were added to current project', () => {
    // Navigate to project management section
    cy.route({ method: 'get', url: new RegExp(/api\/Projects\/.*\/datasets/i) }).as('fetchDatasets')
    cy.get('#cy-project-management').click()
    cy.wait('@fetchDatasets')
    cy.wait(500)
    cy.get('#cy-project-datasets #cy-pagination')
    cy.get('#cy-project-datasets #cy-pagination').should('have.attr', 'data-cy-total')
    cy.get('#cy-project-datasets #cy-pagination').invoke('attr', 'data-cy-total').as('total')
    cy.get('@total').should('eq', '2')
  })

  it('Resetting facets should remove facets and results', () => {
    // Navigate back to search datasets section
    cy.get('#cy-search-datasets').click()
    cy.resetFacets()
    cy.ensureSectionClose('cy-search-datasets', SEARCH_DATASETS_TITLE)
  })

  it('Test closing tasks', () => {
    cy.removeCurrentProject()
    cy.logout()
  })

})
