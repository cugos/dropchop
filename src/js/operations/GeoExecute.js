L.DNC = L.DNC || {};
L.DNC.GeoExecute = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    **
    */
    execute: function ( action, parameters, options, layers ) {

        L.setOptions(this, options);
        this.action = action;

        /*
        **
        **  TODO: I think validation should happen before the
        **  submit form is rendered on the DOM. If we plan to
        **  only show available operations then we'll have to
        **  do it there anyways.
        **
        **/
        this.validate(layers, options);

        // Prep
        var params = this._prepareParameters( layers, options, parameters );
        var name = this._prepareName( layers );

        console.debug(params, name);

        // Call func
        var newLayer = {
            geometry: turf[this.action].apply(null, params),
            name: this.action + '_' + name + '.geojson'
        };

        // if the new object is a feature collection and only has one layer,
        // remove it and just keep it as a feature
        if ( newLayer.geometry.type == "FeatureCollection" && newLayer.geometry.features.length == 1 ) {
            newLayer.geometry = this._unCollect( newLayer.geometry );
        }

        return newLayer;
    },


    /*
    **
    **  VALIDATE LAYERS
    **  Checks if the proper number of layers are in the current selection to
    **  allow Turf operations to run
    **
    */
    validate: function ( layers, options ) {
        var length = layers.length;

        // TODO: This should live elsewhere
        function ValidationError(message) {
              this.name = 'ValidationError';
              this.message = message || 'Validation Error';
        }
        ValidationError.prototype = Object.create(Error.prototype);
        ValidationError.prototype.constructor = ValidationError;

        if (!length) {
            throw new ValidationError("Can't run " + this.title + " on empty selection.");
        }

        if (options.maxFeatures && length > options.maxFeatures) {
            throw new ValidationError("Too many layers. Max is set to " + options.maxFeatures + ", got " + length + ".");
        }

        if (options.minFeatures && length < options.minFeatures) {
            throw new ValidationError("Too few layers. Min is set to " + options.minFeatures + ", got " + length + ".");
        }
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
