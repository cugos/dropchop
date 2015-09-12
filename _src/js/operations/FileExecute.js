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
        var actions = {
            'save geojson': function ( action, parameters, options, layers, callback ) {
                console.debug("Saving GeoJSON");

                for (var i=0; i<layers.length; i++) {
                    var prefix = parameters[0];
                    var content = JSON.stringify(layers[i].layer._geojson);
                    var title = prefix + '_' + layers[i].name;
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
                        shpwrite.download(layers[ii].layer._geojson, shpOptions);
                    }
                }
                catch(err) {
                    console.error(err);
                    this.notification.add({
                        text: "Error downloading one of the shapefiles... please try downloading in another format",
                        type: 'alert',
                        time: 3500
                    });
                }
            },

            remove: function( action, parameters, options, layers, callback ){
                callback({
                    remove: layers.map(
                        function(l){ return { layer: l.layer, name: l.name };
                    })
                });
            },

            upload: function ( action, parameters, options, layers, callback ){
                var files = document.querySelectorAll('input[type=file]')[0].files;
                this.fire('uploadedfiles', files);
            },

            'load from url': function ( action, parameters, options, layers, callback ) {
                var url = parameters[0];
                console.debug('Retrieving url ' + url);
                this.getRequest(url, function(xhr) {
                    if (xhr.status === 200) {
                        var filename = xhr.responseURL.substring(xhr.responseURL.lastIndexOf('/')+1);
                        return this._addJsonAsLayer(xhr.responseText, filename, callback);
                    } else {
                        console.error('Request failed. Returned status of ' + xhr.status);
                    }
                });
            },

            'load from gist': function ( action, parameters, options, layers, callback ) {
                var gist = parameters[0];
                gist = gist.split('/')[gist.split('/').length-1];
                console.debug('Retrieving gist ' + gist);
                url = 'https://api.github.com/gists/' + gist;

                this.getRequest(url, function(xhr) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        for (var filename in data.files) {
                            var file = data.files[filename];
                            this._addJsonAsLayer(file.content, file.filename, callback);
                        }
                    } else {
                        console.error('Request failed. Returned status of ' + xhr.status);
                    }
                });
            },
        };
        if (typeof actions[action] !== 'function') {
          throw new Error('Invalid action.');
        }
        return actions[action].call(this, action, parameters, options, layers, callback);
    },

    /*
    **
    ** Ajax GET
    **
    */
    getRequest: function ( url, callback ) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI(url));

        xhr.onload = callback.bind(this, xhr);
        xhr.onerror = function( xhr ) {
            console.error(xhr);
            this.notification.add({
                text: 'Unable to access ' + url,
                type: 'alert',
                time: 2500
            });
        };

        xhr.send();
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
    },

    /*
    **
    ** Add raw JSON string to system as a new layer
    **
    */
    _addJsonAsLayer: function (raw_content, filename, callback) {
        try {
            var newLayer = {
                geojson: JSON.parse(raw_content),
                name: filename
            };

            // if the new object is a feature collection and only has one layer,
            // remove it and just keep it as a feature
            if ( newLayer.geojson.type == "FeatureCollection" && newLayer.geojson.features.length == 1 ) {
                newLayer.geojson = this._unCollect( newLayer.geojson );
            }

            return callback( { add: [newLayer] } );
        } catch(err) {
            console.error(err);
            this.notification.add({
                text: 'Failed to add ' + filename,
                type: 'alert',
                time: 2500
            });
            return;
        }
    }

});
