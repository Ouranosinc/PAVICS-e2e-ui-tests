import * as constants from './../constants';

Cypress.Commands.add('init', (onOpenHook = false) => {
  // Intercept window.open() events
  let hook = {
      onBeforeLoad(win) {
          cy.stub(win, 'open').as('windowOpen')
      }
  }
  cy.log("Initialisation...")
  // cy.clearCookies()
  cy.clearCookie('auth_tkt')

  cy.visit('/', (onOpenHook)? hook: null)

  // Remove all alerts (selected project(info), logged(success))
  cy.get('.notification-container .notification').click({multiple:true})

  // Minimize Visualize panels
  cy.get('button.cy-minimize-btn').click({multiple: true})
})

Cypress.Commands.add('close', (seedData = 'fixture:todos') => {
  // TODO
})

Cypress.Commands.add('login', (seedData = 'fixture:todos') => {
  cy.log("Login...")
  cy.getCookie('auth_tkt').should('not.exist')
  cy.get('#cy-account-management').click()
  // TODO: Select Ziggurat explicitely
  cy.get('#cy-login-user-tf').clear().type(Cypress.env('MAGPIE_USERNAME'))
  cy.get('#cy-login-password-tf').clear().type(Cypress.env('MAGPIE_PASSWORD'))
  cy.get('#cy-login-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
  cy.wait(1000)
  cy.getCookie('auth_tkt').should('exist')
  cy.get('#cy-account-management').click()
})

Cypress.Commands.add('logout', (seedData = 'fixture:todos') => {
  cy.log("Logout...")
  cy.getCookie('auth_tkt').should('exist')
  cy.get('#cy-account-management').click()
  cy.get('#cy-logout-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
  cy.clearCookie('auth_tkt') // TODO: Shouldn't be usefull after completion of https://github.com/Ouranosinc/pavics-sdi/issues/33
  cy.wait(1000)  
  cy.getCookie('auth_tkt').should('not.exist')
  cy.get('#cy-account-management').click()
})

Cypress.Commands.add('createSelectTestProject', () => {
  cy.log("Create TEST Project...")

  // Open section and tab
  cy.get('#cy-project-management').click()
  cy.get('#cy-create-project-tab').click()

  // Create
  cy.get('input#cy-project-name-tf').clear().type(constants.PROJECT_NAME + new Date().toISOString()) 
  cy.get('#cy-create-project-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()

  // Select
  cy.get('#cy-current-project-tab').click()
  cy.get('#cy-project-selector button').click()
  cy.get('div[role=menu]').children().last().click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Information')
  cy.get('.notification-container .notification-info').click()

  // Note created project Id in @testProjectId
  cy.get('#cy-project-name-tf').invoke('attr', 'data-cy-project-id').as('testProjectId')

  // Close section
  cy.get('#cy-project-management').click()
})

Cypress.Commands.add('selectProjectByProjectId', (id) => {
  // Open section and tab
  cy.get('#cy-project-management').click()
  cy.get('#cy-current-project-tab').click()

  cy.get('#cy-project-selector button').click()
  cy.get(`div[role=menu] [data-cy-item-project-id=${id}]`).click() // Select by id

  cy.get('.notification-container .notification-message h4').should('contain', 'Information')
  cy.get('.notification-container .notification-info').click()
})

Cypress.Commands.add('removeProjectByProjectId', (id) => {
  cy.selectProjectByProjectId(id)
  cy.removeCurrentProject()
})

Cypress.Commands.add('removeCurrentProject', () => {
  // TODO: Remove project by id, use selectProjectByProjectId then 
  cy.log("Remove current (test) project...")

  cy.ensureSectionOpen('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
  cy.get('#cy-delete-project-btn').click()
  cy.get('#cy-confirm-ok-btn').click()

  cy.wait(1000)
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
  cy.ensureSectionClose('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
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

// Search datasets section should be loaded as well as some facets
Cypress.Commands.add('selectFacet', (key, value) => {
  cy.get(`#cy-search-facet-${key} button`).click()
  cy.get(`#cy-search-facet-${key}-${value} input`).check()
  cy.get(`#cy-search-facet-${key} button`).click() // TODO a backdrop click outside should also work eventually
})

// Search datasets section should be loaded and some facets should be selected
Cypress.Commands.add('resetFacets', (key, value) => {
  cy.get('#cy-reset-criterias-btn').click()
  cy.get('#cy-search-no-results-sh').should('contain', 'No results found.')
  cy.get('#cy-reset-criterias-btn').should('have.attr', 'disabled')
  cy.get('#cy-save-criterias-btn').should('have.attr', 'disabled')
})

// Search datasets section should be loaded and some facets should be selected
Cypress.Commands.add('saveSearchCriterias', (name) => {
  cy.get('#cy-criterias-name-tf').clear().type(name)
  cy.get('#cy-save-criterias-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
})
