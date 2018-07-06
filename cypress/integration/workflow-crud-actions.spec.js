import {
  SEARCH_DATASETS_TITLE,
  DATA_PROCESSING_TITLE,
  SCIENTIFIC_WORKFLOWS_LABEL,
  BASIC_WORKFLOW_NAME,
  BASIC_WORKFLOW,
  INVALID_WORKFLOW,
  NO_WORKFLOWS_FOUND_LABEL,
  ABC_SUFFIX
} from './../constants';

// Attempt to do cypress attended pure-test pattern (Needed for the Download feature)

describe('Test workflow CRUD actions', () => {
  beforeEach(() => {
    cy.initBeforeEach()
  })

  it('Test initialisation', () => {
    cy.init()
    cy.login()
    cy.createSelectTestProject() // @testProjectId is the current test project id
    cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
  })

  it('Scientific Workflow tab should be selected by default', () => {
    cy.get('#cy-scientific-workflow-tab > div > div').should('contain', SCIENTIFIC_WORKFLOWS_LABEL)
    // Active tab has a red bottom border
    // cy.get('#cy-scientific-workflow-tab').shoud('have.css', 'rgb(255, 255, 255)')
  })

  it('Scientific Workflow list should contains 4 sample workflows', () => {
    // cy.get('#cy-no-workflow-found').should('contain', NO_WORKFLOWS_FOUND_LABEL)
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '4')
  })

  it('Create an empty workflow should return a warning', () => {
    cy.get('#cy-create-workflow-btn').click()
    cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
    cy.get('.notification-container .notification-warning').click()
  })

  it('Create an invalid workflow should return a warning', () => {
    cy.createWorkflow(INVALID_WORKFLOW)
    cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
    cy.get('.notification-container .notification-warning').click()
    // No workflow added
  })

  it('Create a basic workflow should return a success', () => {
    cy.createWorkflow(BASIC_WORKFLOW)
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').click()
  })

  it('There should be one listed workflow with the name we specified', () => {
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '5') // 4 + 1
    cy.get('.cy-workflow-item > div > div > div').last().should('contain', BASIC_WORKFLOW_NAME)
  })

  it('Edit the newly created workflow by changing his name', () => {
    cy.get('.cy-workflow-item .cy-actions-btn').last().click()
    cy.get('ul[role=listbox] #cy-edit-item').click()
    cy.get('#cy-confirm-edit-workflow-tf').clear().type(BASIC_WORKFLOW.replace(BASIC_WORKFLOW_NAME, BASIC_WORKFLOW_NAME + ABC_SUFFIX))
    cy.get('#cy-confirm-save-btn').click()
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').click()
  })

  it('There should be one listed workflow with the new name we just edited', () => {
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '5') // 4 + 1
    cy.get('.cy-workflow-item > div > div > div').last().should('contain', BASIC_WORKFLOW_NAME + ABC_SUFFIX)
  })

  it('Remove the workflow', () => {
    cy.get('.cy-workflow-item .cy-actions-btn').last().click()
    cy.get('ul[role=listbox] #cy-delete-item').click()
    cy.get('#cy-confirm-ok-btn').click()
    cy.get('.notification-container .notification-message h4').should('contain', 'Success')
    cy.get('.notification-container .notification-success').first().click()
  })

  it('Scientific Workflow list should contain only 4 sample again', () => {
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '4')
    // cy.get('#cy-no-workflow-found').should('contain', NO_WORKFLOWS_FOUND_LABEL)
  })

  it('Test closing tasks', () => {
    cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)
    cy.removeCurrentProject()
    cy.logout()
  })

})
