import {
	BASIC_WORKFLOW,
	BASIC_WORKFLOW_NAME,
	DATA_PROCESSING_TITLE,
	MISSING_PROVIDER_WORKFLOW,
	SCIENTIFIC_WORKFLOWS_LABEL,
	SEARCH_DATASETS_TITLE,
	SHAPEFILE_NAME_NESTATES,
	WORKFLOW_INPUT_FEATUREIDS,
	WORKFLOW_INPUT_DOWNLOAD_URL,
	WORKFLOW_INPUT_TYPENAME,
  IDENTIFIER_THREDDS_URLS,
  IDENTIFIER_SUBSET_WFS
} from './../constants';

describe('Test single wps and workflow monitoring', () => {
	beforeEach(() => {
		cy.initBeforeEach()
	})

	it('Test initialisation', () => {
		cy.init()
		cy.login()
		cy.createSelectTestProject() // @testProjectId is the current test project id
		cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
	})

	it('Create a basic workflow', () => {
		cy.createWorkflow(BASIC_WORKFLOW)
		cy.get('.notification-container .notification-message h4').should('contain', 'Success')
		cy.get('.notification-container .notification-success').click()
		cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '1')
		cy.get('.cy-workflow-item > div > div > div').last().should('contain', BASIC_WORKFLOW_NAME)
	})

	it('Select created subset workflow (last) and trigger action "Configure & Run"', () => {
		cy.get('.cy-workflow-item .cy-actions-btn').last().click()
		cy.get('div[role=menu] #cy-configure-run-item').click()
		cy.get('#cy-configure-run-step').children().last().should('contain', BASIC_WORKFLOW_NAME)
		cy.wait(5000) // Parsing workflow time is actually hard to predict
	})

	it('Process form should contains 4 inputs with predefined default values', () => {
		cy.get('.cy-process-form-field').as('fields')
		cy.get('.cy-process-form-field').should('to.have.lengthOf', 4)
		cy.get(`.cy-process-form-field [data-cy-name="${IDENTIFIER_THREDDS_URLS}.url"] input`).should('have.value', WORKFLOW_INPUT_DOWNLOAD_URL)
		cy.get(`.cy-process-form-field [data-cy-name="${IDENTIFIER_SUBSET_WFS}.typename"] input`).should('have.value', WORKFLOW_INPUT_TYPENAME)
		cy.get(`.cy-process-form-field [data-cy-name="${IDENTIFIER_SUBSET_WFS}.featureids"] input`).should('have.value', WORKFLOW_INPUT_FEATUREIDS)
    cy.get(`.cy-process-form-field [data-cy-name="${IDENTIFIER_SUBSET_WFS}.mosaic"] input`).should('be.checked')
  })

	it('Launching the workflow should be a success', () => {
    cy.route({ method: 'post', url: new RegExp(/.*phoenix\/processes\/execute.*/i) }).as('phoenixExecute')
    cy.route({ method: 'post', url: "/api/Jobs?**" }).as('addJob')
    cy.get('#cy-execute-process-btn').click().then(() => {
      expect(localStorage.getItem('executed_workflow')).to.not.be.null
      cy.wait(['@phoenixExecute', '@addJob'])
      cy.get('.notification-container .notification-message h4').should('contain', 'Success')
      cy.get('.notification-container .notification-success').click({ multiple: true })
    })
  })
  
  it('TODO: Monitoring should now have one pending task', () => {
		
	})

	it('Test closing tasks', () => {
			cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)
			cy.removeCurrentProject()
			cy.logout()
	})

})
