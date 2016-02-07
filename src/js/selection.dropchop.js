var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};

  dc.selection = {};
  dc.selection.list = [];

  dc.selection.init = function() {
    $(dc).on('layer:selected', dc.selection.add);
    $(dc).on('layer:unselected', dc.selection.remove);
    $(dc).on('layer:removed', _layerRemoved);
  };

  dc.selection.add = function(event, layer) {
    dc.selection.list.push(layer);
  };

  dc.selection.remove = function(event, layer) {
    var index = null;
    $(dc.selection.list).each(function(i) {
      if (dc.selection.list[i].stamp === layer) {
        index = i;
      }
    });
    dc.selection.list.splice(index, 1); // remove outside of the loop so we don't break our count
  };

  dc.selection.clear = function() {
    $('.layer-name.selected').removeClass('selected');
    $('.operation-geo').addClass('operation-inactive');
    $('.operation-geo').prop('disabled', true);
    dc.selection.list = [];
  };

  dc.selection.isSelected = function(lyrData) {
    return Boolean(dropchop.selection.list.indexOf(lyrData) + 1);
  };

  function _layerRemoved(event, stamp) {
    dc.selection.remove({}, {stamp: stamp});
    dc.selection.clear();
  }

  return dc;


})(dropchop || {});
