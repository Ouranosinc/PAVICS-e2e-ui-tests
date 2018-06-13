import { 
  SEARCH_DATASETS_TITLE, 
  PROJECT_MANAGEMENT_TITLE,
  TARGETED_CMIP5_DATASET_FILESERVER_URL } from './../constants';

describe('Test project datasets actions (Visualize/Remove/Download)', () => {

  beforeEach(() => {
    cy.initBeforeEach()
  })

  it('Test initialisation', () => {
    cy.init()
    cy.login()
    cy.createSelectTestProject() // @testProjectId is the current test project id
  })

  it('Open all 5 visualize widgets', () => {
    // cy.togglePointInfoWidget() // FIXME: Not selectable at the moment because of panzoom element
    cy.toggleTimeSerieWidget()
    cy.toggleLayerSwitcherWidget()
    cy.toggleTimeSliderWidget()
    cy.toggleMapControlsWidget()
  })

  it('No dataset should be being visualized at this point', () => {
    cy.get('#cy-timeslider[data-cy-enabled=false]').should('to.have.lengthOf', 1)
    cy.get('#cy-big-color-palette').should('not.be.visible')
    cy.get('.cy-layerswitcher-dataset-item').should('to.have.lengthOf', 0)
  })

  it('Launch search with "project:CMIP5 experiment:rpc85 variable:pr frequency:day" facets that should return a minimum of one result', () => {
    cy.ensureSectionOpen('cy-search-datasets', SEARCH_DATASETS_TITLE)
    cy.selectCMIP5RCP85PRDayFacets()
    cy.get('#cy-search-results #cy-pagination').should('have.attr', 'data-cy-total').and('to.be.gte', 1)
    cy.get('.cy-dataset-result-item').should('to.have.length.above', 0)
  })

  it('Select first dataset and add it to current project', () => {
    cy.addFirstDatasetToProject()
    cy.get('#cy-project-management').click()
    cy.get('#cy-project-datasets #cy-pagination').should('have.attr', 'data-cy-total').and('eq', "1")
  })

  it('Visualize CMIP5 NetCDF single file', () => {
    cy.get('.cy-project-dataset-item.cy-project-dataset-level-0 .cy-actions-btn').first().as('actionsBtn')
    cy.triggerVisualize('@actionsBtn', 'cy-visualize-item')
  })

  it('Color Palette should now be visible', () => {
    cy.get('#cy-big-color-palette').should('be.visible')
  })

  it('LayerSwitcher should now contain one dataset automatically selected', () => {
    cy.get('.cy-layerswitcher-dataset-item').should('to.have.lengthOf', 1)
    cy.get('.cy-layerswitcher-dataset-item [data-cy-selected="true"]').should('to.have.lengthOf', 1)
  })

  it('LayerSwitcher should now contain one dataset automatically selected even after toggling widget', () => {
    cy.toggleLayerSwitcherWidget()
    cy.toggleLayerSwitcherWidget()
    cy.get('.cy-layerswitcher-dataset-item').should('to.have.lengthOf', 1)
    cy.get('.cy-layerswitcher-dataset-item [data-cy-selected="true"]').should('to.have.lengthOf', 1)
  })

  it('Timeslider should now be enabled', () => {
    cy.get('#cy-timeslider[data-cy-enabled=true]').should('to.have.lengthOf', 1)
  })

  it('Timeslider should now be enabled even after toggling widget', () => {
    cy.toggleTimeSliderWidget()
    cy.toggleTimeSliderWidget()
    cy.get('#cy-timeslider[data-cy-enabled=true]').should('to.have.lengthOf', 1)
  })

  it('TODO: Navigating TimeSlider should reload the dataset layer', () => {
    
  })

  it('TODO: Selecting a point on the map should trigger wps services', () => {
    
  })

  it('TODO: Point Informations should now be filled with content', () => {
    
  })

  it('TODO: Chart should now contains a time series', () => {
    
  })

  it('TODO: Point selection should not work when "Region Selection" is selected in Map Controls', () => {
    
  })

  it('TODO: Change base map should load a new base map in the background', () => {
    
  })

  it('TODO: Select Regions shapefile should load polygons', () => {
    
  })

  it('TODO: Selecting a region polygon should hightlight it', () => {
    
  })

  it('Test closing tasks', () => {
    cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.removeCurrentProject()
    cy.logout()
  })

})
