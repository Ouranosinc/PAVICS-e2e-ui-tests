import { 
  ACCOUNT_MANAGEMENT_TITLE, 
  SEARCH_DATASETS_TITLE, 
  PROJECT_MANAGEMENT_TITLE, 
  DATA_PROCESSING_TITLE, 
  PROCESS_MONITORING_TITLE } from './../constants'
describe('Sectional panels authentication warnings', () => {

  beforeEach(() => {
    cy.initBeforeEach()
  })

  it('Init basic stuff', () => {
    cy.init()
  })

  it('When unauthenticated, "Section Search Datasets should trigger a warning and not open"', () => {
    cy.get('#cy-search-datasets').click()
    cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
    cy.get('.notification-container .notification-warning').click()
    cy.wait(1000)
  })

  it('When unauthenticated, "Section Project Management should trigger a warning and not open"', () => {
    cy.get('#cy-project-management').click()
    cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
    cy.get('.notification-container .notification-warning').click()
    cy.wait(1000)
  })

  it('When unauthenticated, "Section Data Processing should trigger a warning and not open"', () => {
    cy.get('#cy-data-processing').click()
    cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
    cy.get('.notification-container .notification-warning').click()
    cy.wait(1000)
  })

  it('When unauthenticated, "Section Process Monitoring should trigger a warning and not open"', () => {
    cy.get('#cy-process-monitoring').click()
    cy.get('.notification-container .notification-message h4').should('contain', 'Warning')
    cy.get('.notification-container .notification-warning').click()
    cy.wait(1000)
  })

  it('When unauthenticated, "Section Search Datasets should trigger a warning and not open"', () => {
    cy.ensureSectionOpen('cy-account-management', ACCOUNT_MANAGEMENT_TITLE)
    cy.ensureSectionClose('cy-account-management', ACCOUNT_MANAGEMENT_TITLE)
  })

  it('Login', () => {
    cy.login()
  })

  it('After being logged in, Section Project Management should now open', () => {
    cy.ensureSectionOpen('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
  })

  it('Create and Select TEST project', () => {
    cy.createSelectTestProject()
  })

  it('All sections should now open', () => {
    cy.ensureSectionOpen('cy-search-datasets', SEARCH_DATASETS_TITLE)
    cy.ensureSectionClose('cy-search-datasets', SEARCH_DATASETS_TITLE)

    cy.ensureSectionOpen('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)

    cy.ensureSectionOpen('cy-data-processing', DATA_PROCESSING_TITLE)
    cy.ensureSectionClose('cy-data-processing', DATA_PROCESSING_TITLE)

    cy.ensureSectionOpen('cy-process-monitoring', PROCESS_MONITORING_TITLE)
    cy.ensureSectionClose('cy-process-monitoring', PROCESS_MONITORING_TITLE)

    cy.ensureSectionOpen('cy-account-management', ACCOUNT_MANAGEMENT_TITLE)
    cy.ensureSectionClose('cy-account-management', ACCOUNT_MANAGEMENT_TITLE)
  })

  it('Close tasks', () => {
    // cy.get('#cy-account-management').click()
    // cy.logout()
  })
})
