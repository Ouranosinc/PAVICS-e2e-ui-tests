import {
	BASIC_WORKFLOW,
	BASIC_WORKFLOW_NAME,
  DATA_PROCESSING_TITLE,
  PROCESS_MONITORING_TITLE,
	MISSING_PROVIDER_WORKFLOW,
	SCIENTIFIC_WORKFLOWS_LABEL,
	SEARCH_DATASETS_TITLE,
	SHAPEFILE_NAME_NESTATES,
	WORKFLOW_INPUT_FEATUREIDS,
	WORKFLOW_INPUT_DOWNLOAD_URL,
	WORKFLOW_INPUT_TYPENAME,
  IDENTIFIER_THREDDS_URLS,
  IDENTIFIER_SUBSET_WFS,
  STATUS_PENDING,
  STATUS_UNKNOWN,
  STATUS_COMPLETED,
  SUBSETTING_TASK_NAME
} from './../constants';

describe('Test workflow monitoring actions with a single netcdf output', () => {
	beforeEach(() => {
		cy.initBeforeEach()
	})

	it('Test initialisation', () => {
		cy.init()
		cy.login()
    cy.createSelectTestProject()
  })
  
  it('Validate 4 sample workflows were created for the newly created TEST project', () => {
    // 4 sample workflow auto-created for a new project
    cy.route({method: 'get', url: new RegExp(/api\/Projects\/.*\/workflows/i)}).as('getWorkflows')
    cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
    // Development temporary actions so we can start futur testing with a completed workflow
    //cy.selectProjectByProjectId(517) // Trigger the test once then note projectId
    //cy.get('#cy-project-management').click()
    //cy.ensureSectionOpen('cy-process-monitoring', PROCESS_MONITORING_TITLE)
    cy.wait('@getWorkflows')
    cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '4')
  })
  
  it('Create a basic workflow', () => {
		cy.createWorkflow(BASIC_WORKFLOW)
		cy.shouldNotifySuccess()
		cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '5') // 4 + 1
		cy.get('.cy-workflow-item > div > div > span').last().should('contain', BASIC_WORKFLOW_NAME)
	})

	it('Select created subset workflow (last) and trigger action "Configure & Run"', () => {
		cy.get('.cy-workflow-item .cy-actions-btn').last().click()
		cy.get('ul[role=menu] #cy-configure-run-item').click()
		cy.get('#cy-configure-run-step').children().last().should('contain', BASIC_WORKFLOW_NAME)
		cy.wait(7000) // Parsing workflow time is actually hard to predict
	})

	it('Process form should contains 4 inputs with predefined default values', () => {
		cy.get('.cy-process-form-field').as('fields')
		cy.get('.cy-process-form-field').should('to.have.lengthOf', 4)
    cy.get(`.cy-process-form-field input[name="${IDENTIFIER_THREDDS_URLS}.url"]`)
      .should('have.value', WORKFLOW_INPUT_DOWNLOAD_URL)
    cy.get(`.cy-process-form-field input[name="${IDENTIFIER_SUBSET_WFS}.typename"]`)
      .should('have.value', WORKFLOW_INPUT_TYPENAME)
    cy.get(`.cy-process-form-field input[name="${IDENTIFIER_SUBSET_WFS}.featureids"]`)
      .should('have.value', WORKFLOW_INPUT_FEATUREIDS)
    cy.get(`.cy-process-form-field input[name="${IDENTIFIER_SUBSET_WFS}.mosaic"]`).should('be.checked')
  })

	it('Launching the workflow should be a success', () => {
    cy.route({ method: 'post', url: new RegExp(/.*phoenix\/processes\/execute.*/i) }).as('phoenixExecute')
    cy.route({ method: 'post', url: new RegExp(/.*\/api\/Projects\/.*\/jobs?.*/i) }).as('addJob')
    cy.get('#cy-execute-process-btn').click().then(() => {
      expect(localStorage.getItem('executed_workflow')).to.not.be.null
      cy.wait(['@phoenixExecute', '@addJob']).then(() => {
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click({ multiple: true })
      })
    })
    cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)
  })
  
  it('Monitoring should now have "exactly one job with status PENDING"', () => {
    cy.wait(3000) // Potential delay in phoenix registering job
    cy.route({ method: 'get', url: "/phoenix/jobs?**" }).as('phoenixJobs')
    cy.ensureSectionOpen('cy-process-monitoring', PROCESS_MONITORING_TITLE)
    cy.wait('@phoenixJobs')

    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0').should('to.have.lengthOf', 1)
    cy.get('#cy-process-monitoring #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "1")
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0 .cy-monitoring-status')
      .first()
      .should('contain', STATUS_PENDING)
  })
  
  it('After waiting 120 seconds, "workflow should now have status COMPLETED"', () => {
    cy.route({ method: 'get', url: "/phoenix/jobs?**" }).as('phoenixJobs')
    // TODO: We should intercept and parse results until it has completed !
    cy.wait(120000)
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0 .cy-monitoring-status')
      .first()
      .should('contain', STATUS_COMPLETED)
  })
  
  it('All workflow "two tasks should be COMPLETED"', () => {
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0').first().click()
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-1').should('to.have.lengthOf', 2)
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-1 .cy-monitoring-status').each(($el) => {
      cy.wrap($el).should('contain', STATUS_COMPLETED)
    })
  })
  
  it('Opening "Subsetting task should show one output file"', () => {
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-1 > div > span').last().should('contain', SUBSETTING_TASK_NAME + ':')
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-1').last().click()
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-2').should('to.have.lengthOf', 1)
  })
  
  it('Trigger action "Persist" on NetCDF Subsetting output', () => {
    cy.get('.cy-monitoring-sec-actions.cy-monitoring-level-2 .cy-actions-btn').click({force:true})
    cy.get('ul[role=menu] #cy-persist-item').click()
    cy.get('#cy-advanced-toggle').click()
    cy.get('input#cy-workspace-path-tf').invoke('val').as('persistPath')
    cy.get('@persistPath').then(path => {
      cy.get('#cy-overwrite-destination-cb').check()
      cy.get('#cy-persist-dialog-launch-btn').click()
      // `${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/fileServer/birdhouse/${path}`,
      cy.request(`${Cypress.config().baseUrl}/twitcher/ows/proxy/thredds/catalog/birdhouse/${path}`).then(response => {
        cy.wrap(response.status).should('eq', 200)
      })
    })
  })
  
  it('Trigger action "Download" on NetCDF Subsetting output', () => {
    // Workaround: Figuring out resource url with the persist dialog
    cy.get('.cy-monitoring-sec-actions.cy-monitoring-level-2 .cy-actions-btn').click({force:true})
    cy.get('ul[role=menu] #cy-persist-item').click()
    cy.get('#cy-advanced-toggle').click()
    cy.get('input#cy-resource-link-tf').invoke('val').as('link')
    cy.get('@link').then(link => {
      cy.get('#cy-persist-dialog-close-btn').click() // Close dialog
      
      // Now we can trigger Download
      cy.window().then((window) => {
        cy.stub(window, 'open').as('windowOpen')
        cy.get('.cy-monitoring-sec-actions.cy-monitoring-level-2 .cy-actions-btn').click()
        cy.get('ul[role=menu] #cy-download-item').click()
        cy.get('@windowOpen').should('be.calledWith', link)
      })
    })
  })

  it('Trigger action "Visualize" on NetCDF Subsetting output', () => {
    // TODO: Uncomment when issue #XYZ is fixed
    // https://hirondelle.crim.ca/twitcher/ows/proxy/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/wps_outputs/flyingpigeon/tmpEh9T94/pr_day_CanESM2_rcp85_r1i1p1_20060101-21001231_NE_State_and_Province_Boundaries.56
    /*
    <ServiceExceptionReport xmlns="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.3.0" xsi:schemaLocation="http://www.opengis.net/ogc http://schemas.opengis.net/wms/1.3.0/exceptions_1_3_0.xsd">
      <ServiceException>
        There is no dataset with ID outputs/wps_outputs/flyingpigeon/tmpEh9T94/pr_day_CanESM2_rcp85_r1i1p1_20060101-21001231_NE_State_and_Province_Boundaries.564.nc
      </ServiceException>
    </ServiceExceptionReport>
    */
    // cy.get('.cy-monitoring-sec-actions.cy-monitoring-level-2 .cy-actions-btn').as('actionsBtn')
    // cy.triggerVisualize('@actionsBtn', 'cy-visualize-item', 4)
  })
  
	it('Select first sample workflow (Parsing catalog & parallel subsetting) and trigger action "Configure & Run"', () => {
    // cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
    cy.get('#cy-data-processing').click()
    cy.get('.cy-workflow-item .cy-actions-btn').eq(1).click() // Select item #2
    cy.get('ul[role=menu] #cy-configure-run-item').click()
    cy.wait(7000) // Parsing workflow time is actually hard to predict
    // TODO: Could be done better with multiple route/wait
  })

  it('Launching the workflow should be a success', () => {
    cy.route({ method: 'post', url: new RegExp(/.*phoenix\/processes\/execute.*/i) }).as('phoenixExecute')
    cy.route({ method: 'post', url: new RegExp(/.*\/api\/Projects\/.*\/jobs?.*/i) }).as('addJob')
    cy.get('#cy-execute-process-btn').click().then(() => {
      expect(localStorage.getItem('executed_workflow')).to.not.be.null
      cy.wait(['@phoenixExecute', '@addJob']).then(() => {
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click({ multiple: true })
      })
    })
    cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)
  })
  
  it('Monitoring section should now list "exactly two jobs"', () => {
    cy.wait(3000) // Potential delay in phoenix registering job
    cy.route({ method: 'get', url: "/phoenix/jobs?**" }).as('phoenixJobs')
    cy.ensureSectionOpen('cy-process-monitoring', PROCESS_MONITORING_TITLE)
    cy.wait('@phoenixJobs')

    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0').should('to.have.lengthOf', 2)
    cy.get('#cy-process-monitoring #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "2")
  })

  it('The first job should have status PENDING"', () => {
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0')
      .first()
      .get('.cy-monitoring-status')
      .should('contain', STATUS_PENDING)
  })
  
  it('After waiting 120 seconds, "first job should now have status COMPLETED"', () => {
    cy.route({ method: 'get', url: "/phoenix/jobs?**" }).as('phoenixJobs')
    // TODO: We should intercept and parse results until it has completed !
    cy.wait(120000)
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0')
      .first()
      .get('.cy-monitoring-status')
      .should('contain', STATUS_COMPLETED)
  })
  
  it('Workflow "Parsing Catalog task should be COMPLETED"', () => {
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-0').first().click()
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-1').should('to.have.lengthOf', 1)
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-1 .cy-monitoring-status')
      .first()
      .should('contain', STATUS_COMPLETED)
  })

  it('Workflow "Subsetting task should contains 10 parallel tasks with status COMPLETED"', () => {
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-parallel').should('to.have.lengthOf', 1)
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-parallel').first().click()
    cy.get('.cy-monitoring-list-item.cy-monitoring-level-2').should('to.have.lengthOf', 10)

    cy.get('.cy-monitoring-list-item.cy-monitoring-level-2 .cy-monitoring-status').each(($el) => {
      cy.wrap($el).should('contain', STATUS_COMPLETED)
    })
  })

	it('Test closing tasks', () => {
			cy.ensureSectionClose('cy-process-monitoring', PROCESS_MONITORING_TITLE)
			cy.removeCurrentProject()
			cy.logout()
	})

})
