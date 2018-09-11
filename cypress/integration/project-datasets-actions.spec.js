import { 
  SEARCH_DATASETS_TITLE, 
  PROJECT_MANAGEMENT_TITLE,
  TARGETED_CMIP5_DATASET_FILESERVER_URL } from './../constants';

describe('Test project datasets actions (Visualize/Remove/Download)', () => {

  beforeEach(() => {
    cy.initBeforeEach()
  })

  it('Test initialisation', () => {
    cy.init()
    cy.login()
    cy.createSelectTestProject() // @testProjectId is the current test project id
    cy.ensureSectionOpen('cy-search-datasets', SEARCH_DATASETS_TITLE)

    // We need Layer Switcher opened for following tests
    cy.toggleLayerSwitcherWidget()
    cy.get('#cy-layerswitcher-datasets-tab').click()
  })

  it('Launch search with "project:CMIP5 experiment:rpc85 variable:pr frequency:day" facets that should return a minimum of one result', () => {
    cy.selectCMIP5RCP85PRDayFacets()
    cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
    cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)
  })

  it('Select first dataset and add it to current project', () => {
    cy.addFirstDatasetToProject()
  })

  it('Resetting facets should remove facets and results', () => {
    cy.resetFacets()
  })

  it('Launch search with "project:Ouranos and variable:PCP" facets that should return a minimum of two results', () => {
    cy.selectOuranosPCPFacets()
  })

  it('Select first dataset and add it to current project', () => {
    cy.addFirstDatasetToProject()
  })

  it('Resetting facets should remove facets ans results', () => {
    cy.resetFacets()
  })

  it('There should be two added datasets in the current project', () => {
    cy.get('#cy-project-management').click()
    cy.get('#cy-project-datasets #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "2")
  })

  /*
  * We assume selected CMIP5/day dataset should contains a single NetCDF file
  */
  it('Select current project first dataset (CMIP5 1 file) and trigger action "Visualize"', () => {
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-0 .cy-actions-btn').first().as('actionsBtn')
    cy.triggerVisualize('@actionsBtn', 'cy-visualize-item')
    cy.get('#cy-big-color-palette').should('be.visible')
    
    // Validate there's a dataset now selected in the LayerSwitcher
    cy.get('.cy-layerswitcher-dataset-item').should('to.have.lengthOf', 1)
  })

  it('Select current project first dataset (CMIP5 1 file) and trigger action "Download"', () => {
    cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen')
      cy.get('.cy-project-dataset-item.cy-project-dataset-level-0 .cy-actions-btn').first().click()
      cy.get('ul[role=menu] #cy-download-item').click()
      cy.get('@windowOpen').should('be.calledWith', TARGETED_CMIP5_DATASET_FILESERVER_URL)
    })

    // TODO: Eventually capture URL, and try cy.request() in this test to see if a file is returned (200)
    // Always returning 401 ATM (cypress should pass cookies...)
    /*cy.request({
        url: TARGETED_CMIP5_DATASET_FILESERVER_URL,
        headers: {'Content-Type': 'application/netcdf'}
    }).then((response) => {
        expect(response.status).should('eq', "200")
    })*/
  })

  it('Select current project first dataset (CMIP5 1 file) and trigger action "Remove"', () => {
    cy.route({ method: 'delete', url: new RegExp(/api\/Projects\/.*\/datasets\/.*/i) }).as('deleteDataset')
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-0 .cy-actions-btn').first().click()
    cy.get('ul[role=menu] #cy-remove-item').click()
    cy.get('#cy-confirm-ok-btn').click()

    // Manage alert
    cy.wait('@deleteDataset')
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').first().click()

    // Count there's one less dataset
    cy.get('#cy-project-datasets #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "1")
  })

  it('Select current project first dataset (Ouranos 10 files) and open the folder to see the files', () => {
    cy.log('We assume selected Ouranos/PCP dataset should contains 10 NetCDF files')
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-0').first().click()
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-1').should('to.have.lengthOf', 10)
  })

  it('Select current project first dataset (Ouranos 10 files) and trigger action "Visualize All (Aggregated)"', () => {
    cy.get('.cy-project-dataset-item .cy-actions-btn').first().as('actionsBtn')
    cy.triggerVisualize('@actionsBtn', 'cy-visualize-all-agg-item', 5)
    cy.get('#cy-big-color-palette').should('be.visible')
    cy.get('.cy-layerswitcher-dataset-item').should('to.have.lengthOf', 1 + 1)
  })

  it('Select current project first dataset (Ouranos 10 files) and trigger action "Visualize All (Splitted)"', () => {
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-0 .cy-actions-btn').first().as('actionsBtn')
    cy.triggerVisualize('@actionsBtn', 'cy-visualize-all-split-item', 5)
    cy.get('#cy-big-color-palette').should('be.visible')
    cy.get('.cy-layerswitcher-dataset-item').should('to.have.lengthOf', 1 + 1 + 10)
  })

  it('Select current project first dataset (Ouranos 10 files) and trigger action "Download All"', () => {
   cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen')
      cy.get('.cy-project-dataset-item.cy-project-dataset-level-0 .cy-actions-btn').last().click()
      cy.get('ul[role=menu] #cy-download-all-item').click()
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1961.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1962.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1963.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1964.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1965.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1966.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1967.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1968.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1969.nc`)
      cy.get('@windowOpen').should('be.calledWith', `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc`)
      // FIXME: Fix the feature itself since Chrome will prevent from opening 10 windows at once
    })
  })

  it('Select current project first dataset (Ouranos 10 files) first NetCDF file and trigger action "Remove file"', () => {
    cy.route({ method: 'put', url: new RegExp(/api\/Projects\/.*\/datasets\/.*/i) }).as('updateDataset')
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-0').last().click()
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-1 .cy-actions-btn').first().click()
    cy.get('ul[role=menu] #cy-remove-item').click()
    cy.get('#cy-confirm-ok-btn').click()

    // Manage alert
    cy.wait('@updateDataset')
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').first().click()

    // Count there's now 9 files
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-1').should('to.have.lengthOf', 10 - 1)
  })

  it('Select current project first dataset (Ouranos 9 files) and trigger action "Remove"', () => {
    cy.route({ method: 'delete', url: new RegExp(/api\/Projects\/.*\/datasets\/.*/i) }).as('deleteDataset')
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-0 .cy-actions-btn').last().click()
    cy.get('ul[role=menu] #cy-remove-all-item').click()
    cy.get('#cy-confirm-ok-btn').click()

    // Manage alert
    cy.wait('@deleteDataset')
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').first().click()
  })

  it('Test closing tasks', () => {
    cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.removeCurrentProject()
    cy.logout()
  })

})
