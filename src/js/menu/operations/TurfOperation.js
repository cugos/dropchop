L.DNC.TurfOperation = L.DNC.Operation.extend({


    options: {
        // supportedFeatures : [],
        minFeatures : 1,
        maxFeatures : 0,
        orderImport : false,
        // iterable : true
        additionalArgs: null // Kludge to handle no dialog for input
    },

    execute: function () {
        /*
        **
        **  TODO: this is the type of referencing
        **  that feels like it should be avoided.
        **  it is the only reference left and it cannot
        **  be factored out until we potentially
        **  revisit how MenBar and Menu are working.
        **
        */
        var layers = L.DNC.app.getLayerSelection();

        // Validate
        this._validate(layers);

        // Prep
        var prepared_args = this._prepareArgs(layers);
        var objects = prepared_args[0];
        var name = prepared_args[1];

        // Call func
        var newLayer = {
            geometry: turf[this.title].apply(null, objects),
            name: this.title + '_' + name + '.geojson'
        };

        var mapLayer = L.mapbox.featureLayer(newLayer.geometry);


        /*
        **
        **  TODO: I'm wondering if we can refactor these classes
        **  to make this type of interaction easier to model
        **
        */
        var eventExtras = { mapLayer: mapLayer, layerName: newLayer.name, isOverlay: true };
        this.parent.parentDomElement.fire('operation-result', eventExtras);
    },

    _validate: function ( layers ) {
        var length = layers.length;
        if (!length) {
            throw new Error("Can't run " + this.title + " on empty selection.");
        }

        if (this.options.maxFeatures && length > this.options.maxFeatures) {
            throw new Error("Too many layers. Max is set to " + this.options.maxFeatures + ", got " + length + ".");
        }

        if (this.options.minFeatures && length < this.options.minFeatures) {
            throw new Error("Too few layers. Min is set to " + this.options.minFeatures + ", got " + length + ".");
        }
    },

    _prepareArgs: function ( layers ) {
        // Get layer objects
        if (this.options.maxFeatures) {
            layers = layers.slice(0, this.options.maxFeatures);
        }
        var layer_objs = layers.map(function(obj) { return obj.layer._geojson; });
        if (this.options.additionalArgs) {
            layer_objs.push(this.options.additionalArgs);
        }

        // Get layer names
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

        return [layer_objs, layer_names_str];
    }

});
