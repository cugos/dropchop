var dropchop = (function(dc) {
  dc = dc || {};
  dc.version = '0.1';
  dc.init = function(opts) {
    if(!opts) {
      var err = new Error('No options provided in dropchop.init()');
      throw err;
    }
    dc.options = opts;

    if(!$(opts.id).length) {
      var err = new Error('Element with options.id does not exist.');
      throw err;
    }
    dc.$elem = $(opts.id);

    // setup layers
    dc.layers.prepare();

    // setup map
    dc.map.init();

    // setup selection
    dc.selection.init();

    // setup layerlist
    dc.layerlist.init('layerlist');

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

    dc.util.welcome();

  };

  dc.boom = function() {
    console.log('shakalaka');
  };

  return dc;

})(dropchop || {});