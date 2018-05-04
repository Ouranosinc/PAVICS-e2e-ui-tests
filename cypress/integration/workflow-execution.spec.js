import { 
    SEARCH_DATASETS_TITLE, 
    DATA_PROCESSING_TITLE, 
    SCIENTIFIC_WORKFLOWS_LABEL,
    BASIC_DOWNLOAD_SUBSETTING_INDEXING_WORKFLOW
} from './../constants';

// Attempt to do cypress attended pure-test pattern (Needed for the Download feature)

describe('Test workflow CRUD actions (Visualize/Remove/Download)', () => {
    it('Test initialisation', () => {
        cy.init()
        cy.login()
        cy.createSelectTestProject() // @testProjectId is the current test project id
        cy.get('#cy-search-datasets').click()
        cy.selectFacet('project', 'CMIP5')
        cy.selectFacet('frequency', 'day')
        cy.addFirstDatasetToProject()
        
        // Could also be done later
        cy.get('#cy-project-management').click()
        cy.visualizeFirstSingleFileDataset()
    })

    it('Select current project last dataset and trigger action "Download"', () => {
       
    })


    it('Test closing tasks', () => {
        cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
        cy.removeCurrentProject()
        cy.logout()
    })

})
