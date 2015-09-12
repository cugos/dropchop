var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.layers = {};
  dc.layers.list = {};

  dc.layers.prepare = function() {
    $(dc.layers).on('file:added', dc.layers.add);
  };

/**
 * Add a layer to the layers list and trigger layer:added for subscribers to pick up.
 * @param {object} event
 * @param {object} file object
 * @param {string} file blob to be converted with JSON.parse()
 */
  dc.layers.add = function(event, file, blob) {
    var l = _makeLayer(file, blob);
    dc.layers.list[l.stamp] = l;

    dc.notify('success', l.name + ' has been added!', 5000);

    // trigger layer:added
    $(dc.layerlist).trigger('layer:added', [l]);
    $(dc.map).trigger('layer:added', [l]);
  };

/**
 * Remove a layer, which triggers layer:removed
 * @param {string} layer ID
 */
  dc.layers.remove = function(layerID) {
    // trigger layer:removed
    delete dc.layers.list[layerID];
  };

  function _makeLayer(f, b) {
    var fl = L.mapbox.featureLayer(b);

    var layer = {
      name: dc.util.removeFileExtension(f.name),
      stamp: L.stamp(fl),
      raw: b,
      featurelayer: fl,
      dateAdded: f.lastModifiedDate
    };
    return layer;
  }

  return dc;

})(dropchop || {});