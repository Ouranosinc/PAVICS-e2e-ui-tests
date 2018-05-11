import {
    LAYER_SELECTED_REGIONS_NAME,
    LAYER_REGIONS_NAME
} from './../constants';

Cypress.Commands.add('simulateOpenLayersEvent', (ol, map, type, x, y, opt_shiftKey = undefined) => {
    var viewport = map.getViewport();
    let position = viewport.getBoundingClientRect();
    cy.log(`left: ${position.left}, top: ${position.top}, width: ${position.width}, height: ${position.height}`)
    cy.get('canvas').trigger(type, {
        clientX: position.left + x + (position.width / 2),
        clientY: position.top + y + (position.height / 2),
    })
})

  Cypress.Commands.add('hasOpenLayersLoadedRegions', (ol, map, attended) => {
    console.log("Current ol3 global object: %o", ol)
    console.log("Current OLComponent.map instance: %o", map)
  
    let layers = map.getLayers().getArray()
    let found = false;
    cy.wrap(layers).each ((layer)=> {
        cy.log(layer.get('nameId'))
        if (layer instanceof ol.layer.Tile && layer.get('nameId') && layer.get('nameId') === LAYER_REGIONS_NAME) {
          cy.log('Found Tile Layer LAYER_REGIONS')
           // TODO: Figure out how many loaded tiles (?!)
          if(layer.getSource().getState() === 'ready') {
              found = true;
          }
        } 
    }).then(() => {
        cy.wrap(found).should('eq', attended)
    })
  })
  
  Cypress.Commands.add('hasOpenLayersSelectedRegion', (ol, map, count) => {
    console.log("Current ol3 global object: %o", ol)
    console.log("Current OLComponent.map instance: %o", map)
  
    let layers = map.getLayers().getArray()
    cy.wrap(layers).each ((layer)=> {
        if (layer instanceof ol.layer.Vector && layer.get('nameId') && layer.get('nameId') === LAYER_SELECTED_REGIONS_NAME) {
          cy.log('Found Vector Layer LAYER_SELECTED_REGIONS')
          cy.wrap(layer.getSource().getFeatures().length).should('eq', count)
        } 
    });
  })
  
  //Click
  /*cy.get('canvas')
      .trigger('pointerdown')
      .trigger('pointerup')
  
  // Zoom
  cy.get('canvas')
      .trigger('pointerdown')
      .trigger('move', {clientX: 1000, clientY: 500})
      .trigger('pointerup')*/
  
  // Hover (fail)
  /*cy.get('canvas')
      .trigger('mouseover', {pageX: 10, pagetY: 10})
      .trigger('pointermove', {pageX: 10, pagetY: 10})
      .trigger('pointermove', {pageX: 20, pagetY: 20})
      .trigger('pointermove', {pageX: 30, pagetY: 30})
      .trigger('pointermove', {pageX: 40, pagetY: 40})*/
  
  // Pan (fail)
  /*cy.get('canvas')
      .trigger('pointermove')
      .trigger('pointerdown')
      .trigger('pointermove', {clientX: 550, clientY: 50})
      .trigger('pointerdrag', {clientX: 550, clientY: 50})
      .trigger('pointermove', {clientX: 550, clientY: 50})
      .trigger('pointerup')*/
  