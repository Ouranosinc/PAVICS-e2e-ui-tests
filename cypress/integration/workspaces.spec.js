describe('Build a workspace and feature layer hierarchy from json data', () => {

  beforeEach(() => {
    cy.initBeforeEach();
  });

  it('Test initialisation', () => {
    cy.init();
  });

  it('Opens regions tab', () => {
    cy.toggleLayerSwitcherWidget();
    cy.get('#cy-layerswitcher-regions-tab').click();
    cy.get('#cy-reset-feature-layer-btn').should('be.visible');
  });

  it('Has public workspaces', () => {
    cy.get('')
  });

});