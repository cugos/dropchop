var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.layers = {};
  dc.layers.list = {};

  dc.layers.prepare = function() {
    $(dc).on('file:added', dc.layers.add);
    $(dc).on('layer:remove', dc.layers.remove);
    $(dc).on('layer:duplicate', dc.layers.duplicate);
    $(dc).on('layer:rename', dc.layers.rename);
  };

/**
 * Add a layer to the layers list and trigger layer:added for subscribers to pick up.
 * @param {object} event
 * @param {object} file object
 * @param {string} file blob to be converted with JSON.parse()
 */
  dc.layers.add = function(event, name, blob, ltype, url) {
    if (blob.type === "Topology") {
      blob = topojson.client.feature(blob, blob.objects[Object.keys(blob.objects)[0]]);
    }

    var l = dc.layers.makeLayer(name, blob);
    dc.layers.list[l.stamp] = l;

    if (ltype && url) {
      dc.layers.list[l.stamp].ltype = ltype;
      dc.layers.list[l.stamp].url = url;
    }

    dc.notify('success', '<strong>'+l.name+'</strong> has been added!', 3500);

    // trigger layer:added
    $(dc).trigger('layer:added', [l]);

    // Update URL, if applicable
    if (ltype && url) {
      dc.util.updateSearch();
    }

  };

/**
 * Remove a layer, which triggers layer:removed for the rest of the app
 * @param {string} layer stamp
 */
  dc.layers.remove = function(event, stamp) {
    // trigger layer:removed
    try {
      $(dc).trigger('layer:removed', [stamp]);
      dc.notify('info', '<strong>' + dc.layers.list[stamp].name + '</strong> has been removed.');
      delete dc.layers.list[stamp];
    } catch (err) {
      dc.notify('error', 'There was a problem removing the layer.');
      throw err;
    }
  };

  dc.layers.duplicate = function(event, stamp) {
    var lyr = dc.layers.list[stamp];
    // need to create new layer so we can get a uniqe L.stamp()
    dc.layers.add({}, 'copy_'+lyr.name, lyr.raw);
  };

  dc.layers.rename = function(event, layer, newName) {
    // rename in layer object
    dc.layers.list[layer.stamp].name = newName;

    // rename in layerlist
    $(dc).trigger('layer:renamed', [layer.stamp, newName]);
  };

  dc.layers.makeLayer = function(name, json) {
    var geojson = json;
    // if (json.type === 'FeatureCollection' && json.features.length === 1) {
    //   geojson = dc.util.uncollect(json);
    // }

    var fl = L.mapbox.featureLayer(geojson);
    var layer = {
      name: dc.util.removeFileExtension(name),
      stamp: L.stamp(fl),
      raw: geojson,
      type: getType(geojson),
      featurelayer: fl,
      dateAdded: new Date()
    };
    return layer;
  };

  function getType(gj) {
    if (gj.type === 'FeatureCollection') {
      return 'FeatureCollection';
    } else {
      return gj.type + '<' + gj.geometry.type + '>';
    }
  }

  return dc;

})(dropchop || {});
