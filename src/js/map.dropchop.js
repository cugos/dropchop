var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.map = {};

  dc.map.init = function() {
    dc.map.$elem = $('<div>').prop('id', 'dropchop-map').addClass('map');
    dc.$elem.append(dc.map.$elem);

    $(dc).on('layer:added', dc.map.addLayer);
    $(dc).on('layer:hide', dc.map.hideLayer);
    $(dc).on('layer:show', dc.map.showLayer);
    $(dc).on('layer:removed', dc.map.removeLayer);

    _makeMap();
  };

  function _makeMap() {
    dc.map.token = mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
    dc.map.m = new mapboxgl.Map({
      container: 'dropchop-map',
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [0,0],
      zoom: 3
    });

    // sets the location of the geocoder, zoom and compass to the top left
    dc.map.m.addControl(new mapboxgl.Geocoder({ position: 'top-left'}));
    dc.map.m.addControl(new mapboxgl.Navigation({position: 'top-left'}));

    //TODO:  Basemap switcher

    //TODO: Add user's location to map as layer

    dc.map.popup = new mapboxgl.Popup();

    dc.map.m.on('click', function(e) {
      dc.map.m.featuresAt(e.point, {
        radius: 7.5,
        includeGeometry: true
      }, function(err, features) {
        if (err || !features.length) {
          dc.map.popup.remove();
          return;
        }
        var feature = features[0];

        dc.map.popup.setLngLat(feature.geometry.coordinates)
          .setHTML(dc.util.getPopupContent(feature.properties))
          .addTo(dc.map.m);

      });
    });

  }


  dc.map.count = 0;

  dc.map.addLayer = function(event, layer) {

    dc.map.m.addSource(layer.stamp, {
      "type": "geojson",
      "data": layer.data
    });

    dc.map.m.addLayer({
      "id": layer.stamp,
      "name": layer.name,
      "interactive": true,
      "type": "circle",
      "source": layer.stamp
    });
  };

  dc.map.hideLayer = function(event, layer) {
    dc.map.m.removeLayer(layer.stamp);
  };

  dc.map.showLayer = function(event, layer) {
    dc.map.m.addLayer({
      "id": layer.stamp,
      "name": layer.name,
      "interactive": true,
      "type": "circle",
      "source": layer.stamp
    });
  };

  dc.map.removeLayer = function(event, layer) {
    dc.map.m.removeLayer(layer.stamp);
    dc.map.m.removeSource(layer.stamp);
  };

  return dc;

})(dropchop || {});
