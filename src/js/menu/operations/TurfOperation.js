L.DNC.TurfOperation = L.DNC.Operation.extend({


    options: {
        // supportedFeatures : [],
        minFeatures : 1,
        maxFeatures : 0,
        orderImport : false,
        // iterable : true
        additionalArgs: null // Kludge to handle no dialog for input
    },

    /*
    **
    ** RENDER INPUT TEMPLATE
    **
    */
    renderForm: function () {
        console.log(this.options.description);
        var html =  '<div class="form-inner"><div class="form">'+
                    '<button type="button" class="btn close form-close"><i class="fa fa-times"></i></button>'+
                    '<div class="form-information"><h3 class="form-title">'+this.title+'</h3>'+
                    '<p class="form-description">'+this.options.description+'</p></div>'+
                    '<form class="form-inputs">';

        for ( var i = 0; i < this.options.parameters.length; i++ ) {
            var parameter = this.options.parameters[i];
            
            var input = '<div class="parameter"><label class="parameter-name">' + parameter.name + '</label>';
            
            if ( parameter.type == 'select') {
                input += this._inputTypeSelect( parameter );
            } else {
                input += this._inputTypeDefault( parameter );
            }

            if (parameter.description) input += '<p class="parameter-description">' + parameter.description + '</p>';
            html += input + '</div>';
        }

        // submit button 
        html += '<button type="button" class="btn form-submit">Execute<i class="fa fa-thumbs-o-up push-left"></i></button>';
        html += '</div></div>';

        var div = document.createElement('div');
        div.className = 'form-outer';
        div.id = 'DNC-FORM';
        div.innerHTML = html;
        document.body.appendChild(div);

        this._formHandlers();
    },

    _formHandlers: function() {
        var closers = document.getElementsByClassName('form-close');
        for ( var x = 0; x < closers.length; x++ ) {
            closers[x].addEventListener('click', this.closeForm.bind(this));
        }
    },

    _inputTypeDefault: function ( p ) {
        var field = '<input name="' + p.name + '" type="' + p.type + '">';
        return field;
    },

    _inputTypeSelect: function( p ) {
        var select = '<select name="' + p.name + '">';
        for ( var o = 0; o < p.options.length; o++ ) {
            select += '<option value="' + p.options[o] + '"';
            if ( p.options[o] == p.selected ) select += ' selected';
            select += '>' + p.options[o] + '</option>';
        }
        return select + '</select>';
    },

    validateForm: function ( form ) {
        // validation stuff here
    },

    closeForm: function ( event ) {
        var child = document.getElementById('DNC-FORM');
        child.parentElement.removeChild(child);
    },

    // _removeInput: function() {

    // }

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    **
    */
    _execute: function () {
        /*
        **
        **  TODO: this is the type of referencing
        **  that feels like it should be avoided.
        **  it is the only reference left and it cannot
        **  be factored out until we potentially
        **  revisit how MenBar, Menu and Operation work together
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

        // if the new object is a feature collection and only has one layer,
        // remove it and just keep it as a feature
        if ( newLayer.geometry.type == "FeatureCollection" &&
             newLayer.geometry.features.length == 1 ) newLayer.geometry = this._unCollect( newLayer.geometry );

        var mapLayer = L.mapbox.featureLayer(newLayer.geometry);


        /*
        **
        **  TODO: I'm wondering if we can refactor these classes
        **  to make this type of interaction easier to model
        **
        */
        var eventExtras = { mapLayer: mapLayer, layerName: newLayer.name, isOverlay: true };
        this.parent.parent.fire('operation-result', eventExtras);
    },


    /*
    **  
    **  VALIDATE LAYERS
    **  Checks if the proper number of layers are in the current selection to
    **  allow Turf operations to run
    **
    */
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

    /*
    **  
    **  PREPARE DATA
    **  Prepares the selected data to be run through Turf operations
    **  and builds the new layer name
    **
    */
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
    } , 

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
