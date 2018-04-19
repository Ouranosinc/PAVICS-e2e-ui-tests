describe('Test project management section', () => {
    /*beforeEach(() => {
      cy.visit('/')
    })*/
    let projectName = 'Project Cypress Test';
    let projectDescription ='Cypress created this project description';
    let suffix = 'ABC';

    it('Init basic stuff', () => {
        cy.init()
    })

    it('Open Project Management panel', () => {
        cy.ensureSectionOpen('cy-project-management', 'Project Management')
    })

    it('Create new project', () => {
        cy.get('#cy-create-project-tab').click()
        cy.get('input#cy-project-name-tf').clear().type(projectName) 
        cy.get('textarea#cy-project-description-tf').clear().type(projectDescription)
        cy.get('#cy-create-project-btn').click()
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()
    })

    it('Select a new project', () => {
        cy.get('#cy-current-project-tab').click()
        cy.get('#cy-project-selector button').click()
        cy.get('div[role=menu]').children().should('to.have.length.above', 1)
        cy.get('div[role=menu]').children().last().click()
        cy.get('input#cy-project-name-tf').should('have.value', projectName)
        cy.get('textarea#cy-project-description-tf').should('have.value', projectDescription)
        cy.get('.notification-container .notification-message h4').should('contain', 'Information')
        cy.get('.notification-container .notification-message div')
            .should('contain', `Project '${projectName}' has been selected as the current project.`)
        cy.get('.notification-container .notification-info').click()
    })

    it('Edit project properties', () => {
        cy.get('input#cy-project-name-tf').clear().type(projectName + suffix) 
        cy.get('textarea#cy-project-description-tf').clear().type(projectDescription + suffix) 
        cy.get('#cy-save-project-btn').click()
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()
    })

    it('Delete created/selected/edited project', () => {
        cy.get('#cy-delete-project-btn').click()
        // Not actually possible atm with materialui dialog
        // cy.get('#cy-confirm-dialog').should('be.visible')
        cy.get('#cy-confirm-ok-btn').click()
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').first().click()
    })

    it('Close Project Management panel', () => {
        cy.ensureSectionClose('cy-project-management', 'Project Management')
    })

})
  