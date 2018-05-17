import {
	SUBSET_WORKFLOW,
	SUBSET_WORKFLOW_NAME,
	DATA_PROCESSING_TITLE,
	MISSING_PROVIDER_WORKFLOW,
	SCIENTIFIC_WORKFLOWS_LABEL,
	SEARCH_DATASETS_TITLE,
	SHAPEFILE_NAME_NESTATES,
	WORKFLOW_INPUT_FEATUREIDS,
	WORKFLOW_INPUT_FEATUREIDS_ALT,
	WORKFLOW_INPUT_RESOURCE,
	WORKFLOW_INPUT_TYPENAME,
	WORKFLOW_INPUT_TYPENAME_ALT
} from './../constants';

// Attempt to do cypress attended pure-test pattern (Needed for the Download feature)

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

	it('Create a workflow with a missing provider named "test"', () => {
		cy.createWorkflow(MISSING_PROVIDER_WORKFLOW)
		cy.get('.notification-container .notification-message h4').should('contain', 'Success')
		cy.get('.notification-container .notification-success').click()
		cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '1')
	})

	it('Create a subset workflow', () => {
		cy.createWorkflow(SUBSET_WORKFLOW)
		cy.get('.notification-container .notification-message h4').should('contain', 'Success')
		cy.get('.notification-container .notification-success').click()
		cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '2')
		cy.get('.cy-workflow-item > div > div > div').last().should('contain', SUBSET_WORKFLOW_NAME)
	})

	it('Select created subset workflow (last) and trigger action "Configure & Run"', () => {
		cy.get('.cy-workflow-item .cy-actions-btn').last().click()
		cy.get('div[role=menu] #cy-configure-run-item').click()
		cy.get('#cy-configure-run-step').children().last().should('contain', SUBSET_WORKFLOW_NAME)
		cy.wait(10000) // Parsing workflow time is actually hard to predict
	})

	it('Process form should contains 4 inputs with predefined default values', () => {
		cy.get('.cy-process-form-field').as('fields')
		cy.get('.cy-process-form-field').should('to.have.lengthOf', 4)
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.resource"] input').should('have.value', WORKFLOW_INPUT_RESOURCE)
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.typename"] input').should('have.value', WORKFLOW_INPUT_TYPENAME)
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.featureids"] input').should('have.value', WORKFLOW_INPUT_FEATUREIDS)
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.mosaic"] input').should('be.checked')
	})

	it('Modify values of form fields "subset_WFS.typename" and "subset_WFS.featureids"', () => {
		expect(localStorage.getItem('executed_workflow')).to.be.null
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.typename"] input').clear().type(WORKFLOW_INPUT_TYPENAME_ALT)
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.featureids"] input').clear().type(WORKFLOW_INPUT_FEATUREIDS_ALT)
	})

	it('Launch the workflow and validate sent values were modified', () => {
	cy.route({method: 'post', url: new RegExp(/.*phoenix\/processes\/execute.*/i)}).as('phoenixExecute')
		cy.get('#cy-execute-process-btn').click().then(() => {
			cy.log(localStorage.getItem('executed_workflow'))
			expect(localStorage.getItem('executed_workflow')).to.not.be.null
			expect(localStorage.getItem('executed_workflow')).to.not.eq(JSON.stringify(SUBSET_WORKFLOW))
			// Do not expect(localStorage.getItem('executed_workflow')).to.eq(something) 
			// Because workflow is transformed by the platform afterward
			let executed = JSON.parse(localStorage.getItem('executed_workflow'))
			expect(executed.tasks[0].inputs.typename).to.eq(WORKFLOW_INPUT_TYPENAME_ALT)
			expect(executed.tasks[0].inputs.featureids).to.eq(WORKFLOW_INPUT_FEATUREIDS_ALT)
			// TODO: Fix Mosaic that switched to False for no reason
			expect(executed.tasks[0].inputs.mosaic).to.eq("False")

			cy.wait('@phoenixExecute')
			cy.get('.notification-container .notification-message h4').should('contain', 'Success')
			cy.get('.notification-container .notification-success').click({ multiple: true })
		})
	})

	it('Go back to the workflow list, select invalid provider workflow(first) and trigger action "Configure & Run"', () => {
		cy.get('#cy-step-back-btn').click()
		cy.get('.cy-workflow-item .cy-actions-btn').first().click()
		cy.get('div[role=menu] #cy-configure-run-item').click()
		cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
		cy.get('.notification-container .notification-warning').click()
		// Stalled in mode 'Parsing Workflow'
		cy.get('#cy-step-back-btn').click()
	})

	it('TODO: "Launching a workflow with missing required inputs should trigger a warning"', () => {
		// cy.get('.cy-process-form-field [data-cy-name="subset_WFS.typename"] input').clear()
		// cy.get('.cy-process-form-field [data-cy-name="subset_WFS.featureids"] input').clear()
		// TODO: Such validation to be implemented
	})

	it('"Add CMIP5 dataset to current project", Visualize it and click Reset dataset button', () => {
		cy.addCMIP5DatasetThenVisualize()
		cy.get('#cy-menu-layer-switcher-toggle a svg').click()
		cy.get('#cy-layerswitcher-datasets-tab').click()
		cy.get('#cy-reset-dataset-btn').click()
	})

	it('"Navigate workflow list, select subset workflow" (last) and trigger action "Configure & Run"', () => {
		cy.get('#cy-data-processing').click()
		cy.get('.cy-workflow-item .cy-actions-btn').last().click()
		cy.get('div[role=menu] #cy-configure-run-item').click()
		cy.wait(10000)  // Parsing workflow time is actually hard to predict
	})

	it('"Clear all subset workflow text inputs"', () => {
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.resource"] input').clear()
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.typename"] input').clear()
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.featureids"] input').clear()
	})

	it('Selecting a dataset in the Layer Switcher should "automatically fill subset_WFS.resource input"', () => {
		cy.get('.cy-layerswitcher-dataset-item').first().click()
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.resource"] input').should('not.have.value', '')
	})

	it('Selecting a region type in the Layer Switcher should "automatically fill subset_WFS.typename input"', () => {
		//cy.init() // FIXME: remove
		//cy.get('#cy-menu-layer-switcher-toggle a svg').click() // FIXME: remove
		cy.window().then((window) => {
			cy.hasOpenLayersLoadedRegions(window.ol, window.cyCurrentMap, false)
		})
		cy.selectShapeFileByKey(SHAPEFILE_NAME_NESTATES)

		cy.window().then((window) => {
			cy.hasOpenLayersLoadedRegions(window.ol, window.cyCurrentMap, true)
		})
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.typename"] input').should('not.have.value', '')
	})

	it('TODO Selecting a region on the map should "automatically fill subset_WFS.featureids input"', () => {
		cy.get('#cy-menu-map-controls-toggle a svg').click()
		cy.get('#cy-region-selection-btn').click()

		cy.selectRegionByCoordinates(-200, 100)
		cy.selectRegionByCoordinates(0, 0)
		cy.window().then((window) => {
		  cy.hasOpenLayersSelectedRegion(window.ol, window.cyCurrentMap, 2) // 1 selected region attended
		})
		cy.get('.cy-process-form-field [data-cy-name="subset_WFS.featureids"] input').should('not.have.value', '')
	})

	/*it('Test closing tasks', () => {
			cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)
			cy.removeCurrentProject()
			cy.logout()
	})*/

})
