
Cypress.Commands.add('login', (seedData = 'fixture:todos') => {
    cy.log("Login...")
    cy.getCookie('auth_tkt').should('not.exist')
    cy.get('#cy-account-management').click()
    // TODO: Select Ziggurat explicitely
    cy.get('#cy-login-user-tf').clear().type(Cypress.env('MAGPIE_USERNAME'))
    cy.get('#cy-login-password-tf').clear().type(Cypress.env('MAGPIE_PASSWORD'))
    cy.get('#cy-login-btn').click()
    cy.wait(2000)
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').click()
    cy.getCookie('auth_tkt').should('exist')
    cy.get('#cy-account-management').click()
  })
  
  Cypress.Commands.add('logout', (seedData = 'fixture:todos') => {
    cy.log("Logout...")
    cy.getCookie('auth_tkt').should('exist')
    cy.get('#cy-account-management').click()
    cy.get('#cy-logout-btn').click()
    cy.wait(2000)
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').click()
    cy.clearCookie('auth_tkt') // TODO: Shouldn't be usefull after completion of https://github.com/Ouranosinc/pavics-sdi/issues/33
    cy.getCookie('auth_tkt').should('not.exist')
    cy.get('#cy-account-management').click()
  })