describe('App initialization', () => {
  it('Loads projects and select project #1 on page load', () => {
    cy.visit('/')
    // Close alert that notify a project has been selected
    cy.get('.notification-container .notification-message h4').should('contain', 'Information')
    // Close Visualize panels
    cy.get('button.cy-minimize-btn').click({multiple: true})
    /*each(($el, index, $list) => {
      $el.click().end()
    })*/
  })
})
