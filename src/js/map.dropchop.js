var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.map = {};

  dc.map.init = function() {
    dc.map.$elem = $('<div>').prop('id', 'dropchop-map').addClass('map');
    dc.$elem.append(dc.map.$elem);

    _makeMap();
  };

  function _makeMap() {
    dc.map.token = L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
    dc.map.m = L.mapbox.map('dropchop-map', 'mapbox.streets');
    dc.map.layergroup = L.layerGroup().addTo(dc.map.m);
    dc.map.m.zoomControl.removeFrom(dc.map.m);

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
  
  return dc;

})(dropchop || {});