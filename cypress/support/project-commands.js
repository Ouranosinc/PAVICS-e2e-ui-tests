
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

  // Project is now auto-selected
  cy.get('.notification-container .notification-message h4').should('contain', 'Information')
  cy.get('.notification-container .notification-info').click()

  // Note created project Id in @testProjectId
  cy.get('#cy-current-project-tab').click()
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

Cypress.Commands.add('shareProjectToUser', (username) => {
  cy.get('#cy-project-management').click()
  cy.route({ method: 'post', url: new RegExp(/api\/Projects\/.*\/shareToUser/i) }).as('shareProjectToUser')
  cy.get('#cy-share-project-tab').click()
  cy.get('#cy-project-share-user-tf').clear().type(username)
  cy.get('#cy-share-project-btn').click()
  cy.get('#cy-confirm-ok-btn').click()
  cy.wait('@shareProjectToUser')
  cy.wait(1000)
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
})

Cypress.Commands.add('shareProjectWriteToGroup', (groupname) => {
  cy.get('#cy-project-management').click()
  cy.route({ method: 'post', url: new RegExp(/api\/Projects\/.*\/shareToGroup/i) }).as('shareProjectToGroup')
  cy.get('#cy-share-project-tab').click()

  // Select group and write permission
  cy.get('input#cy-share-type-group-rb').check()
  cy.get('#cy-group-selector button').click()
  cy.get(`div[role=menu] [data-cy-item-group=${groupname}]`).click()
  cy.get('input#cy-write-permission-cb').check()

  cy.get('#cy-share-project-btn').click()
  cy.get('#cy-confirm-ok-btn').click()
  cy.wait('@shareProjectToGroup')
  cy.wait(1000)
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
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
  cy.get('div[role=menu]').each(($el, index, $list) => {
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

// Add CMIP5 dataset and visualize it
Cypress.Commands.add('addCMIP5DatasetThenVisualize', () => {
  cy.get('#cy-search-datasets').click()
  cy.selectCMIP5RCP85PRDayFacets()
  cy.addFirstDatasetToProject()
  cy.get('#cy-project-management').click()
  cy.log(`FIXME: Attended dataset title: ${TARGETED_CMIP5_DATASET_TITLE}`)
  cy.get('.cy-dataset-single-file-title').first().should('contain', TARGETED_CMIP5_DATASET_TITLE)
  cy.get('.cy-project-dataset-item .cy-actions-btn').first().as('actionsBtn')
  cy.triggerVisualize('@actionsBtn', 'cy-visualize-item')
})