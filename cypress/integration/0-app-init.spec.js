describe('App initialization', () => {
  it('Init basic stuff', () => {
    cy.init()
  })

  it('Create TEST project', () => {
    cy.createSelectTestProject()
  })

  it('Login', () => {
    cy.login()
  })
})
