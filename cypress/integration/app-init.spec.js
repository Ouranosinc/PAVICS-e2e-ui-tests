import { PROJECT_NAME, PROJECT_MANAGEMENT_TITLE } from './../constants'
describe('App initialization', () => {
  it('Init basic stuff', () => {
    cy.init()
    cy.ensureSectionOpen('cy-project-management', PROJECT_MANAGEMENT_TITLE)
  })

  it('Delete all found projects previously created by Cypress', () => {
    cy.removeCypressTestProjects()
  })


  it('Close tasks', () => {
    // cy.logout()
  })
})
