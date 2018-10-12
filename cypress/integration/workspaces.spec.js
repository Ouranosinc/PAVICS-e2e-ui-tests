describe('Build a workspace and feature layer hierarchy from json data', () => {

  beforeEach(() => {
    cy.initBeforeEach();
  });

  it('Initialisation', () => {
    cy.init();
    cy.login();
  });

  it('Opens regions tab', () => {
    cy.toggleLayerSwitcherWidget();
    cy.get('#cy-layerswitcher-regions-tab').click();
    cy.get('#cy-reset-feature-layer-btn').should('be.visible');
  });

  it('Has workspaces', () => {
    cy.get('.cy-layerswitcher-workspace').should('to.have.length.greaterThan', 0);
  });

  it('Opens a workspace', () => {
    cy.get('#cy-layerswitcher-workspace-opengeo').click();
    cy.get('.cy-layerswitcher-feature-layer').should('to.have.length.greaterThan', 0);
  });

  it('Logs out', () => {
    cy.logout();
  });

  it("Doesn't have workspaces anymore", () => {
    cy.get('.cy-layerswitcher-workspace').should('to.have.lengthOf', 0);
    cy.toggleLayerSwitcherWidget()
  });

});