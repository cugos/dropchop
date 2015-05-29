L.DNC = L.DNC || {};
L.DNC.LayerList = L.Control.extend({

    /*
    **
    **  TODO: this class was supposed to be subclass of L.Control.Layers class.
    **  The internals of how that class
    **  is structured changed a lot between L v0.7.2 and L v0.7.3.
    **  It would be nice to improve upon the code below
    **  with changes reflected in v0.7.3 especially to add/remove layer events
    **
    */

    // defaults
    options: {
        autoZIndex: true,
        zoomToExtentOnAdd: true,
        layerContainerId: 'dropzone'
    },

    initialize: function (map, options) {

        // override defaults with passed options
        L.setOptions(this, options);

        this._map = map;
        this._layers = {};
        this._lastZIndex = 0;
        this._handlingClick = false;

        this.domElement = this._buildDomElement();
        this.layerContainer = L.DomUtil.get( this.options.layerContainerId );
        this.layerContainer.appendChild( this.domElement );

        /*
        **
        **  TODO: selection acts as a local cache just like this._layers
        **  so one of the two should be factored out OR combined later
        **
        **  TODO: selection will not be forever tied to the layerlist (it
        **  will be possible to select via click on features or by attributes)
        **  meaning that it would be wise to decouple this from layerlist soon
        **
        */
        this.selection = {
            add: function(l) {
                this.list.push(l);
            },
            remove: function(l) {
                for (var i = 0; i < this.list.length; i++) {
                    if (l._leaflet_id == this.list[i].layer._leaflet_id) {
                        this.list.splice(i, 1);
                    }
                }
            },
            clear: function(l) {
                var layers = document.getElementsByClassName( 'layer-name' );
                for (var i = 0; i < layers.length; i++ ) {
                    layers[i].className = layers[i].className.replace(/\b selected\b/, '');
                }
                this.list = [];
            },
            list: []
        };
    },

    /*
    **
    ** Generate dom element for layerlist
    **
    */
    _buildDomElement: function () {
        var domElement = L.DomUtil.create('ul', "json-layer-list");
        domElement.setAttribute( "id", "layer-list" );
        return domElement;
    },

    /*
    **
    ** Given a leaflet layer and a layer name, add to map and layerlist
    **
    */
    addLayer: function (layer, name) {
        var obj = {
            layer: layer,
            name: name,
        };

        var id = L.stamp(layer);
        this._layers[id] = obj;
        this._map.addLayer( layer );
        this.domElement.appendChild( this._buildListItemDomElement( obj ) );

        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }

        // If we have the zoomToExtentOnAdd feature enabled (on by default, but can be
        // hooked to UI element) then we loop through the layers and get the extent and
        // set the map zoom so people see the data right away.
        if (this.options.zoomToExtentOnAdd) {
            var bounds = layer.getBounds();
            for (var i in this._layers) {
                bounds.extend(this._layers[i].layer.getBounds());
            }
            this._map.fitBounds(bounds);
        }

    },

    /*
    **
    ** Given a leaflet layer, remove from layerlist
    **
    */
    removeLayer: function (layer) {
        var id = L.stamp(layer);
        delete this._layers[id];
        return this;
    },

    /*
    **
    ** Generate list item dom element for new object
    **
    */
    _buildListItemDomElement: function (obj) {
        var _this = this;

        // Create checkbox
        var inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'checkbox');
        inputEl.setAttribute('checked', 'true');
        inputEl.className = 'layer-toggle';
        inputEl.setAttribute( 'data-id', L.stamp(obj.layer) );
        inputEl.onchange = this._handleLayerChange.bind( this, obj );

        // Create text section
        var layerItem = document.createElement('div');
        layerItem.className = 'layer-name';
        layerItem.innerHTML = obj.name;
        layerItem.setAttribute( 'data-id', L.stamp(obj.layer) );
        layerItem.setAttribute( 'data-layer', ObjectLength( _this._layers ) );
        layerItem.onclick = this._handleLayerClick.bind( this, obj );

        // Create list item
        var li = document.createElement('li');
        li.className = 'layer-element ' + obj.name;

        // Put it all together
        li.appendChild(inputEl);
        li.appendChild(layerItem);
        return li;

        // used to count how many layers currently exist
        function ObjectLength( object ) {
            var length = 0;
            for( var key in object ) {
                if( object.hasOwnProperty(key) ) {
                    ++length;
                }
            }
            return length;
        }
    },

    /*
    **
    ** Handler for when list item's checkbox is toggled
    **
    */
    _handleLayerChange: function(obj, e){
        var inputEl = e.target;
        if (inputEl.checked) {
            this._map.addLayer(obj.layer);
        } else {
            if (this._map.hasLayer(obj.layer)) this._map.removeLayer(obj.layer);
        }
    },

    /*
    **
    ** Handler for when a list item's text section is clicked on
    **
    */
    _handleLayerClick: function( obj, e ) {
        var lyrs = document.getElementsByClassName('layer-name');
        elem = e.currentTarget;
        if (elem.className.indexOf('selected') == -1) {

            // if holding meta key (command on mac)
            if ( e.metaKey ) {
                // do nothing for now, but maybe we want to do something
                // down the road?
            } 
            else if ( e.shiftKey ) {
                // get layer number, and other currently selected
                // layers, and select everything in between
                var thisLayerNum = elem.getAttribute('data-layer');
                var layerNumSelection = [thisLayerNum];
                var others = document.getElementsByClassName('selected');
                for ( var l = 0; l < others.length; l++ ) {
                    layerNumSelection.push( others[l].getAttribute('data-layer') );
                }
                var max = Math.max.apply(null, layerNumSelection);
                var min = Math.min.apply(null, layerNumSelection);
                for ( var x = min-1; x < max; x++ ) {
                    if ( lyrs[x].className.indexOf('selected') == -1 ) {
                        lyrs[x].className += ' selected';
                        this.selection.add({
                            info: this._layers[lyrs[x].getAttribute('data-id')],
                            layer: this._layers[lyrs[x].getAttribute('data-id')].layer
                        });
                    }
                }
                return;
            }
            else {
                this.selection.clear();
            }

            // add the class
            elem.className += ' selected';
            // add to select list
            this.selection.add({
                info: obj,
                layer: obj.layer
            });
        } else {
            if ( e.metaKey ) {
                this.selection.remove(obj.layer);
                elem.className = elem.className.replace(/\b selected\b/, '');
            } else {
                this.selection.clear();
                // remove selection
                this.selection.add({
                    info: obj,
                    layer: obj.layer
                });
                elem.className += ' selected';
            }
        }
    },

});
