import * as constants from './../constants';

Cypress.Commands.add('init', (onOpenHook = true) => {
  // Intercept window.open() events
  // Needed for Download actions validations
  let hook = {
      onBeforeLoad(win) {
        // Cypress doesn't support fetch, using polyfill whatwg-fetch will transform fetch into XHR which are supported by Cypress
        // https://github.com/cypress-io/cypress/issues/95
        win.fetch = null

        // Intercept window.open which is used for downloading files
        cy.stub(win, 'open').as('windowOpen')
      }
  }
  cy.log("Initialisation...")
  cy.clearCookie('auth_tkt')
  cy.clearLocalStorage()
  cy.visit('/', (onOpenHook)? hook: null)
  // Remove all alerts (selected project(info), logged(success))
  cy.get('.notification-container .notification').click({multiple:true})
  // Minimize Visualize panels
  cy.get('button.cy-minimize-btn').click({multiple: true})
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