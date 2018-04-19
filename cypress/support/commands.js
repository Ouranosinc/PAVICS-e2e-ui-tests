

Cypress.Commands.add('init', (seedData = 'fixture:todos') => {
  cy.visit('/')
  // Remove information alert
  cy.get('.notification-container .notification-info').click()
  // Minimize Visualize panels
  cy.get('button.cy-minimize-btn').click({multiple: true})

})

Cypress.Commands.add('close', (seedData = 'fixture:todos') => {
  // TODO
})

Cypress.Commands.add('login', (seedData = 'fixture:todos') => {
  cy.visit('/')
})

Cypress.Commands.add('logout', (seedData = 'fixture:todos') => {
  cy.visit('/')
})

Cypress.Commands.add('createSelectTestProject', () => {
  // Open section and tab
  cy.get('#cy-project-management').click()
  cy.get('#cy-create-project-tab').click()
  // Create
  cy.get('input#cy-project-name-tf').clear().type('TEST') 
  cy.get('#cy-create-project-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
  // Select
  cy.get('#cy-current-project-tab').click()
  cy.get('#cy-project-selector button').click()
  cy.get('div[role=menu]').children().last().click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Information')
  cy.get('.notification-container .notification-info').click()
  // Close section
  cy.get('#cy-project-management').click()
})

Cypress.Commands.add('removeTestProject', () => {
  cy.ensureSectionOpen('cy-project-management', 'Project Management')
  cy.get('#cy-delete-project-btn').click()
  cy.get('#cy-confirm-ok-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
  cy.ensureSectionClose('cy-project-management', 'Project Management')
})

Cypress.Commands.add('ensureSectionOpen', (sectionId, title) => {
  // Content shouldn't be visible
  cy.get('#cy-sectional-content').should('not.be.visible')

  // Click menu section
  cy.get('#' + sectionId).click()

  // Sectional menu should be visible with the right content
  cy.get('#cy-sectional-content').should('be.visible')
  cy.get('#cy-sectional-content h1').should('contain', title)
})

Cypress.Commands.add('ensureSectionClose', (sectionId, title) => {
  // Sectional menu should be visible with the right content
  cy.get('#cy-sectional-content').should('be.visible')
  cy.get('#cy-sectional-content h1').should('contain', title)

  // Click menu section
  cy.get('#' + sectionId).click()

  // Content shouldn't be visible anymore
  cy.get('#cy-sectional-content').should('not.be.visible')
})