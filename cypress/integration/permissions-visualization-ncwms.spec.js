import { 
  MAGPIE_GROUP_USERS_NAME,
  MAGPIE_GROUP_TESTS_NAME,
  MAGPIE_NCWMS_SERVICE_NAME,
  MAGPIE_NCWMS_GETLEGENDGRAPHIC_PERM,
  MAGPIE_NCWMS_GETMETADATA_PERM,
  MAGPIE_NCWMS_GETFEATUREINFO_PERM,
  MAGPIE_NCWMS_GETCAPABILITIES_PERM,
  MAGPIE_NCWMS_GETMAP_PERM,
  SEARCH_DATASETS_TITLE,
  PROJECT_MANAGEMENT_TITLE
} from './../constants';
let projectId;

describe('Tests of NcWMS visualization in the context of magpie permissions', () => {
  /*beforeEach(() => {
		cy.initBeforeEach()
  })

  it('Magpie: Make sure cypress user is part of "group users"', () => {
    cy.loginMagpie()
    cy.addMagpieUserGroup(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_GROUP_USERS_NAME)
    cy.logoutMagpie()
  })

  it('Magpie: Make sure "all ncwms permissions are removed" on cypress user', () => {
    cy.loginMagpie()
    cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETLEGENDGRAPHIC_PERM)
    cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMETADATA_PERM)
    cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETFEATUREINFO_PERM)
    cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETCAPABILITIES_PERM)
    cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMAP_PERM)
    cy.logoutMagpie()
  })

  it('PAVICS Platform: Create TEST project and add to it a visualizable "CMIP5 dataset" for later tests', () => {
    cy.init()
    cy.login(Cypress.env('MAGPIE_USER_USERNAME'), Cypress.env('MAGPIE_USER_PASSWORD'))
    cy.createSelectTestProject()
    cy.get('@testProjectId').then((id) => {
      projectId = id
      cy.log(id)
    })
    cy.ensureSectionOpen('cy-search-datasets', SEARCH_DATASETS_TITLE)
    cy.selectCMIP5RCP85PRDayFacets()
    cy.addFirstDatasetToProject()
  })

  it('Magpie: Add cypress user to "group tests" and remove him from group users', () => {
    cy.loginMagpie()
    cy.addMagpieUserGroup(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_GROUP_TESTS_NAME)
    cy.removeMagpieUserGroup(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_GROUP_USERS_NAME)
    cy.logoutMagpie()
  })

  it('Magpie: Make sure "all ncwms permissions are removed" on cypress group tests', () => {
    cy.loginMagpie()
    cy.removeMagpieGroupServiceRootPermission(MAGPIE_GROUP_TESTS_NAME, MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETLEGENDGRAPHIC_PERM)
    cy.removeMagpieGroupServiceRootPermission(MAGPIE_GROUP_TESTS_NAME, MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMETADATA_PERM)
    cy.removeMagpieGroupServiceRootPermission(MAGPIE_GROUP_TESTS_NAME, MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETFEATUREINFO_PERM)
    cy.removeMagpieGroupServiceRootPermission(MAGPIE_GROUP_TESTS_NAME, MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETCAPABILITIES_PERM)
    cy.removeMagpieGroupServiceRootPermission(MAGPIE_GROUP_TESTS_NAME, MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMAP_PERM)
    cy.logoutMagpie()
  })

  it('PAVICS Platform: visualizing CMIP5:RCP85 dataset "should trigger an error on GetCapabilities"', () => {
    cy.init()
    cy.login(Cypress.env('MAGPIE_USER_USERNAME'), Cypress.env('MAGPIE_USER_PASSWORD'))
    cy.selectProjectByProjectId(projectId)

    // Authorization errors attended at this point
    cy.visualizeFirstSingleFileDataset(401)

    // Information alert attended before launching ncwms calls
    cy.get('.notification-container .notification-message h4').should('contain', 'Information')
    cy.get('.notification-container .notification-info').click()

    // Error alert attended
    cy.get('.notification-container .notification-message h4').should('contain', 'Error')
    cy.get('.notification-container .notification-error').click()
  })

  it('Magpie: Add cypress tests group only GetCapabilities NcWMS permission', () => {
    cy.loginMagpie()
    cy.addMagpieGroupServiceRootPermission(MAGPIE_GROUP_TESTS_NAME, MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETCAPABILITIES_PERM)
    cy.logoutMagpie()
  })

  it('PAVICS Platform: visualizing CMIP5:RCP85 dataset "should trigger errors on GetMetadata and GetMap"', () => {
    cy.init()
    cy.login(Cypress.env('MAGPIE_USER_USERNAME'), Cypress.env('MAGPIE_USER_PASSWORD'))
    cy.selectProjectByProjectId(projectId)

    // Success attended at this point on GetCapabilities
    cy.visualizeFirstSingleFileDataset(200, 401, 401)
    cy.get('.notification-container .notification-message h4').should('contain', 'Information')
    cy.get('.notification-container .notification-info').click()

    // Three error alerts attended, two GetMetadata and one GetMap
    cy.get('.notification-container .notification-error').should('have.lengthOf', 3)
    cy.get('.notification-container .notification-error').click({multiple: true})
  })

  it('Magpie: Remove cypress tests group "GetCapabilities NcWMS permission"', () => {
    cy.loginMagpie()
    cy.removeMagpieGroupServiceRootPermission(MAGPIE_GROUP_TESTS_NAME, MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETCAPABILITIES_PERM)
    cy.logoutMagpie()
  })

  it('Magpie: Add cypress user only "GetCapabilities NcWMS permission"', () => {
    cy.loginMagpie()
    cy.addMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETCAPABILITIES_PERM)
    cy.logoutMagpie()
  })

  it('PAVICS Platform: visualizing CMIP5:RCP85 dataset "should trigger errors on GetMetadata and GetMap"', () => {
    cy.init()
    cy.login(Cypress.env('MAGPIE_USER_USERNAME'), Cypress.env('MAGPIE_USER_PASSWORD'))
    cy.selectProjectByProjectId(projectId)

    // Success attended at this point on GetCapabilities
    cy.visualizeFirstSingleFileDataset(200, 401, 401)
    cy.get('.notification-container .notification-message h4').should('contain', 'Information')
    cy.get('.notification-container .notification-info').click()

    // Three error alerts attended, two GetMetadata and one GetMap
    cy.get('.notification-container .notification-error').should('have.lengthOf', 3)
    cy.get('.notification-container .notification-error').click({multiple: true})
  })

  it('Magpie: "Add cypress user ALL NcWMS permissions"', () => {
    cy.loginMagpie()
    cy.addMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETLEGENDGRAPHIC_PERM)
    cy.addMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMETADATA_PERM)
    cy.addMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETFEATUREINFO_PERM)
    cy.addMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETCAPABILITIES_PERM)
    cy.addMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMAP_PERM)
    cy.logoutMagpie()
  })

  it('PAVICS Platform: visualizing CMIP5:RCP85 dataset "should be successfull"', () => {
    cy.init()
    cy.login(Cypress.env('MAGPIE_USER_USERNAME'), Cypress.env('MAGPIE_USER_PASSWORD'))
    cy.selectProjectByProjectId(projectId)

    // Success attended at this point
    cy.visualizeFirstSingleFileDataset(200, 200, 200)
    cy.get('.notification-container .notification-message h4').should('contain', 'Information')
    cy.get('.notification-container .notification-info').click()
  })

  it('PAVICS Platform: Remove TEST project', () => {
    // Remove test project
    cy.ensureSectionClose('cy-project-management', PROJECT_MANAGEMENT_TITLE)
    cy.removeCurrentProject();
    cy.logout()
  })

  it('Magpie: Reset magpie user groups', () => {
    // Login to magpie
    cy.loginMagpie()

    // Reset magpie user groups
    cy.removeMagpieUserGroup(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_GROUP_TESTS_NAME)
    cy.addMagpieUserGroup(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_GROUP_USERS_NAME)
  })

  it('Magpie: Reset magpie user cypress permissions', () => { 
     // Reset magpie user cypress permissions
     cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETLEGENDGRAPHIC_PERM)
     cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMETADATA_PERM)
     cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETFEATUREINFO_PERM)
     cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETCAPABILITIES_PERM)
     cy.removeMagpieUserServiceRootPermission(Cypress.env('MAGPIE_USER_USERNAME'), MAGPIE_NCWMS_SERVICE_NAME, MAGPIE_NCWMS_GETMAP_PERM)
 
     // Logout magpie
     cy.logoutMagpie()
  })*/

})

