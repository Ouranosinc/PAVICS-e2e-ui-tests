describe('Visit app', () => {
    it('Visit app', () => {
        cy.log("Initialisation...")
        cy.clearCookie('auth_tkt')
        cy.clearLocalStorage()
        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.fetch = null
            }
        })
    })
  })