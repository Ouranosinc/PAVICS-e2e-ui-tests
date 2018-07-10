
Cypress.Commands.add('login', (username = Cypress.env('MAGPIE_ADMIN_USERNAME'), password = Cypress.env('MAGPIE_ADMIN_PASSWORD')) => {
  cy.route('/login').as('login')
  cy.route('/session').as('session')

  cy.getCookie('auth_tkt').should('not.exist')
  cy.get('#cy-account-management').click()
  // TODO: Select Ouranos explicitely
  cy.get('#cy-login-user-tf').clear().type(username)
  cy.get('#cy-login-password-tf').clear().type(password)
  cy.get('#cy-login-btn').click()

  // cy.wait('@login') FIXME: Migth actually not be called
  cy.wait('@session')

  cy.get('.notification-container .notification-message h4').should('contain', 'Success')
  cy.get('.notification-container .notification-success').click()

  cy.wait(3000)

  // Could be either Information (auto-selected project) or Warning (no project to be selected)
  cy.get('.notification-container .notification').click()

  // Remove all alerts: selected project(info), logged(success),
  // cy.get('.notification-container .notification').click({ multiple: true })

  cy.getCookie('auth_tkt').should('exist')
  cy.get('#cy-account-management').click()
})

Cypress.Commands.add('logout', () => {
  cy.route('/logout').as('logout')
  cy.getCookie('auth_tkt').should('exist')
  cy.get('#cy-account-management').click()
  cy.get('#cy-logout-btn').click()
  cy.wait('@logout').then(() => {
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').click()
    cy.getCookie('auth_tkt').should('not.exist')
    cy.get('#cy-account-management').click()
  })
})