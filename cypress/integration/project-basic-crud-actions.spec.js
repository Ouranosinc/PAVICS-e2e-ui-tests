import * as constants from './../constants';
const CURRENT_DATE_TIME = new Date().toISOString();

describe('Test project basic CRUD actions', () => {
  beforeEach(() => {
		cy.initBeforeEach()
  })

  it('Init basic stuff', () => {
    cy.init()
    cy.login()
  })

  it('Open Project Management panel', () => {
    cy.ensureSectionOpen('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
  })

  it('Create new project', () => {
    cy.route({ method: 'post', url: new RegExp(/api\/Projects/i) }).as('createProject')
    cy.get('#cy-create-project-tab').click()
    cy.get('input#cy-project-name-tf').clear().type(constants.PROJECT_NAME + CURRENT_DATE_TIME)
    cy.get('textarea#cy-project-description-tf').clear().type(constants.PROJECT_DESCRIPTION)
    cy.get('#cy-create-project-btn').click()
    cy.wait('@createProject')
    cy.shouldNotifySuccess()
  })

  it('New project should be automatically selected', () => {
    cy.get('.notification-container .notification-message h4').should('contain', 'Information')
    cy.get('.notification-container .notification-message div')
      .should('contain', `Project '${constants.PROJECT_NAME + CURRENT_DATE_TIME}' has been selected as the current project.`)
    cy.get('.notification-container .notification-info').click()
  })

  it('Edit project properties', () => {
    cy.get('#cy-current-project-tab').click()
    cy.get('input#cy-project-name-tf').clear().type(constants.PROJECT_NAME + CURRENT_DATE_TIME + constants.ABC_SUFFIX)
    cy.get('textarea#cy-project-description-tf').clear().type(constants.PROJECT_DESCRIPTION + constants.ABC_SUFFIX)
    cy.get('#cy-save-project-btn').click()
    cy.shouldNotifySuccess()
  })

  it('Delete created/selected/edited project', () => {
    cy.get('#cy-delete-project-btn').click()
    cy.get('#cy-confirm-ok-btn').click()
    cy.shouldNotifySuccess()
  })

  it('No project should be selected', () => {
    // TODO: No project should be selected at this point
    cy.get('label[for=cy-project-selector]').should('contain', constants.CURRENT_PROJECT_LABEL)
  })

  it('Close Project Management panel', () => {
    cy.ensureSectionClose('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
  })

})
