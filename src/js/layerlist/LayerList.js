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

    initialize: function (options) {

        // override defaults with passed options
        L.setOptions(this, options);

        this._layers = {};
        this._lastZIndex = 0;
        this._handlingClick = false;
        this.layerContainer = L.DomUtil.get( this.options.layerContainerId );

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
            list: []
        };
    },

    _initLayout: function () {
        this._container = L.DomUtil.create('ul', "json-layer-list");
        this._container.setAttribute( "id", "layer-list" );
        this.layerContainer.appendChild( this._container );
    },

    onAdd: function (map) {
        this._initLayout();
        this._update();
        return this._container;
    },

    addTo: function (map) {
        this.remove();
        this._map = map;
        this._container = this.onAdd(map);
        return this;
    },

    remove: function () {
        if (!this._map) {
            return this;
        }
        L.DomUtil.remove(this._container);
        if (this.onRemove) {
            this.onRemove(this._map);
        }
        this._map = null;
        return this;
    },

    addLayerToList: function (layer, name, overlay) {
        var id = L.stamp(layer);

        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }

        this._update();

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

    removeLayerFromList: function (layer) {
        var id = L.stamp(layer);
        delete this._layers[id];
        return this;
    },

    _update: function () {
        if (!this._container) { return this; }

        for (var i in this._layers) {
            obj = this._layers[i];

            if ( !(this._map.hasLayer( obj.layer )) ){

                this._map.addLayer( obj.layer );
                this._addItem(obj);

            }

        }

        return this;
    },

    /*
    **
    **  TODO: the input element's onchange callback
    **  and the layerItem's onclick callback
    **  should be split out as class-level
    **  functions that know what layer was interacted with
    *   based on the "data-id" attribute
    **
    */
    _addItem: function (obj) {
        var inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'checkbox');
        inputEl.setAttribute('checked', 'true');
        inputEl.className = 'layer-toggle';
        inputEl.setAttribute( 'data-id', L.stamp(obj.layer) );
        inputEl.onchange = function() {
            // if the box is now checked, show the layer
            if (inputEl.checked) {
                this._map.addLayer(obj.layer);
            } else {
                if (this._map.hasLayer(obj.layer)) this._map.removeLayer(obj.layer);
            }
        }.bind( this );

        var layerItem = document.createElement('div');
        layerItem.className = 'layer-name';
        layerItem.innerHTML = obj.name;
        layerItem.setAttribute( 'data-id', L.stamp(obj.layer) );
        layerItem.onclick = function(evt) {
            // if the element is currently not selected, add the class
            if (evt.currentTarget.className.indexOf('selected') == -1) {

                // add the class
                evt.currentTarget.className += ' selected';

                // add to select list
                this.selection.add({
                    info: obj,
                    layer: obj.layer
                });
            } else {

                // remove selection
                this.selection.remove(obj.layer);

                // remove class name
                evt.currentTarget.className = 'layer-name';
            }
        }.bind( this );

        var li = document.createElement('li');
        li.className = 'layer-element ' + obj.name;


        li.appendChild(inputEl);
        li.appendChild(layerItem);
        this._container.appendChild(li);

    }

});
