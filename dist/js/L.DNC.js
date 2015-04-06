(function(){
    var DNC = {
        version: '0.0.1-dev'
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = DNC;
    }

    if (typeof window !== 'undefined' && window.L ) {
        window.L.DNC = DNC;
    }
})();

L.DNC.DropZone = L.Class.extend({


    statics: {
        TYPE: 'dropzone'
    },

    options: {
    },

    initialize: function (map, options) {
        this._map = map;
        this.type = L.DNC.DropZone.TYPE;

        this.fileReader = new L.DNC.DropZone.FileReader( this._map, options );
    }

});
L.DNC.DropZone = L.DNC.DropZone || {};
L.DNC.DropZone.FileReader = L.Handler.extend({
    includes: L.Mixin.Events,

    // defaults
    options: {

    },

    initialize: function (map, options) {

        // override defaults with passed options
        L.setOptions(this, options);
        this._map = map;
        this._container = map._container;

    },

    enable: function () {
        if (this._enabled) { return; }

        L.Handler.prototype.enable.call(this);

        this.fire('enabled', { options : this.options });
        this._map.fire('dropzone:enabled', { options : this.options });
    },

    disable: function () {
        if (!this._enabled) { return; }

        L.Handler.prototype.disable.call(this);

        this._map.fire('dropzone:disabled', { options : this.options });
        this.fire('disabled', { options : this.options });
    },

    addHooks: function () {
        /*
        **
        **  hook called on super.enable()
        **
        */
        var map = this._map;

        if (map) {
            // attach DropZone events
            L.DomEvent.on(this._container, 'dragover', this._handleDragOver, this);
            L.DomEvent.on(this._container, 'dragleave', this._handleDragLeave, this);
            L.DomEvent.on(this._container, 'drop', this._handleDrop, this);
        }
    },

    removeHooks: function () {
        /*
         **
         **  hook called on super.disable()
         **
         */
        if (this._map) {
            // detach DropZone events
            L.DomEvent.off(this._container, 'dragover', this._handleDragOver, this);
            L.DomEvent.off(this._container, 'dragleave', this._handleDragLeave, this);
            L.DomEvent.off(this._container, 'drop', this._handleDrop, this);
        }
    },


    _handleDragOver: function(e) {
        e = e || event;
        e.preventDefault();
        document.body.className = "dragging";
    },

    _handleDragLeave: function(e) {
        e = e || event;
        e.preventDefault();
        document.body.className = "";
    },

    _handleDrop: function(e) {
        e = e || event;
        e.preventDefault();
        document.body.className = "";
        var files = e.dataTransfer.files;
        this._handleFiles(files);
    },

    _handleFiles : function (files) {
        for (var i = 0; i < files.length; i++) {
            this._readFile(files[i]);
        }
    } ,

    _readFile: function(fileObject) {
        var reader = new FileReader();
        reader.readAsText(fileObject, 'UTF-8');
        reader.onload = function() {
            var file = JSON.parse(reader.result);

            this._map.fire('dropzone:fileparsed', { file: file });
            this.fire('fileparsed', { fileInfo: fileObject, file: file });
        }.bind(this);
    }

});

L.DNC.JsonLayerList = L.Control.extend({

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
        this._container.setAttribute( "id", "fileList" );
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
    },

    removeLayerFromList: function (layer) {
        var id = L.stamp(layer);
        delete this._layers[id];
        return this;
    },

    _update: function () {
        if (!this._container) { return this; }

        for (i in this._layers) {
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
L.DNC.GeoMenu = L.Class.extend({

    // defaults
    options: {
    },

    initialize: function ( jsonLayerList, options ) {

        // override defaults with passed options
        L.setOptions(this, options);

        this._jsonLayerList = jsonLayerList;
        this.addEventHandlers();

    },

    addEventHandlers : function() {
        /*
        **
        **  handlers for menu options
        **
        */
        var menu = document.getElementsByClassName('menu-expand');
        for (var m = 0; m < menu.length; m++) {
            menu[m].addEventListener('click', menuClick, false);
        }

        function menuClick() {
            var menuExpand = this.nextSibling.nextSibling;
            if (menuExpand.className.indexOf('expanded') == -1) {
                menuExpand.className += ' expanded';
            } else {
                menuExpand.className = 'menu';
            }
        }


        /*
         **
         **  TODO: these 'operation' listeners
         **  should probably be somewhere else.
         **  it would be nice if we could have
         **  each operation we want register
         **  itself as a plugin with it's own HTML for
         **  the menu item and functions to bind/unbind
         **  event listeners
         **
         **  handlers for menu geoprocessing opertations
         */
        var buffer = document.getElementById('buffer');
        buffer.addEventListener('click', function(){
            this.ops.execute.call( this,
                this.ops.geom.buffer(
                    this._jsonLayerList.selection.list[0].layer._geojson,
                    this._jsonLayerList.selection.list[0].info
                )
            );
        }.bind(this));

        var union = document.getElementById('union');
        union.addEventListener('click', function(){
            this.ops.execute.call( this,
                this.ops.geom.union(
                    this._jsonLayerList.selection.list[0].layer._geojson,
                    this._jsonLayerList.selection.list[1].layer._geojson,
                    this._jsonLayerList.selection.list[0].info,
                    this._jsonLayerList.selection.list[1].info
                )
            );
        }.bind(this));

        var erase = document.getElementById('erase');
        erase.addEventListener('click', function(){
            this.ops.execute.call( this,
                this.ops.geom.erase(
                    this._jsonLayerList.selection.list[0].layer._geojson,
                    this._jsonLayerList.selection.list[1].layer._geojson,
                    this._jsonLayerList.selection.list[0].info,
                    this._jsonLayerList.selection.list[1].info
                )
            );
        }.bind(this));
    } ,

    /*
    **  TODO: flatten opts into separate functions
    **  to make it more testable and think about the
    **  plugin idea mentioned in above TODO(s)
    **
    */
    ops :  {
        // main execution for operations
        execute: function(newLayer) {
            var mapLayer = L.mapbox.featureLayer(newLayer.geometry);
            this._jsonLayerList.addLayerToList( mapLayer, newLayer.name, true );
        },

        // all geometry processes
        geom: {
            buffer: function(object, info) {
                console.log(object, info);
                var newLayer = {
                    geometry: turf.buffer(object, 0.1),
                    name: 'buffer_' + info.name
                };

                return newLayer;
            },

            // var union = turf.union(poly1, poly2);
            union: function(object1, object2, info1, info2) {

                var poly1 = object1,
                    poly2 = object2,
                    info1Strip = info1.name.replace('.geojson', ''),
                    info2Strip = info2.name.replace('.geojson', '');

                if (object1.features) poly1 = object1.features[0];
                if (object2.features) poly2 = object2.features[0];

                var newLayer = {
                    geometry: turf.union(poly1, poly2),
                    name: 'union_' + info1Strip + '_' + info2Strip + '.geojson'
                };
                return newLayer;
            },

            erase: function(object1, object2, info1, info2) {
                var poly1 = object1,
                    poly2 = object2,
                    info1Strip = info1.name.replace('.geojson', ''),
                    info2Strip = info2.name.replace('.geojson', '');

                var newLayer = {
                    geometry: turf.erase(poly1, poly2),
                    name: 'erase_' + info1Strip + '_' + info2Strip + '.geojson'
                };
                return newLayer;

            }
        }
    }


});