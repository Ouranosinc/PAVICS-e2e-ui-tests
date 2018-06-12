import { PROJECT_MANAGEMENT_TITLE } from './../constants'
describe('App initialization', () => {

  beforeEach(() => {
    cy.initBeforeEach()
  })

  it('Init basic stuff', () => {
    cy.init()
    cy.login()
  })

  it('Delete all found projects previously created by Cypress', () => {
    cy.ensureSectionOpen('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.removeCypressTestProjects()
  })


  it('Close tasks', () => {
    // cy.logout() // Element not visible somehow
  })
})
