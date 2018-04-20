

Cypress.Commands.add('init', (seedData = 'fixture:todos') => {
  cy.log("Initialisation...")
  // cy.clearCookies()
  cy.clearCookie('auth_tkt')

  cy.visit('/')

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
  // TODO: SELECT ZIGGURAT
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
  cy.log("Remove TEST Project...")
  cy.ensureSectionOpen('cy-project-management', 'Project Management')
  cy.get('#cy-delete-project-btn').click()
  cy.get('#cy-confirm-ok-btn').click()
  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()
  cy.ensureSectionClose('cy-project-management', 'Project Management')
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