import * as constants from './../constants';

Cypress.Commands.add('init', () => {
  cy.log("Initialisation...")

  // Clear any persisted data from previous tests
  cy.clearCookie('auth_tkt')
  cy.clearLocalStorage()

  // Visit main page
  cy.visit('/', {
    onBeforeLoad(win) {
      // Cypress doesn't support fetch, using polyfill whatwg-fetch will transform fetch into XHR which are supported by Cypress
      // https://github.com/cypress-io/cypress/issues/95
      win.fetch = null

      // Intercept window.open which is used for downloading files
      cy.stub(win, 'open').as('windowOpen')
    }
  })

  // cy.route({method: 'get', url: new RegExp(/geoserver\/wms?.*request=GetCapabilities.*/i)}).as('geoserverGetCapabilities')
  // cy.route({method: 'get', url: new RegExp(/api\/Projects.*/i)}).as('getProjects')
  // cy.route('/wps/pavicsearch?**').as('getFacets') // Triggered for facets only
  // // TODO: Eventually valid results
  // cy.wait(['@getProjects', '@geoserverGetCapabilities','@getFacets'])

  // Minimize Visualize panels
  cy.get('button.cy-minimize-btn').click({ multiple: true })
})

Cypress.Commands.add('initBeforeEach', (seedData = 'fixture:todos') => {
  // Server should be started before every test
  cy.server({ stub: false })
})


Cypress.Commands.add('close', (seedData = 'fixture:todos') => {
  // TODO: On test close actions...
})

Cypress.Commands.add('ensureSectionOpen', (sectionId, title) => {
  cy.log("Open section " + sectionId)
  // Content shouldn't be visible
  cy.get('#cy-sectional-content').should('not.be.visible')

  // Click menu section
  cy.get('#' + sectionId).click()

  // Sectional menu should be visible with the right content
  cy.get('#cy-sectional-content').should('be.visible')
  cy.get('#cy-sectional-content h1').should('contain', title)
})

Cypress.Commands.add('ensureSectionClose', (sectionId, title) => {
  cy.log("Close section " + sectionId)
  // Sectional menu should be visible with the right content
  cy.get('#cy-sectional-content').should('be.visible')
  cy.get('#cy-sectional-content h1').should('contain', title)

  // Click menu section
  cy.get('#' + sectionId).click()

  // Content shouldn't be visible anymore
  cy.get('#cy-sectional-content').should('not.be.visible')
})