L.DNC = L.DNC || {};
L.DNC.FileExecute = L.Class.extend({
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

        if (layers.length === 0) {
            // we must not have a layer to download... so bail
            L.DNC.app.notification.add({
                text: "Save requires a layer selected",
                type: 'alert',
                time: 3500
            });
            return;
        }
        // Prep
        var params = this._prepareParameters( layers, options, parameters );
        var name = this._prepareName( layers );

        console.debug(action, params, name);

        if ( action == 'Save GeoJSON') { 
            console.debug("Saving GeoJSON");
            for (var i=0; i<params.length-1; i++) {
                var content = JSON.stringify(params[i]);
                var meta = params[params.length-1];
                if (meta) {
                    if (i>0) {
                        meta = meta+i;
                    }
                    meta = meta + '.geojson';
                } else {
                    meta = 'dnc'+i+'.geojson';
                }
                saveAs(new Blob([content], {
                    type: 'text/plain;charset=utf-8'
                }), meta);
            }
        } else if (action == 'Save Shapefile') {
            console.debug("Saving Shapefile");
            try {
                for (var ii=0; ii<params.length; ii++) {
                    shpwrite.download(params[ii]);
                }
            }
            catch(err) {
                L.DNC.app.notification.add({
                    text: "Error downloading one of the shapefiles... please try downloading in another format",
                    type: 'alert',
                    time: 3500
                });
            } 
        }
        return;
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
