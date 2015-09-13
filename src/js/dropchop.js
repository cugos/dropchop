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

    // setup operations
    dc.ops.init();

    // setup forms
    dc.form.init();

    // get URL information if it exists
    if(location.search.length) {
      dc.util.executeUrlParams();
    }

  };

  dc.boom = function() {
    console.log('shakalaka');
  };

  return dc;

})(dropchop || {});