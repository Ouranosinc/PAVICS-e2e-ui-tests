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
  cy.wrap(layers).each((layer) => {
    cy.log(layer.get('nameId'))
    if (layer instanceof ol.layer.Tile && layer.get('nameId') && layer.get('nameId') === LAYER_REGIONS_NAME) {
      cy.log('Found Tile Layer LAYER_REGIONS')
      // TODO: Figure out how many loaded tiles (?!)
      if (layer.getSource().getState() === 'ready') {
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
  cy.wrap(layers).each((layer) => {
    if (layer instanceof ol.layer.Vector && layer.get('nameId') && layer.get('nameId') === LAYER_SELECTED_REGIONS_NAME) {
      cy.log('Found Vector Layer LAYER_SELECTED_REGIONS')
      console.log('Features: %o', layer.getSource().getFeatures())
      cy.wrap(layer.getSource().getFeatures().length).should('gte', 1) // FIXME .should('eq', count)
    }
  });
})

Cypress.Commands.add('selectFirstShapeFile', (key) => {
  cy.get('#cy-layerswitcher-regions-tab').click()
  cy.get(`.cy-layerswitcher-shapefile-item`).first().click()
})

Cypress.Commands.add('selectShapeFileByKey', (key) => {
  cy.get('#cy-layerswitcher-regions-tab').click()
  cy.get(`.cy-layerswitcher-shapefile-item#cy-shapefile-name-${key}`).click()
})

Cypress.Commands.add('selectRegionByCoordinates', (x, y) => {
  cy.route({ method: 'get', url: new RegExp(/geoserver\/wfs?.*request=GetFeature.*/i) }).as('geoserverGetFeature')
  cy.window().then((window) => {
    console.log("Current window: %o", window)
    console.log("Current ol3 global object: %o", window.ol)
    console.log("Current OLComponent.map instance: %o", window.cyCurrentMap)
    // Should select Alberta province
    cy.simulateOpenLayersEvent(window.ol, window.cyCurrentMap, 'pointerdown', x, y);
    cy.simulateOpenLayersEvent(window.ol, window.cyCurrentMap, 'pointerup', x, y);
    cy.wait('@geoserverGetFeature')
  })
})

// Alias actionsBtnAlias must be defined before the call
Cypress.Commands.add('triggerVisualize', (actionsBtnAlias, visualizeItemId, actionsLength = 3) => {
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetCapabilities.*$/i), method: 'get' }).as('ncwms2GetCapabilities')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMetadata.*$/i), method: 'get' }).as('ncwms2GetMetadata')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMap.*$/i), method: 'get' }).as('ncwms2GetMap')
  cy.get(actionsBtnAlias).click()
  cy.get('ul[role=listbox]').children().should('to.have.lengthOf', actionsLength) // X actions attended
  cy.get(`ul[role=listbox] #${visualizeItemId}`).click() // Trigger action
  cy.wait('@ncwms2GetCapabilities').then((xhr) => {
    cy.wrap(xhr.response.body.type).should('eq', 'text/xml')
    cy.wrap(xhr.status).should('eq', 200)
  })
  cy.wait('@ncwms2GetMetadata').then((xhr) => {
    cy.wrap(xhr.response.body.type).should('eq', 'application/json')
    cy.wrap(xhr.status).should('eq', 200)
  })
  cy.wait('@ncwms2GetMap').then((xhr) => {
    cy.wrap(xhr.response.body.type).should('eq', 'text/xml')
    // Error <ServiceExceptionReport> Must provide a value for VERSION attended tho
    cy.wrap(xhr.status).should('eq', 200)
  })
  // cy.get('#cy-sectional-content h2').click() // Close actions menu

  cy.get('.notification-container .notification-message h4').should('contain', 'Information')
  cy.get('.notification-container .notification-info').click()
})

// First dataset must a be a single file dataset
// Project section must be opened
// By default we expect "200 - Success" returns
Cypress.Commands.add('visualizeFirstSingleFileDataset', (
  getCapabilitiesAttendedCode = 200, 
  getMetadataAttendedCode = 200,
  getMapAttendedCode = 200) => {
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetCapabilities.*$/i), method: 'get' }).as('ncwms2GetCapabilities')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMetadata.*$/i), method: 'get' }).as('ncwms2GetMetadata')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMap.*$/i), method: 'get' }).as('ncwms2GetMap')
  cy.get('.cy-project-dataset-item .cy-actions-btn').first().click()
  cy.get('ul[role=listbox]').children().should('to.have.lengthOf', 3) // 3 actions attended
  cy.get('ul[role=listbox] #cy-visualize-item').click() // Trigger action
  cy.wait('@ncwms2GetCapabilities').then((xhr) => {
    cy.wrap(xhr.response.body.type).should('eq', 'text/xml')
    cy.wrap(xhr.status).should('eq', getCapabilitiesAttendedCode)

    // If GetCapabilities fails, GetMetadata and GetMap won't be called at all
    if (getCapabilitiesAttendedCode === 200) {
      cy.wait('@ncwms2GetMetadata').then((xhr) => {
        // FIXME: Error returns XML
        // cy.wrap(xhr.response.body.type).should('eq', 'application/json')
        cy.wrap(xhr.status).should('eq', getMetadataAttendedCode)
      })
      cy.wait('@ncwms2GetMap').then((xhr) => {
        cy.wrap(xhr.response.body.type).should('eq', 'text/xml')
        // Error <ServiceExceptionReport> Must provide a value for VERSION attended tho
        cy.wrap(xhr.status).should('eq', getMapAttendedCode)
      })
    }
  })

  cy.get('#cy-sectional-content h2').click() // Close actions menu
})

Cypress.Commands.add('togglePointInfoWidget', () => {
  cy.get('#cy-menu-point-info-toggle2').click()
})

Cypress.Commands.add('toggleTimeSerieWidget', () => {
  cy.get('#cy-menu-time-series-toggle a svg').click()
})

Cypress.Commands.add('toggleLayerSwitcherWidget', () => {
  cy.get('#cy-menu-layer-switcher-toggle a svg').click()
})

Cypress.Commands.add('toggleTimeSliderWidget', () => {
  cy.get('#cy-menu-temporal-slider-toggle a svg').click()
})

Cypress.Commands.add('toggleMapControlsWidget', () => {
  cy.get('#cy-menu-map-controls-toggle a svg').click()
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
