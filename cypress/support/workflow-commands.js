
import { } from './../constants';

// Data Processing - Scientific workflow section should be opened
Cypress.Commands.add('createWorkflow', (workflow) => {
  cy.get('#cy-create-workflow-json-content-tf').clear().type(workflow)
  cy.get('#cy-create-workflow-btn').click()
})