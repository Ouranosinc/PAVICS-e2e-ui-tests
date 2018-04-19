describe('Test search datasets section', () => {
    /*beforeEach(() => {
      cy.visit('/')
    })*/

    it('Init basic stuff', () => {
        cy.init()
        cy.createSelectTestProject()
    })

    it('Open Search Datasets panel', () => {
        cy.ensureSectionOpen('cy-search-datasets', 'Search Datasets')
    })

    it('Some facets should be loaded', () => {
        // TODO
    })

    it('Select facets', () => {
        // TODO
    })

    it('See results', () => {
        // TODO
    })

    it('Select datasets', () => {
        // TODO
    })

    it('Save selected datasets', () => {
        // TODO
    })

    it('Save search criterias', () => {
        // TODO
    })


    it('Close Search Datasets panel', () => {
        cy.ensureSectionClose('cy-search-datasets', 'Search Datasets')
        cy.removeTestProject()
    })

})
  