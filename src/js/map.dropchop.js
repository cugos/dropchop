var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.map = {};

  dc.map.init = function() {
    dc.map.$elem = $('<div>').prop('id', 'dropchop-map').addClass('map');
    dc.$elem.append(dc.map.$elem);

    $(dc.map).on('layer:removed', dc.map.removeLayer);

    _makeMap();
  };

  function _makeMap() {
    dc.map.token = L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
    dc.map.m = L.mapbox.map('dropchop-map', null, {
      zoomControl: false,
      worldCopyJump: true
    }).setView([0,0], 3);

    var baseLayers = {
      "Mapbox Streets": L.mapbox.tileLayer('mapbox.streets'),
      "Mapbox Outdoors": L.mapbox.tileLayer('mapbox.outdoors'),
      "Mapbox Light": L.mapbox.tileLayer('mapbox.light'),
      "Mapbox Dark": L.mapbox.tileLayer('mapbox.dark'),
      "Mapbox Satellite": L.mapbox.tileLayer('mapbox.satellite')
    };

    baseLayers['Mapbox Streets'].addTo(dc.map.m);
    // sets location of base layer control to the bottom right
    L.control.layers(baseLayers, {}, {
      position: 'bottomright',
      collapsed: false
    }).addTo(dc.map.m);

    // sets the location of the zoom buttons to the top right
    L.control.zoom({
      position: 'topright'
    }).addTo(dc.map.m);

    dc.map.layergroup = L.mapbox.featureLayer().addTo(dc.map.m);

    $(dc.map).on('layer:added', dc.map.addLayer);
    $(dc.map).on('layer:hide', dc.map.hideLayer);
    $(dc.map).on('layer:show', dc.map.showLayer);
  }

  dc.map.addLayer = function(event, layer) {
    dc.map.layergroup.addLayer(layer.featurelayer);
  };

  dc.map.hideLayer = function(event, layer) {
    dc.map.layergroup.removeLayer(layer.featurelayer);
  };

  dc.map.showLayer = function(event, layer) {
    dc.map.layergroup.addLayer(layer.featurelayer);
  };
  
  dc.map.removeLayer = function(event, stamp) {
    dc.map.layergroup.removeLayer(dc.layers.list[stamp].featurelayer);
  };

  return dc;

})(dropchop || {});