var dropchop = (function(dc) {
  dc = dc || {};
  dc.version = '0.1';
  dc.init = function(opts) {
    if(!opts) {
      dc.util.error('No options provided in dropchop.init()');
    }
    dc.options = opts;

    if(!$(opts.id).length) {
      dc.util.error('Element with options.id does not exist.');
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