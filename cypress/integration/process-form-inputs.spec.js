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
    cy.route({method: 'get', url: new RegExp(/api\/Projects\/.*\/workflows/i)}).as('getWorkflows')
    cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
    cy.wait('@getWorkflows')
  });

  it('Create a basic workflow', () => {
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '4');
    cy.createWorkflow(SINGLE_ALLOWED_VALUES_TASK_WORKFLOW);
    cy.shouldNotifySuccess()
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '5'); // 4 + 1
    cy.get('.cy-workflow-item > div > div > span').last().should('contain', WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME)
  });

  it('Select allowed values workflow and trigger action "Configure & Run"', () => {
    // TODO: Values are pretty much hardcoded at this point
    cy.route({method: 'get', url: "/phoenix/processesList?provider=flyingpigeon"}).as('getProviderFlyingpigeon')
    cy.route({method: 'get', url: "/phoenix/inputs?provider=flyingpigeon&process=subset_countries"}).as('getProcessSubsetCountries')
    cy.get('.cy-workflow-item .cy-actions-btn').last().click();
    cy.get('ul[role=menu] #cy-configure-run-item').click();
    cy.wait('@getProviderFlyingpigeon').then((window) => {
			cy.wait('@getProcessSubsetCountries')
      cy.get('#cy-configure-run-step').children().last().should('contain', WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME);
		})
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
