
import {PROJECT_NAME, PROJECT_MANAGEMENT_TITLE} from './../constants';

Cypress.Commands.add('createSelectTestProject', () => {
  cy.log("Create TEST Project...")

  // Open section and tab
  cy.get('#cy-project-management').click()
  cy.get('#cy-create-project-tab').click()

  // Create
  cy.get('input#cy-project-name-tf').clear().type(PROJECT_NAME + new Date().toISOString()) 
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

  cy.ensureSectionOpen('cy-project-management', PROJECT_MANAGEMENT_TITLE)
  cy.get('#cy-delete-project-btn').click()
  cy.get('#cy-confirm-ok-btn').click()

  cy.wait(1000)
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
  cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
})

Cypress.Commands.add('removeCypressTestProjects', () => {
  cy.get('#cy-project-selector button').click()

  // Looping all dropdown elements but stopping at first matching item name
  let found = false
  cy.get('div[role=menu] span').each(($el, index, $list) => {
    // Make sure selected project has cypress project name definition
    cy.log(`Looping '${$el.children().first().children().first().children().first().text()}'`)
    if($el.children().first().children().first().children().first().text().includes(PROJECT_NAME) && !found){
      found = true
      cy.log(`Removing project '${$el.children().first().children().first().children().first().text()}'...`)
      cy.wrap($el).click()
      cy.get('#cy-delete-project-btn').click()
      cy.get('#cy-confirm-ok-btn').click()
      cy.wait(1000)
      cy.get('.notification-container .notification-message h4').should('contain', 'Success')
      cy.get('.notification-container .notification-success').click()
      cy.log(`Removed project ${$el.children().first().children().first().children().first().text()}`)
      cy.removeCypressTestProjects()
    }
  })
})

// First dataset must a be a single file dataset
 Cypress.Commands.add('visualizeFirstSingleFileDataset', () => {
    cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
    cy.get('div[role=menu]').children().should('to.have.lengthOf', 3) // 3 actions attended
    cy.get('div[role=menu] #cy-visualize-item').click() // Trigger action
    cy.get('#cy-sectional-content h1').click() // Close actions menu
})