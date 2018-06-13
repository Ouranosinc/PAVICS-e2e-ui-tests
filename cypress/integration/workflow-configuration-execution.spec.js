import {
	SUBSET_WORKFLOW,
	SUBSET_WORKFLOW_NAME,
  DATA_PROCESSING_TITLE,
  IDENTIFIER_SUBSET_WFS,
	MISSING_PROVIDER_WORKFLOW,
	SCIENTIFIC_WORKFLOWS_LABEL,
	SEARCH_DATASETS_TITLE,
	SHAPEFILE_NAME_NESTATES,
	WORKFLOW_INPUT_FEATUREIDS,
	WORKFLOW_INPUT_RESOURCE,
	WORKFLOW_INPUT_TYPENAME
} from './../constants';

describe('Test workflow configuration and execution', () => {
	beforeEach(() => {
		cy.initBeforeEach()
	})

	it('Test initialisation', () => {
		cy.init()
		cy.login()
		cy.createSelectTestProject() // @testProjectId is the current test project id
		cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
	})

	it('Create a workflow with a missing provider name should be a success', () => {
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '4')
		cy.createWorkflow(MISSING_PROVIDER_WORKFLOW)
		cy.get('.notification-container .notification-message h4').should('contain', 'Success')
		cy.get('.notification-container .notification-success').click()
		cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '5') // 4 + 1
	})

	it('Create a subset workflow should be a success', () => {
		cy.createWorkflow(SUBSET_WORKFLOW)
		cy.get('.notification-container .notification-message h4').should('contain', 'Success')
		cy.get('.notification-container .notification-success').click()
		cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '6') // 4 + 1 + 1
		cy.get('.cy-workflow-item > div > div > div').last().should('contain', SUBSET_WORKFLOW_NAME)
	})

	it('Select created subset workflow (last) and trigger action "Configure & Run"', () => {
		cy.get('.cy-workflow-item .cy-actions-btn').last().click()
		cy.get('div[role=menu] #cy-configure-run-item').click()
		cy.get('#cy-configure-run-step').children().last().should('contain', SUBSET_WORKFLOW_NAME)
		cy.wait(7000) // Parsing workflow time is actually hard to predict
	})

	it('Process form should contains 4 inputs with predefined default values', () => {
		cy.get('.cy-process-form-field').as('fields')
		cy.get('.cy-process-form-field').should('to.have.lengthOf', 4)
		cy.get(`.cy-process-form-field input[name="${IDENTIFIER_SUBSET_WFS}.resource"]`).should('have.value', WORKFLOW_INPUT_RESOURCE)
		cy.get(`.cy-process-form-field input[name="${IDENTIFIER_SUBSET_WFS}.typename"]`).should('have.value', WORKFLOW_INPUT_TYPENAME)
		cy.get(`.cy-process-form-field input[name="${IDENTIFIER_SUBSET_WFS}.featureids"]`).should('have.value', WORKFLOW_INPUT_FEATUREIDS)
		cy.get(`.cy-process-form-field input[name="${IDENTIFIER_SUBSET_WFS}.mosaic"]`).should('be.checked')
	})

	it('Modify values of form fields "subset_WFS.typename" and "subset_WFS.featureids"', () => {
		expect(localStorage.getItem('executed_workflow')).to.be.null
		cy.get('.cy-process-form-field input[name="subset_WFS.typename"]').clear().type(WORKFLOW_INPUT_TYPENAME)
		cy.get('.cy-process-form-field input[name="subset_WFS.featureids"]').clear().type(WORKFLOW_INPUT_FEATUREIDS)
	})

	it('Launch the workflow and validate sent values were modified', () => {
		cy.route({ method: 'post', url: new RegExp(/.*phoenix\/processes\/execute.*/i) }).as('phoenixExecute')
		cy.get('#cy-execute-process-btn').click().then(() => {
			cy.log(localStorage.getItem('executed_workflow'))
			expect(localStorage.getItem('executed_workflow')).to.not.be.null
			expect(localStorage.getItem('executed_workflow')).to.not.eq(JSON.stringify(SUBSET_WORKFLOW))
			// Do not expect(localStorage.getItem('executed_workflow')).to.eq(something) 
			// Because workflow is transformed by the platform afterward
			let executed = JSON.parse(localStorage.getItem('executed_workflow'))
			expect(executed.tasks[0].inputs.typename).to.eq(WORKFLOW_INPUT_TYPENAME)
			expect(executed.tasks[0].inputs.featureids).to.eq(WORKFLOW_INPUT_FEATUREIDS)
			// TODO: Fix Mosaic that switched to False for no reason
			expect(executed.tasks[0].inputs.mosaic).to.eq("False")

			cy.wait('@phoenixExecute')
			cy.get('.notification-container .notification-message h4').should('contain', 'Success')
			cy.get('.notification-container .notification-success').click({ multiple: true })
		})
	})

	it('Trying to "Configure & Run" a workflow containing an invalid provider should prompt a warning at parsing phase', () => {
		cy.get('#cy-step-back-btn').click()
		cy.get('.cy-workflow-item .cy-actions-btn').eq(4).click()
		cy.get('div[role=menu] #cy-configure-run-item').click()
		cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
		cy.get('.notification-container .notification-warning').click()
		// Stalled in mode 'Parsing Workflow'
		cy.get('#cy-step-back-btn').click()
  })


	it('TODO: "Launching a workflow with missing required inputs should trigger a warning"', () => {
		// cy.get('.cy-process-form-field input[name="subset_WFS.typename"]').clear()
		// cy.get('.cy-process-form-field input[name="subset_WFS.featureids"]').clear()
		// TODO: Such validation to be implemented
	})

	it('"Add CMIP5 dataset to current project", Visualize it and click Reset dataset button', () => {
		cy.addCMIP5DatasetThenVisualize()
		cy.get('#cy-menu-layer-switcher-toggle a svg').click()
		cy.get('#cy-layerswitcher-datasets-tab').click()
		cy.get('#cy-reset-dataset-btn').click()
	})

	it('Select subset workflow (last) and trigger action "Configure & Run"', () => {
		cy.get('#cy-data-processing').click()
		cy.get('.cy-workflow-item .cy-actions-btn').last().click()
		cy.get('div[role=menu] #cy-configure-run-item').click()
		cy.wait(7000)  // Parsing workflow time is actually hard to predict
	})

	it('"Clear all subset workflow text inputs"', () => {
		cy.get('.cy-process-form-field input[name="subset_WFS.resource"]').clear()
		cy.get('.cy-process-form-field input[name="subset_WFS.typename"]').clear()
		cy.get('.cy-process-form-field input[name="subset_WFS.featureids"]').clear()
	})

	it('Selecting a dataset in the Layer Switcher should "automatically fill subset_WFS.resource input"', () => {
		cy.get('.cy-layerswitcher-dataset-item').first().click()
		cy.get('.cy-process-form-field input[name="subset_WFS.resource"]').should('not.have.value', '')
	})

	it('Selecting a region type in the Layer Switcher should "automatically fill subset_WFS.typename input"', () => {
		cy.window().then((window) => {
			cy.hasOpenLayersLoadedRegions(window.ol, window.cyCurrentMap, false)
		})
		cy.selectShapeFileByKey(SHAPEFILE_NAME_NESTATES)

		cy.window().then((window) => {
			cy.hasOpenLayersLoadedRegions(window.ol, window.cyCurrentMap, true)
		})
		cy.get('.cy-process-form-field input[name="subset_WFS.typename"]').should('not.have.value', '')
	})

	it('Selecting a region on the map should "automatically fill subset_WFS.featureids input"', () => {
		cy.get('#cy-menu-map-controls-toggle a svg').click()
		cy.get('#cy-region-selection-btn').click()

		cy.selectRegionByCoordinates(-200, 100)
    cy.selectRegionByCoordinates(0, 0)
    cy.wait(2000)
		cy.window().then((window) => {
			cy.hasOpenLayersSelectedRegion(window.ol, window.cyCurrentMap, 2) // 2 selected region attended
		})
		cy.get('.cy-process-form-field input[name="subset_WFS.featureids"]').should('not.have.value', '')
	})

  it('Test closing tasks', () => {
			cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)
			cy.removeCurrentProject()
			cy.logout()
	})

})
