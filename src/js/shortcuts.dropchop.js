var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};

  dc.shortcuts = {};
  dc.shortcuts.list = [];

  dc.shortcuts.init = function() {
    // Select All
    Mousetrap.bind(['command+a', 'ctrl+a'], function(e) {
      dc.layerlist.selectAll();
      return false;
    });

    // Clear Selection
    Mousetrap.bind(['command+backspace', 'ctrl+backspace'], function(e) {
      dc.layerlist.clearSelection();
      return false;
    });

    // Delete Selected Layers
    Mousetrap.bind(['ctrl+shift+k'], function(e) {
      dc.ops.file.remove.execute();
      return false;
    });

    // Uncheck Layer Visibility
    Mousetrap.bind(['command+plus', 'ctrl+plus', 'command+=', 'ctrl+='], function(e) {
      dropchop.layerlist.checkAll(true);
      return false;
    });

    // Check Layer Visibility
    Mousetrap.bind(['command+-', 'ctrl+-'], function(e) {
      dc.layerlist.uncheckAll(true);
      return false;
    });
  };
  return dc;


})(dropchop || {});