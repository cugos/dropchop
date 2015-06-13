var shpwrite = require('shp-write');
var saveAs = require('browser-filesaver');

L.Dropchop = L.Dropchop || {};
L.Dropchop.FileExecute = L.Dropchop.BaseExecute.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    **
    */
    execute: function ( action, parameters, options, layers, callback ) {
        var _this = this;
        var actions = {
            'save geojson': function ( action, parameters, options, layers, callback ) {
                console.debug("Saving GeoJSON");

                for (var i=0; i<layers.length; i++) {
                    var prefix = parameters[0];
                    var content = JSON.stringify(layers[i].layer._geojson);
                    var title = prefix + '_' + layers[i].name;
                    console.log(title);
                    saveAs(new Blob([content], {
                        type: 'text/plain;charset=utf-8'
                    }), title);
                }
            },

            'save shapefile': function ( action, parameters, options, layers, callback ) {
                console.debug("Saving Shapefile");
                try {
                    for (var ii=0; ii<layers.length; ii++) {
                        var shpOptions = {
                            folder: 'myshapes',
                            types: {
                                point: 'mypoints',
                                polygon: 'mypolygons',
                                line: 'mylines'
                            }
                        };
                        console.log(layers[ii]);
                        shpwrite.download(layers[ii].layer._geojson, shpOptions);
                    }
                }
                catch(err) {
                    console.log(err);
                    L.Dropchop.app.notification.add({
                        text: "Error downloading one of the shapefiles... please try downloading in another format",
                        type: 'alert',
                        time: 3500
                    });
                }
            },

            remove: function( action, parameters, options, layers ){
                callback({
                    remove: layers.map(
                        function(l){ return { layer: l.layer, name: l.name };
                    })
                });
            },

            upload: function ( action, parameters, options, layers ){
                var files = document.querySelectorAll('input[type=file]')[0].files;
                _this.fire('uploadedfiles', files);
            },

            'load from url': function ( action, parameters, options, layers ) {
                var url = parameters[0];
                var xhr = new XMLHttpRequest();
                xhr.open('GET', encodeURI(url));
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var newLayer = JSON.parse(xhr.responseText);
                        var filename = xhr.responseURL.substring(xhr.responseURL.lastIndexOf('/')+1);

                        // if the new object is a feature collection and only has one layer,
                        // remove it and just keep it as a feature
                        if ( newLayer.geometry.type == "FeatureCollection" && newLayer.geometry.features.length == 1 ) {
                            newLayer.geometry = this._unCollect( newLayer.geometry );
                        }

                        callback( { add: [{ geometry: newLayer, name: filename }] } );
                    } else {
                        console.error('Request failed. Returned status of ' + xhr.status);
                    }
                };
                xhr.send();
            }
        };
        if (typeof actions[action] !== 'function') {
          throw new Error('Invalid action.');
        }
        return actions[action](action, parameters, options, layers);
    },

    /*
    **
    **  VALIDATE LAYERS
    **  Checks if the proper number of layers are in the current selection to
    **  allow Turf operations to run
    **
    */
    validate: function ( layers, options ) {
        return true;
    },

    /*
    **
    **  PREPARE DATA
    **  Prepares the selected data to be run through Turf operations
    **  and builds the new layer name
    **
    */
    _prepareParameters: function ( layers, options, params ) {
        if (options.maxFeatures) {
            layers = layers.slice(0, options.maxFeatures);
        }
        var layer_objs = layers.map(function(obj) { return obj.layer._geojson; });
        console.debug(layer_objs, params);

        if ( params ) {
            for ( var l = 0; l < params.length; l++ ) {
                layer_objs.push(params[l]);
            }
        }
        return layer_objs;
    },

    _prepareName: function ( layers ) {
        // Get layer names
        var layer_names = layers.map(function(obj) { return obj.name; });
        var layer_names_str = '';
        if (layer_names.length === 1) {
            // Rm file extension
            layer_names_str = layer_names[0].split('.')[0];
        } else {
            // Merge layer names w/o extensions
            layer_names_str = layer_names.reduce(function(a, b) {
                return a.split('.')[0] + '_' + b.split('.')[0];
            });
        }
        return layer_names_str;
    },

    /*
    **
    **  Used to standardize features if they exist as feature collections,
    **  which tend to break during certain Turf functions.
    **  Issue: drop-n-chop/issues/5
    **
    */
    _unCollect: function( feature ) {
        return feature.features[0];
    }

});
