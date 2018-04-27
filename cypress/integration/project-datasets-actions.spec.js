import * as constants from './../constants';

// Attempt to do cypress attended pure-test pattern (Needed for the Download feature)

describe('Test project datasets actions (Visualize/Remove/Download)', () => {
    beforeEach(() => {
        // Test initialisation
        cy.init(true) // with an hook for window.open download event
        cy.login()
        cy.createSelectTestProject() // @testProjectId is the current test project id
        cy.ensureSectionOpen('cy-search-datasets', constants.SEARCH_DATASETS_TITLE)

        // Launch search with project:Ouranos and variable:PCP facets that should return a minimum of one result
        cy.selectFacet('project', 'Ouranos')
        cy.selectFacet('variable', 'PCP')
        cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
        cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)

        // Select first dataset and add it to current project
        cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
        cy.get('#cy-add-datasets-btn').click()
        cy.wait(1000)
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()

        // Resetting facets should remove facets and results
        cy.resetFacets()

        // Launch search with project:CMIP5 and frequency:day facets that should return a minimum of two results
        cy.selectFacet('project', 'CMIP5')
        cy.selectFacet('frequency', 'day')
        cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
        cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)

        // Select first dataset and add it to current project
        cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
        cy.get('#cy-add-datasets-btn').click()
        cy.wait(1000)
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()

        // Resetting facets should remove facets and results
        cy.resetFacets()
        cy.ensureSectionClose('cy-search-datasets', constants.SEARCH_DATASETS_TITLE)
        cy.ensureSectionOpen('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)

        // There should be two added datasets in the current project', () => {
        cy.get('#cy-project-datasets #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "2") 
    })

    afterEach(() => {
        // Test closing tasks
        cy.ensureSectionClose('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
        cy.removeCurrentProject()
        cy.logout()
    })

    /*
    * We assume selected CMIP5/day dataset should contains a single NetCDF file
    */
    it('Select current project last dataset and trigger action "Visualize"', () => {
        cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu]').children().should('to.have.lengthOf', 3) // 3 actions attended
        cy.get('div[role=menu] #cy-visualize-item').click() // Trigger action
        cy.get('#cy-sectional-content h1').click() // Close actions menu
        
        cy.wait(5000)
        cy.get('#cy-big-color-palette').should('be.visible')
        /*cy.get('canvas').trigger('mousedown')
            .trigger('mousemove', { which: 1, pageX: 600, pageY: 600 })
            .trigger('mouseup')*/
   
        // TODO: Validate a dataset is being loaded on the map
        // TODO: Validate there's a dataset now selected in the LayerSwitcher
    })

    it('Select current project last dataset and trigger action "Download"', () => {
        // This test needs a window.open hook on the visit event, so we need to renavigate to the page
        // TODO: Alias are not preserved in-between tests !!!!!
        cy.get('#cy-project-management').click()
        cy.get('@testProjectId').then((id) => {
            cy.selectProjectByProjectId(id) // Re-select project we previously created for tests
        })
        cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-download-item').click()

        // TODO: Do not download the file for real, window.open will be intercepted
        // cy.get('@windowOpen').should('be.calledWith', 'https://pluvier.crim.ca/twitcher/ows/proxy/thredds/fileServer/birdhouse/CMIP5/CCCMA/CanESM2/historical/day/atmos/r1i1p1/pr/pr_day_CanESM2_historical_r1i1p1_18500101-20051231.nc')
        
        // TODO: Eventually capture URL, and try cy.request() in this test to see if a file is returned (200)
        // Always returning 401 ATM (cypress should pass cookies...)
        /*cy.request({
            url: "https://pluvier.crim.ca/twitcher/ows/proxy/thredds/fileServer/birdhouse/CMIP5/CCCMA/CanESM2/historical/day/atmos/r1i1p1/pr/pr_day_CanESM2_historical_r1i1p1_18500101-20051231.nc",
            headers: {'Content-Type': 'application/netcdf'}
        }).then((response) => {
            expect(response.status).should('eq', "200")
        })*/
    })

    it('Select current project last dataset and trigger action "Remove"', () => {
        /*cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-remove-item').click()*/

        // TODO: Confirm
        // TODO: Manage alert
        // TODO: Count there's one less dataset
    })

    /*
    * We assume selected Ouranos/PCP dataset should contains multiple NetCDF file
    */
   it('Select current project first dataset and open the folder to see the files', () => {
        /*cy.get('.cy-project-dataset-item .cy-actions-btn').first().click()*/

        // TODO: Count children, lets say more than 10
    })

    it('Select current project first  dataset and trigger action "Visualize All (Aggregated)"', () => {
        /*cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-visualize-all-agg-item').click()*/

        // TODO: Validate a dataset is being loaded on the map
        // TODO: Validate there's a dataset now selected in the LayerSwitcher
    })

    it('Select current project first  dataset and trigger action "Visualize All (Splitted)"', () => {
        /*cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-visualize-all-split-item').click()*/

        // TODO: Validate a dataset is being loaded on the map
        // TODO: Validate there's a dataset now selected in the LayerSwitcher
    })

    it('Select current project first dataset and trigger action "Download All"', () => {
        /*cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-download-item').click()*/
    })

    it('Select current project last dataset and first file and trigger action "Remove file"', () => {
        /*cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-remove-item').click()*/

        // TODO: Confirm
        // TODO: Manage alert
        // TODO: Count there's one less file in the dataset
    })

    it('Select current project last dataset and trigger action "Remove"', () => {
        /*cy.get('.cy-project-dataset-item .cy-actions-btn').last().click()
        cy.get('div[role=menu] #cy-remove-item').click()*/

        // TODO: Confirm
        // TODO: Manage alert
        // TODO: Count there's no more
    })

    // NOW IS BEFOREEACH

    /*it('Test initialisation', () => {
        cy.init()
        cy.login()
        cy.createSelectTestProject() // @testProjectId is the current test project id
        cy.ensureSectionOpen('cy-search-datasets', constants.SEARCH_DATASETS_TITLE)
    })

    it('Launch search with project:Ouranos and variable:PCP facets that should return a minimum of one result', () => {
        cy.selectFacet('project', 'Ouranos')
        cy.selectFacet('variable', 'PCP')

        cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
        cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)
    })

    it('Select first dataset and add it to current project', () => {
        cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
        cy.get('#cy-add-datasets-btn').click()

        cy.wait(1000)
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()
    })

    it('Resetting facets should remove facets and results', () => {
        cy.resetFacets()
    })

    it('Launch search with project:CMIP5 and frequency:day facets that should return a minimum of two results', () => {
        cy.selectFacet('project', 'CMIP5')
        cy.selectFacet('frequency', 'day')

        cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
        cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)
    })

    it('Select first dataset and add it to current project', () => {
        cy.get('.cy-dataset-result-item input[type=checkbox]').first().check()
        cy.get('#cy-add-datasets-btn').click()

        cy.wait(1000)
        cy.get('.notification-container .notification-message h4').should('contain', 'Success')
        cy.get('.notification-container .notification-success').click()
    })

    it('Resetting facets should remove facets ans results', () => {
        cy.resetFacets()
    })

    it('There should be two added datasets in the current project', () => {
        cy.get('#cy-project-datasets #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "2") 
    })*/

    // NOW IS AFTEREACH

    /*it('Test closing tasks', () => {
        cy.ensureSectionClose('cy-project-management', constants.PROJECT_MANAGEMENT_TITLE)
        cy.removeCurrentProject()
        cy.logout()
    })*/

})
  