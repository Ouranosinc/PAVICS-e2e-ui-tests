import {
  PROJECT_MANAGEMENT_TITLE,
  PERMISSION_READ_LABEL,
  PERMISSION_WRITE_LABEL
} from './../constants';
const CURRENT_DATE_TIME = new Date().toISOString();
let firstProjectId;
let secondProjectId;

describe('Test project sharing action', () => {
  beforeEach(() => {
		cy.initBeforeEach()
  })

  it('Init basic stuff', () => {
    cy.init()
    cy.login()
  })

  it('Create first TEST project and note created project id as firstProjectId', () => {
    cy.createSelectTestProject();
    cy.get('@testProjectId').then((id) => {
      firstProjectId = id
    })
  })

  it('Share the project READ permission to another cypress user', () => {
    cy.shareProjectToUser(Cypress.env('MAGPIE_USERNAME') + 2)
  })

  it('Create second TEST project and note created project id as secondProjectId', () => {
    cy.get('#cy-project-management').click()
    cy.createSelectTestProject();
    cy.get('@testProjectId').then((id) => {
      secondProjectId = id
    })
  })

  it('Share the project "READ and WRITE permissions to group users"', () => {
    cy.shareProjectWriteToGroup('users')
  })

  it('Login as the other cypress user', () => {
    cy.logout()
    cy.login(Cypress.env('MAGPIE_USERNAME') + 2, Cypress.env('MAGPIE_PASSWORD') + 2)
  })

  it('Select the first previously created TEST project as current project', () => {
    cy.selectProjectByProjectId(firstProjectId)
  })

  it('First project should have only one READ permission', () => {
    cy.get('.cy-project-permission-cb').should('to.have.lengthOf', 1)
    cy.get('.cy-project-permission-cb label')
      .first()
      .should('contain', PERMISSION_READ_LABEL)
  })

  it('Select the second previously created TEST project as current project', () => {
    cy.get('#cy-project-management').click()
    cy.selectProjectByProjectId(secondProjectId)
  })

  it('Second project should have READ and WRITE permissions', () => {
    cy.get('.cy-project-permission-cb').should('to.have.lengthOf', 2)
    cy.get('.cy-project-permission-cb label')
      .first()
      .should('contain', PERMISSION_READ_LABEL)
    cy.get('.cy-project-permission-cb label')
      .last()
      .should('contain', PERMISSION_WRITE_LABEL)
  })

  it('Close tasks', () => {
    cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.removeCurrentProject();
    cy.selectProjectByProjectId(firstProjectId)
    cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.removeCurrentProject();
  })

})
