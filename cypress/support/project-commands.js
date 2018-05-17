
import {
  PROJECT_NAME,
  PROJECT_MANAGEMENT_TITLE,
  TARGETED_CMIP5_DATASET_TITLE
} from './../constants';

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
  cy.route({ method: 'delete', url: new RegExp(/api\/Projects\/.*/i) }).as('deleteProject')

  cy.ensureSectionOpen('cy-project-management', PROJECT_MANAGEMENT_TITLE)
  cy.get('#cy-delete-project-btn').click()
  cy.get('#cy-confirm-ok-btn').click()

  cy.wait('@deleteProject')
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
    cy.route({ method: 'delete', url: new RegExp(/api\/Projects\/.*/i) }).as('deleteProject')
    cy.log(`Looping '${$el.children().first().children().first().children().first().text()}'`)
    if ($el.children().first().children().first().children().first().text().includes(PROJECT_NAME) && !found) {
      found = true
      cy.log(`Removing project '${$el.children().first().children().first().children().first().text()}'...`)
      cy.wrap($el).click()
      cy.get('#cy-delete-project-btn').click()
      cy.get('#cy-confirm-ok-btn').click()
      cy.wait('@deleteProject')
      cy.get('.notification-container .notification-message h4').should('contain', 'Success')
      cy.get('.notification-container .notification-success').click()
      cy.log(`Removed project ${$el.children().first().children().first().children().first().text()}`)
      cy.removeCypressTestProjects()
    }
  })
})

// First dataset must a be a single file dataset
Cypress.Commands.add('visualizeFirstSingleFileDataset', () => {
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetCapabilities.*$/i), method: 'get' }).as('ncwms2GetCapabilities')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMetadata.*$/i), method: 'get' }).as('ncwms2GetMetadata')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMap.*$/i), method: 'get' }).as('ncwms2GetMap')
  cy.get('.cy-project-dataset-item .cy-actions-btn').first().click()
  cy.get('div[role=menu]').children().should('to.have.lengthOf', 3) // 3 actions attended
  cy.get('div[role=menu] #cy-visualize-item').click() // Trigger action
  cy.wait('@ncwms2GetCapabilities').then((xhr) => {
    cy.wrap(xhr.response.body.type).should('eq', 'text/xml')
    cy.wrap(xhr.status).should('eq', 200)
  })
  cy.wait('@ncwms2GetMetadata').then((xhr) => {
    cy.wrap(xhr.response.body.type).should('eq', 'application/json')
    cy.wrap(xhr.status).should('eq', 200)
  })
  cy.wait('@ncwms2GetMap').then((xhr) => {
    cy.wrap(xhr.response.body.type).should('eq', 'text/xml')
    // Error <ServiceExceptionReport> Must provide a value for VERSION attended tho
    cy.wrap(xhr.status).should('eq', 200)
  })
  cy.get('#cy-sectional-content h1').click() // Close actions menu
})

// Add CMIP5 dataset and visualize it
Cypress.Commands.add('addCMIP5DatasetThenVisualize', () => {
  cy.get('#cy-search-datasets').click()
  cy.selectCMIP5RCP85PRDayFacets()
  cy.addFirstDatasetToProject()
  cy.get('#cy-project-management').click()
  // cy.log(`FIXME: Attended dataset title: ${TARGETED_CMIP5_DATASET_TITLE}`)
  // cy.get('.cy-dataset-single-file-title').first().should('contain', TARGETED_CMIP5_DATASET_TITLE)
  cy.visualizeFirstSingleFileDataset()
})