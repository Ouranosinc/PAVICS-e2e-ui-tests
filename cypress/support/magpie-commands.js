Cypress.Commands.add('loginMagpie', (username = Cypress.env('MAGPIE_ADMIN_USERNAME'), password = Cypress.env('MAGPIE_ADMIN_PASSWORD')) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/login`)
  cy.get('.new_item_form:first input[name=user_name]').clear().type(username)
  cy.get('.new_item_form:first input[name=password]').clear().type(password)
  cy.get('.new_item_form:first input[type=submit]').click()
  cy.getCookie('auth_tkt').should('exist')
})

Cypress.Commands.add('logoutMagpie', () => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}`)
  cy.get(`.header button[onclick="location.href='${Cypress.config().baseUrl}${Cypress.env('MAGPIE_PATH')}/ui/logout'"`).click()
  cy.getCookie('auth_tkt').should('not.exist')
})

Cypress.Commands.add('editMagpieUser', (username) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/users${username}/default`)
  cy.get('.new_item_form:first input[name=user_name]').clear().type(username)
  cy.get('.new_item_form:first input[name=password]').clear().type(password)
  cy.get('.new_item_form:first input[type=submit]').click()
})

Cypress.Commands.add('addMagpieUserGroup', (username, groupname) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/users/${username}/default`)
  cy.get(`#edit_membership input[value=${groupname}]`).check()
})

Cypress.Commands.add('removeMagpieUserGroup', (username, groupname) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/users/${username}/default`)
  cy.get(`#edit_membership input[value=${groupname}]`).uncheck()
})

Cypress.Commands.add('addMagpieUserResourcePermission', (username, service, permission, resourceId) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/users/${username}/${service}`)
  cy.get(`.current_tab_panel form#${resourceId} input[value=${permission}]`).check()
})

Cypress.Commands.add('addMagpieUserServiceRootPermission', (username, service, permission) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/users/${username}/${service}`)
  cy.get(`.current_tab_panel form:first input[value=${permission}]`).check()
})

Cypress.Commands.add('removeMagpieUserResourcePermission', (username, service, permission, resourceId) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/users/${username}/${service}`)
  cy.get(`.current_tab_panel form#${resourceId} input[value=${permission}]`).uncheck()
})

Cypress.Commands.add('removeMagpieUserServiceRootPermission', (username, service, permission) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/users/${username}/${service}`)
  cy.get(`.current_tab_panel form:first input[value=${permission}]`).uncheck()
})

Cypress.Commands.add('addMagpieGroupResourcePermission', (groupname, service, permission, resourceId) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/groups/${groupname}/${service}`)
  cy.get(`.current_tab_panel form#${resourceId} input[value=${permission}]`).check()
})

Cypress.Commands.add('addMagpieGroupServiceRootPermission', (groupname, service, permission) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/groups/${groupname}/${service}`)
  cy.get(`.current_tab_panel form:first input[value=${permission}]`).check()
})

Cypress.Commands.add('removeMagpieGroupResourcePermission', (groupname, service, permission, resourceId) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/groups/${groupname}/${service}`)
  cy.get(`.current_tab_panel form#${resourceId} input[value=${permission}]`).uncheck()
})

Cypress.Commands.add('removeMagpieGroupServiceRootPermission', (groupname, service, permission) => {
  cy.visit(`${Cypress.env('MAGPIE_PATH')}/ui/groups/${groupname}/${service}`)
  cy.get(`.current_tab_panel form:first input[value=${permission}]`).uncheck()
})