var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.layers = {};
  dc.layers.list = {};

  dc.layers.prepare = function() {
    $(dc.layers).on('file:added', dc.layers.add);
    $(dc.layers).on('layer:removed', dc.layers.remove);
  };

/**
 * Add a layer to the layers list and trigger layer:added for subscribers to pick up.
 * @param {object} event
 * @param {object} file object
 * @param {string} file blob to be converted with JSON.parse()
 */
  dc.layers.add = function(event, name, blob) {
    var l = _makeLayer(name, blob);
    dc.layers.list[l.stamp] = l;

    dc.notify('success', l.name + ' has been added!', 5000);

    // trigger layer:added
    $(dc.layerlist).trigger('layer:added', [l]);
    $(dc.map).trigger('layer:added', [l]);
  };

/**
 * Remove a layer, which triggers layer:removed for the rest of the app
 * @param {string} layer stamp
 */
  dc.layers.remove = function(event, stamp) {
    // trigger layer:removed
    try {
      $(dc.map).trigger('layer:removed', [stamp]);
      $(dc.layerlist).trigger('layer:removed', [stamp]);
      dc.notify('info', '<strong>' + dc.layers.list[stamp].name + '</strong> has been removed.');
      delete dc.layers.list[stamp];
    } catch (err) {
      dc.notify('error', 'There was a problem removing the layer.');
      throw err;
    }
    
  };

  function _makeLayer(name, json) {
    var fl = L.mapbox.featureLayer(json);

    var layer = {
      name: dc.util.removeFileExtension(name),
      stamp: L.stamp(fl),
      raw: json,
      featurelayer: fl,
      dateAdded: new Date()
    };
    return layer;
  }

  return dc;

})(dropchop || {});