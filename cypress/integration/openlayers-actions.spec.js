describe('Test project basic CRUD actions', () => {
    it('Test openlayers http://openlayers.org/en/latest/examples/draw-features.html', () => {
        cy.visit('http://openlayers.org/en/latest/examples/draw-features.html');

        cy.get('canvas')
            .trigger('pointerdown')
            .trigger('pointerup')

        cy.window().then((window) => {
           cy.simulateOpenLayersEvent (window.ol, window.map, 'pointerdown', 50, 50)
           cy.simulateOpenLayersEvent (window.ol, window.map, 'pointerup', 50, 50)
        })
    })
})