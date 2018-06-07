import {
  SEARCH_DATASETS_TITLE,
  DATA_PROCESSING_TITLE,
  SCIENTIFIC_WORKFLOWS_LABEL,
  SINGLE_ALLOWED_VALUES_TASK_WORKFLOW,
  WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME,
  BASIC_WORKFLOW,
  BASIC_WORKFLOW_NAME,
  BASIC_WORKFLOW_JSON,
  WORKFLOW_INPUT_DOWNLOAD_URL,
  WORKFLOW_INPUT_TYPENAME,
  WORKFLOW_INPUT_FEATUREIDS,
  MISSING_PROVIDER_WORKFLOW,
  WORKFLOW_INPUT_TYPENAME_ALT,
  WORKFLOW_INPUT_FEATUREIDS_ALT
} from './../constants';


describe('Test process form inputs allowed values', () => {
  beforeEach(() => {
		cy.initBeforeEach()
  })
  
  it('Test initialisation', () => {
    cy.init();
    cy.login()
    cy.createSelectTestProject(); // @testProjectId is the current test project id
    cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
  });

  it('Create a basic workflow', () => {
    cy.createWorkflow(SINGLE_ALLOWED_VALUES_TASK_WORKFLOW);
    cy.get('.notification-container .notification-message h4').should('contain', 'Success');
    cy.get('.notification-container .notification-success').click();
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '1');
    cy.get('.cy-workflow-item > div > div > div').last().should('contain', WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME)
  });

  it('Select allowed values workflow and trigger action "Configure & Run"', () => {
    cy.get('.cy-workflow-item .cy-actions-btn').last().click();
    cy.get('div[role=menu] #cy-configure-run-item').click();
    cy.get('#cy-configure-run-step').children().last().should('contain', WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME);
    cy.wait(4000);
  });

  it('Form inputs should contain exactly one select field', () => {
    expect(localStorage.getItem('executed_workflow')).to.be.null;
    cy.get('.cy-workflow-input-select-field').should('to.have.lengthOf', 1);
  });

  it('TODO: Validate select input allowed values', () => {
    
  });

  it('TODO: Validate textfield form input', () => {
    
  });

  it('TODO: Validate checkbox form input', () => {
    
  });

  it('TODO: Validate datetime form input', () => {
    
  });

  it('TODO: Validate input with multiple values (minOccurs/maxOccurs)', () => {
    
  });

  it('Test closing tasks', () => {
    cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE);
    cy.removeCurrentProject();
  })

});
