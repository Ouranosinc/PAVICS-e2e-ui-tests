// import TileLayer from 'ol/layer/Tile'; // Yes OL5 seriously published ES6 modules ...
// import VectorLayer from 'ol/layer/Vector'; // Yes OL5 seriously published ES6 modules ...
import {
  LAYER_SELECTED_REGIONS_NAME,
  LAYER_REGIONS_NAME
} from './../constants';

Cypress.Commands.add('simulateOpenLayersEvent', (map, type, x, y, opt_shiftKey = undefined) => {
  var viewport = map.getViewport();
  let position = viewport.getBoundingClientRect();
  cy.log(`left: ${position.left}, top: ${position.top}, width: ${position.width}, height: ${position.height}`)
  cy.get('canvas.ol-unselectable').trigger(type, {
    clientX: position.left + x + (position.width / 2),
    clientY: position.top + y + (position.height / 2),
  })
})

Cypress.Commands.add('hasOpenLayersLoadedRegions', (map, attended) => {
  console.log("Current OLComponent.map instance: %o", map)

  let layers = map.getLayers().getArray()
  let found = false;
  cy.wrap(layers).each((layer) => {
    cy.log(layer)
    cy.log(layer.get('nameId'))
    if (/*layer instanceof TileLayer && */layer.get('nameId') && layer.get('nameId') === LAYER_REGIONS_NAME) {
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

Cypress.Commands.add('hasOpenLayersSelectedRegion', (map, count) => {
  console.log("Current OLComponent.map instance: %o", map)

  let layers = map.getLayers().getArray()
  cy.wrap(layers).each((layer) => {
    if (/*layer instanceof VectorLayer && */layer.get('nameId') && layer.get('nameId') === LAYER_SELECTED_REGIONS_NAME) {
      cy.log('Found Vector Layer LAYER_SELECTED_REGIONS')
      console.log('Features: %o', layer.getSource().getFeatures())
      cy.wrap(layer.getSource().getFeatures().length).should('gte', 1) // FIXME .should('eq', count)
    }
  });
})

Cypress.Commands.add('selectFirstFeatureLayer', (key) => {
  cy.get('#cy-layerswitcher-regions-tab').click()
  cy.get(`.cy-layerswitcher-feature-layer-item`).first().click()
})

Cypress.Commands.add('selectFeatureLayerByKey', (key) => {
  cy.get('#cy-layerswitcher-regions-tab').click()
  cy.get(`.cy-layerswitcher-feature-layer-item#cy-feature-layer-name-${key}`).click()
})

Cypress.Commands.add('selectRegionByCoordinates', (x, y) => {
  cy.route({ method: 'get', url: new RegExp(/geoserver\/wfs?.*request=GetFeature.*/i) }).as('geoserverGetFeature')
  cy.window().then((window) => {
    console.log("Current window: %o", window)
    console.log("Current OLComponent.map instance: %o", window.cyCurrentMap)
    // Should select Alberta province
    cy.simulateOpenLayersEvent(window.cyCurrentMap, 'pointerdown', x, y);
    cy.simulateOpenLayersEvent(window.cyCurrentMap, 'pointerup', x, y);
    cy.wait('@geoserverGetFeature')
  })
})

// Alias actionsBtnAlias must be defined before the call
Cypress.Commands.add('triggerVisualize', (actionsBtnAlias, visualizeItemId, actionsLength = 4) => {
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetCapabilities.*$/i), method: 'get' }).as('ncwms2GetCapabilities')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMetadata.*$/i), method: 'get' }).as('ncwms2GetMetadata')
  cy.route({ url: new RegExp(/.*\/ncWMS2\/wms?.*REQUEST=GetMap.*$/i), method: 'get' }).as('ncwms2GetMap')
  cy.get(actionsBtnAlias).click({force:true})
  cy.get('ul[role=menu]').children().should('to.have.lengthOf', actionsLength) // X actions attended
  cy.get(`ul[role=menu] #${visualizeItemId}`).click() // Trigger action
  cy.wait('@ncwms2GetCapabilities').then((xhr) => {
    cy.shouldNotifyInformation()
    
    cy.wrap(xhr.response.body.type).should('eq', 'text/xml')
    cy.wrap(xhr.status).should('eq', 200)

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
  })
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
  cy.get('ul[role=menu]').children().should('to.have.lengthOf', 4) // 4 actions attended
  cy.get('ul[role=menu] #cy-visualize-item').click() // Trigger action
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
  cy.get('#cy-speed-dial-menu-btn').click()
  cy.get('#cy-menu-point-info-toggle-btn').click()
  cy.get('#cy-speed-dial-menu-btn').click()
})

Cypress.Commands.add('toggleTimeSerieWidget', () => {
  cy.get('#cy-speed-dial-menu-btn').click()
  cy.get('#cy-menu-time-series-toggle-btn').click()
  cy.get('#cy-speed-dial-menu-btn').click()
})

Cypress.Commands.add('toggleLayerSwitcherWidget', () => {
  cy.get('#cy-speed-dial-menu-btn').click()
  cy.get('#cy-menu-layer-switcher-toggle-btn').click()
  cy.get('#cy-speed-dial-menu-btn').click()
})

Cypress.Commands.add('toggleTimeSliderWidget', () => {
  cy.get('#cy-speed-dial-menu-btn').click()
  cy.get('#cy-menu-temporal-slider-toggle-btn').click()
  cy.get('#cy-speed-dial-menu-btn').click()
})

Cypress.Commands.add('toggleMapControlsWidget', () => {
  cy.get('#cy-speed-dial-menu-btn').click()
  cy.get('#cy-menu-map-controls-toggle-btn').click()
  cy.get('#cy-speed-dial-menu-btn').click()
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
