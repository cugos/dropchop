L.DNC.JsonLayerList = L.Control.extend({

    options: {
        autoZIndex: true,
        fileContainerId: 'json-layer-list' // default
    },

    initialize: function (options) {
        L.setOptions(this, options);

        this._layers = {};
        this._lastZIndex = 0;
        this._handlingClick = false;
        this.layerContainer = L.DomUtil.get( this.options.fileContainerId );

        //
        // TODO: this is a local cache just like this._layers, so remove it later
        //
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
        this._container = L.DomUtil.create('ul');
        this._container.setAttribute( "id", "fileList" );
        this.layerContainer.appendChild( this._container );
    },

    onAdd: function () {
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

    addLayer: function (layer, name, overlay) {
        // TODO: figure out how to get this to work with v0.7.2
        //this._map.on('layeradd layerremove', this._onLayerChange, this);

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

        this._map.addLayer( layer );
        this._update();
    },

    _update: function () {
        if (!this._container) { return this; }

        for (i in this._layers) {
            obj = this._layers[i];
            this._addItem(obj);
        }

        return this;
    },

    // TODO: figure out how to get this to work with v0.7.2
    //_onLayerChange: function (e) {
    //    if (!this._handlingClick) {
    //        this._update();
    //    }
    //},


    _addItem: function (obj) {
        var inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'checkbox');
        inputEl.setAttribute('checked', 'true');
        inputEl.className = 'layer-toggle';
        inputEl.setAttribute( 'data-id', L.stamp(obj.layer) );
        //
        // TODO: figure out how to get this to work with v0.7.2
        //
        //L.DomEvent.on(inputEl, 'click', this._onInputClick, this);
        inputEl.onchange = function() {
            // if the box is now checked, show the layer
            if (inputEl.checked) {
                console.log( "[ ADD LAYER ]" );
                this._map.addLayer(obj.layer);
            } else {
                if (this._map.hasLayer(obj.layer)) this._map.removeLayer(obj.layer);
            }
        }.bind( this );

        var layerItem = document.createElement('div');
        layerItem.className = 'layer-name';
        layerItem.innerHTML = obj.name;
        //
        // TODO: figure out how to get this to work with v0.7.2
        //
        //L.DomEvent.on(layerItem, 'click', this._onLayerClick, this);
        // when you click the layer item, make it selectable
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


        this.layerContainer.appendChild(li);
        li.appendChild(inputEl);
        li.appendChild(layerItem);

    },


    // TODO: figure out how to get this to work with v0.7.2
    //_onInputClick: function () {
    //    var inputs = this.layerContainer.getElementsByTagName('input'),
    //        input, layer, hasLayer;
    //    var addedLayers = [],
    //        removedLayers = [];
    //
    //    this._handlingClick = true;
    //
    //    for (var i = 0, len = inputs.length; i < len; i++) {
    //        input = inputs[i];
    //        layer = this._layers[input.layerId].layer;
    //        hasLayer = this._map.hasLayer(layer);
    //
    //        if (input.checked && !hasLayer) {
    //            addedLayers.push(layer);
    //
    //        } else if (!input.checked && hasLayer) {
    //            removedLayers.push(layer);
    //        }
    //    }
    //
    //    for (i = 0; i < removedLayers.length; i++) {
    //        this._map.removeLayer(removedLayers[i]);
    //    }
    //    for (i = 0; i < addedLayers.length; i++) {
    //        this._map.addLayer(addedLayers[i]);
    //    }
    //
    //    this._handlingClick = false;
    //
    //    this._refocusOnMap();
    //},
    //

    // TODO: figure out how to get this to work with v0.7.2
    //_onLayerClick: function (evt) {
    //    console.log( "[ ON LYR CLICK ]: ", evt.currentTarget.layerId );
    //    var targetLayer = this._map.getLayer( evt.currentTarget.layerId );
    //
    //    if (evt.currentTarget.className.indexOf('selected') == -1) {
    //
    //        // add the class
    //        evt.currentTarget.className += ' selected';
    //
    //        // add to select list
    //        this.selection.add({
    //            info: evt.currentTarget.layerInfo,
    //            layer: targetLayer
    //        });
    //
    //    } else {
    //
    //        // remove selection
    //        this.selection.remove(targetLayer);
    //
    //        // remove class name
    //        evt.currentTarget.className = 'layer-name';
    //    }
    //}

});