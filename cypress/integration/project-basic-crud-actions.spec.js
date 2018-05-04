import * as constants from './../constants';
const CURRENT_DATE_TIME = new Date().toISOString();

describe('Test project basic CRUD actions', () => {
    it('Init basic stuff', () => {
        cy.init()
    })

    it('Open Project Management panel', () => {
        cy.ensureSectionOpen('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
    })

    it('Create new project', () => {
        cy.get('#cy-create-project-tab').click()
        cy.get('input#cy-project-name-tf').clear().type(constants.PROJECT_NAME + CURRENT_DATE_TIME) 
        cy.get('textarea#cy-project-description-tf').clear().type(constants.PROJECT_DESCRIPTION)
        cy.get('#cy-create-project-btn').click()
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()
    })

    it('Select a new project', () => {
        cy.get('#cy-current-project-tab').click()
        cy.get('#cy-project-selector button').click()
        cy.get('div[role=menu]').children().should('to.have.length.above', 1)
        cy.get('div[role=menu]').children().last().click()
        cy.get('input#cy-project-name-tf').should('have.value', constants.PROJECT_NAME + CURRENT_DATE_TIME)
        cy.get('textarea#cy-project-description-tf').should('have.value', constants.PROJECT_DESCRIPTION)
        cy.get('.notification-container .notification-message h4').should('contain', 'Information')
        cy.get('.notification-container .notification-message div')
            .should('contain', `Project '${constants.PROJECT_NAME + CURRENT_DATE_TIME}' has been selected as the current project.`)
        cy.get('.notification-container .notification-info').click()

        // TODO: No datasets/criterias should be seen at this point
    })

    it('Edit project properties', () => {
        cy.get('input#cy-project-name-tf').clear().type(constants.PROJECT_NAME + CURRENT_DATE_TIME + constants.ABC_SUFFIX) 
        cy.get('textarea#cy-project-description-tf').clear().type(constants.PROJECT_DESCRIPTION + constants.ABC_SUFFIX) 
        cy.get('#cy-save-project-btn').click()
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()

        // TODO: Unselect / Leave / Come back
        // TODO: Medatas should include suffixes
    })

    it('Delete created/selected/edited project', () => {
        cy.get('#cy-delete-project-btn').click()
        // Not actually possible atm with materialui dialog
        // cy.get('#cy-confirm-dialog').should('be.visible')
        cy.get('#cy-confirm-ok-btn').click()
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').first().click()
    })

    it('No project should be selected', () => {
        // TODO: No project should be selected at this point
        cy.get('label[for=cy-project-selector]').should('contain', constants.CURRENT_PROJECT_LABEL)
    })

    it('Close Project Management panel', () => {
        cy.ensureSectionClose('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
    })

})
  