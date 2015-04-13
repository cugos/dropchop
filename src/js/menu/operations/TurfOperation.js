L.DNC.TurfOperation = L.DNC.Operation.extend({

    options: {
        // supportedFeatures : [],
        minFeatures : 1,
        maxFeatures : 0,
        orderImport : false,
        // iterable : true
        additionalArgs: null // Kludge to handle no dialog for input
    },

    initialize: function ( title, options ) {
        L.DNC.Operation.prototype.initialize.call(this, title, options);
    },

    _execute: function( ) {
        // Prepare args
        var layers = L.DNC.layerlist.selection.list;
        if (this.options.maxFeatures) {
            layers = layers.slice(0, this.options.maxFeatures);
        }
        var layer_objs = layers.map(function(obj) { return obj.layer._geojson; });
        if (this.options.additionalArgs) {
            layer_objs.push(this.options.additionalArgs);
        }
        var layer_names = layers.map(function(obj) { return obj.info.name; });
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

        // Call func
        var newLayer = {
            geometry: turf[this.title].apply(null, layer_objs),
            name: this.title + '_' + layer_names_str + '.geojson'
        };

        // TODO: Should all layers be added?
        var mapLayer = L.mapbox.featureLayer(newLayer.geometry);
        L.DNC.layerlist.addLayerToList( mapLayer, newLayer.name, true );
    },

});
