var dropchop = (function(dc) {
  dc = dc || {};

  dc.init = function(opts) {
    dc.options = opts;
    dc.$elem = $(opts.id);

    // setup layers
    dc.layers.prepare();

    // setup map
    dc.map.init();

    // setup selection
    dc.selection.init();

    // setup layerlist
    dc.layerlist.create('layerlist');

    // setup dropzone
    dc.dropzone($('body'));

  };

  dc.boom = function() {
    console.log('shakalaka');
  };

  return dc;

})(dropchop || {});