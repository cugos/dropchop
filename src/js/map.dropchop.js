var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.map = {};

  dc.map.init = function() {
    dc.map.$elem = $('<div>').prop('id', 'dropchop-map').addClass('map');
    dc.$elem.append(dc.map.$elem);

    $(dc).on('layer:removed', dc.map.removeLayer);

    _makeMap();
  };

  function _makeMap() {
    dc.map.token = L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
    dc.map.m = L.mapbox.map('dropchop-map', null, {
      zoomControl: false,
      worldCopyJump: true
    }).setView([0,0], 3);

    // sets the location of the zoom buttons to the top right
    L.control.zoom({
      position: 'topleft'
    }).addTo(dc.map.m);

    L.mapbox.geocoderControl('mapbox.places', {
      position: 'topleft'
    }).addTo(dc.map.m);

    var baseLayers = {
      "Mapbox Streets": L.mapbox.tileLayer('mapbox.streets'),
      "Mapbox Outdoors": L.mapbox.tileLayer('mapbox.outdoors'),
      "Mapbox Light": L.mapbox.tileLayer('mapbox.light'),
      "Mapbox Dark": L.mapbox.tileLayer('mapbox.dark'),
      "Mapbox Satellite": L.mapbox.tileLayer('mapbox.satellite'),
    };

    baseLayers['Mapbox Streets'].addTo(dc.map.m);
    // sets location of base layer control to the bottom right
    dc.map.baseLayers = L.control.layers(baseLayers, {}, {
      position: 'bottomright',
      collapsed: false
    }).addTo(dc.map.m);

    dc.map.layergroup = L.mapbox.featureLayer();
    dc.map.layergroup.addTo(dc.map.m);

    $(dc).on('layer:added', dc.map.addLayer);
    $(dc).on('layer:hide', dc.map.hideLayer);
    $(dc).on('layer:show', dc.map.showLayer);
    $(dc).on('map:custom-base-layer', dc.map.newBaseLayer);

    // my location as layer
    $(dc.map.m).on('locationfound', function(e) {
      var data = e.originalEvent;
      dc.map.m.fitBounds(data.bounds);

      var lyr = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [data.latlng.lng, data.latlng.lat]
        },
        properties: {
          'title': 'There You Are',
          'marker-color': '#207178',
          'marker-symbol': 'heart'
        }
      };

      $(dc).trigger('file:added', ['your location', lyr]);
    });

    $(dc.map.m).on('locationerror', function() {
      dc.notify('error', 'There was a problem finding your location.', 3000);
    });

  }

  dc.map.count = 0;

  dc.map.addLayer = function(event, layer) {
    var fl = layer.featurelayer;
    dc.map.layergroup.addLayer(fl);

    // create popup table for each feature
    fl.eachLayer(function(layer) {
      var content = '<table class="dropchop-table"><tr><th>Property</th><th>Data</th></tr>';

      if (layer.feature.properties) {
        for (var prop in layer.feature.properties) {
          content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
        }
      } else {
        content += '<p>There are no properties set for this feature.</p>';
      }
      content += '</table>';

      layer.bindPopup(L.popup({
        maxWidth: 450,
        maxHeight: 200,
        autoPanPadding: [45, 45],
        className: 'dropchop-popup'
      }, layer).setContent(content));
    });

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

  dc.map.newBaseLayer = function(event, url, name) {
    L.mapbox.tileLayer(url).addTo(dc.map.m);
    // var newLayer = dc.map.baseLayers.addBaseLayer();
    // L.mapbox.tileLayer(newLayer).addTo(dc.map.m);
  };

  return dc;

})(dropchop || {});
