import { 
    SEARCH_DATASETS_TITLE, 
    DATA_PROCESSING_TITLE, 
    SCIENTIFIC_WORKFLOWS_LABEL,
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

// Attempt to do cypress attended pure-test pattern (Needed for the Download feature)

describe('Test workflow configuration and execution', () => {
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

    it('Create a basic workflow', () => {
        cy.createWorkflow(BASIC_WORKFLOW)
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()
        cy.get('#cy-workflow-list #cy-pagination').should('have.attr', 'data-cy-total').and('eq', '2')
        cy.get('.cy-workflow-item > div > div > div').last().should('contain', BASIC_WORKFLOW_NAME)
    })

    it('Select created basic workflow(last) and trigger action "Configure & Run"', () => {
        cy.get('.cy-workflow-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-configure-run-item').click()
        cy.get('#cy-configure-run-step').children().last().should('contain', BASIC_WORKFLOW_NAME)
        cy.wait(4000)
    })

    it('Process form should contains 4 inputs with predefined default values', () => {
        cy.get('.cy-process-form-field').should('to.have.lengthOf', 4) 
        cy.get('.cy-process-form-field [data-cy-name="thredds_download.url"] input').should('have.value', WORKFLOW_INPUT_DOWNLOAD_URL)
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
        cy.get('#cy-execute-process-btn').click().then(() => {
            cy.log(localStorage.getItem('executed_workflow'))
            expect(localStorage.getItem('executed_workflow')).to.not.be.null
            expect(localStorage.getItem('executed_workflow')).to.not.eq(JSON.stringify(BASIC_WORKFLOW))
            // Do not expect(localStorage.getItem('executed_workflow')).to.eq(something) 
            // Because workflow is transformed by the platform afterward
            let executed = JSON.parse(localStorage.getItem('executed_workflow'))
            expect(executed.parallel_groups[0].tasks[0].inputs.typename).to.eq(WORKFLOW_INPUT_TYPENAME_ALT)
            expect(executed.parallel_groups[0].tasks[0].inputs.featureids).to.eq(WORKFLOW_INPUT_FEATUREIDS_ALT)
            // TODO: Fix Mosaic that switched to False for no reason
            expect(executed.parallel_groups[0].tasks[0].inputs.mosaic).to.eq("False")
        })
        cy.wait(1000)
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click({multiple: true})
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

    it('TODO: Launching a workflow with missing inputs should trigger a warning', () => {
        /*cy.get('.cy-process-form-field [data-cy-name="subset_WFS.typename"] input').clear()
        cy.get('.cy-process-form-field [data-cy-name="subset_WFS.featureids"] input').clear()*/
        // TODO: Such validation to be implemented
    })

    it('Test closing tasks', () => {
        cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)
        cy.removeCurrentProject()
        cy.logout()
    })

})
