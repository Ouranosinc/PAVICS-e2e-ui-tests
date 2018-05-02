# PAVICS-2e2-ui-tests

This project focuses on testing the PAVICS-frontend interfaces in the context of a complete deployment of the platform. In fact, we want those tests to be 'End-to-end integrations tests' that valid the PAVICS infrastructure is working as intendedfor a given platform URL.

## Features
* [cypress.io](https://www.cypress.io/)

## Requirements
* node `^8.0.0` but developped with Node v8.9.4
* npm `^5.0.0` but developped with Node v5.6.0

cypress requires libgconf to run. On ubuntu:

```
sudo apt-get install libgconf-2-4
```

## Getting Started

Steps to get the project up and running:

```bash
$ npm install                   # Install project dependencies
$ vi cypress.json               # Set targetted platform by editing the baseUrl property
$ npm test                      # Launch all tests (cli)
$ npm run cypress               # Launch the Cypress application
```

## How to write a new test
- Every tests suite (integration/*.spec.js file) should be able to run independantly
- We do not intercept API route calls to inject our mock-data (with cy.route(), cy.stub()). In fact, we want those tests to be 'End-to-end integrations tests' that valid the PAVICS infrastructure is working as intendedfor a given platform URL.
- Reuse maximum of pre-defined utility commands (support/commands.js)
- We do not cy.init() beforeEach() test since we need our data to be inside a test project that will be removed afterward
- Normally, every tests could run independantly too but that would require an epic overhead of actions (and time) for every single test (selecting a file in the layer-switcher implies: being logged in, having created a project, having added multiple files in that projet (which implies a search by facets), having selected some of these files, etc.). That mean our tests suites must be run sequentially: every test need previous tests to be executed with success.
- A test suite (spec.js file) should be a complete user story archieving a small set of features.
- Identify your elements with prefixed 'cy-' classes and ids to facilitate selections. Ids are used for single elements and classes should be used when multiple instances of this element is attended on the pages. 
- When creating cypress ids/classes, you should also used suffixes to identify your element types: Examples: '-btn' for buttons, '-item' for ListItem, '-tf' for TextField or '-sf' for SelectField.
- Use prefixed 'data-cy-' attributes when you need dynamic data to be the selected element

#List of reusable commands (support/commands.js):
```javascript
cy.init() # Call it before every test, will cy.visit() main page then do some basic stuff like removing alerts and minimizing panels
cy.createTestProject() # Should be called before every test, everything cypress does will be included in this project
cy.removeCurrentProject() # Should be called after every test to ensure cypress doesn't polute real database
cy.log() # Will log you in the platform
cy.logout() # Will log you out
```

## Environment variables
CYPRESS_baseUrl=https://outarde.crim.ca
MAGPIE_USERNAME=xyz
MAGPIE_PASSWORD=xyz

## Docker
docker build -t pavics/pavics-e2e-ui-tests . # Build
docker pull pavics/pavics-e2e-ui-tests  # Or simply pull from DockerHub
docker run -it pavics/pavics-e2e-ui-tests # Run (don't forget to define environment variables if needed)

