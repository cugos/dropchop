var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  
  dc.selection = {};
  dc.selection.list = {};

  dc.selection.init = function() {
    $(dc.selection).on('layer:selected', dc.selection.add);
    $(dc.selection).on('layer:unselected', dc.selection.remove);
  };

  dc.selection.add = function(event, layer) {
    console.log(dc.selection.list);
    dc.selection.list[layer.stamp] = layer;
  };

  dc.selection.remove = function(event, layer) {
    console.log(dc.selection.list);
    delete dc.selection.list[layer.stamp];
  };

  dc.selection.clear = function() {
      $('.layer-name.selected').removeClass('selected');
      dc.selection.list = {};
  };

  return dc;


})(dropchop || {});