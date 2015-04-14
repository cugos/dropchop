(function(){
    var DNC = {
        version: '0.0.1-dev'
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = DNC;
    }

    if (typeof window !== 'undefined' && window.L ) {
        window.L.DNC = DNC;

        L.DNC.init = function(){

            this.mapView = new L.DNC.MapView();
            this.dropzone = new L.DNC.DropZone( this.mapView._map, {} );
            this.layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } ).addTo( this.mapView._map );
            this.menuBar = new L.DNC.MenuBar( this.layerlist, {} );
            
        };
    }
})();

L.DNC = L.DNC || {};
L.DNC.Menu = L.Class.extend({ // This is a base class. It should never be initiated directly.

    // defaults
    options: {
        parentId : 'menu-bar'
    },

    initialize: function ( title, options ) {
        L.setOptions(this, options);

        this.title = title;

        this.domElement = this._buildMenu();
        this._addEventHandlers();
    },

    _addEventHandlers : function () {
        /*
        **
        **  handlers for menu options
        **
        */
        if (this.domElement) {
            this.domElement.addEventListener('click', menuClick, false);
        }

        // Dropdown tooling
        function menuClick() {
            var menuExpand = this.querySelector('.menu-dropdown');

            if (menuExpand.className.indexOf('expanded') == -1) {
                // Close open menus
                var openMenus = document.getElementsByClassName('expanded');
                for (var i=0; i < openMenus.length; i++){
                  openMenus[i].className = openMenus[i].className.replace(/\b expanded\b/,'');
                }

                // Open this menu
                menuExpand.className += ' expanded';

            } else {
                menuExpand.className = menuExpand.className.replace(/\b expanded\b/,'');
            }

        }
    },

    // Create and attach dom elements
    _buildMenu: function () {
        var menu = document.createElement('div');
        menu.className = "menu";
        menu.innerHTML = '<button class="menu-button">' +
            this.title + '<i class="fa fa-angle-down"></i>' +
            '</button>' +
        '<div class="menu-dropdown menu-expand"></div>';

        var domElement = document.getElementById(this.options.parentId).appendChild(menu);
        return domElement;
    },

    // Add operation to menu
    addOperation: function( operation ) {
        var dropdown = this.domElement.getElementsByClassName('menu-dropdown')[0];
        dropdown.appendChild( operation.domElement );
        return this;
    }
});

L.DNC = L.DNC || {};
L.DNC.DropZone = L.Class.extend({


    statics: {
        TYPE: 'dropzone'
    },

    // defaults
    options: {

    },

    initialize: function (map, options) {

        // override defaults with passed options
        L.setOptions(this, options);
        this._map = map;
        this.type = L.DNC.DropZone.TYPE;

        this.fileReader = new L.DNC.DropZone.FileReader( this._map, options );
        this.fileReader.enable();
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
        this._registerEventHandlers();
    },

    _registerEventHandlers: function() {
        this.on( "enabled", function(e){
            console.debug( "[ FILEREADER ]: enabled > ", e );
        });

        this.on( "fileparsed", function(e){
            // TODO: This should be refactored so that this.dropzone and
            // this.layerlist are not so tightly coupled. The logic behind
            // this tooling should exist within their respective modules.
            console.debug( "[ FILEREADER ]: file parsed > ", e.file );
            var mapLayer = L.mapbox.featureLayer(e.file);
            L.DNC.layerlist.addLayerToList( mapLayer, e.fileInfo.name, true );
            L.DNC.mapView.numLayers++;
        });
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
        if(this._map){
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

L.DNC = L.DNC || {};
L.DNC.MapView = L.Class.extend({

    statics: {},

    // default options
    options: {},


    initialize : function( options ) {

        // override defaults with passed options
        L.setOptions(this, options);


        this.numLayers = 0;
        this._map = null;

        // init hooks
        this._setupMap();

    } ,


    _setupMap : function () {

        L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
        this._map = L.mapbox.map('map', 'examples.map-zr0njcqy', {
            zoomControl: false
        }).setView([0,0], 3);

    }

});

L.DNC = L.DNC || {};
L.DNC.MenuBar = L.Class.extend({

    // defaults
    options: {
        parentId : 'menu-bar'
    },

    initialize: function ( layerlist, options ) {
        // override defaults with passed options
        this.layerlist = layerlist;
        L.setOptions(this, options);

        var geotools = new L.DNC.Menu( "Geoprocessing Tools", {} )
            .addOperation(new L.DNC.TurfOperation('buffer', {
                maxFeatures: 1,
                additionalArgs: 0.1
            }))
            .addOperation(new L.DNC.TurfOperation('union', {
                minFeatures: 2,
                maxFeatures: 2
            }))
            .addOperation(new L.DNC.TurfOperation('erase', {
                minFeatures: 2,
                maxFeatures: 2
            }))
            ;

        this.menus = [];
        this.menus.push( geotools );
    }
});

L.DNC = L.DNC || {};
L.DNC.Operation = L.Class.extend({

    options: {
    },

    initialize: function ( title, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.domElement = this._buildDomElement();
        this._addEventHandlers();
    },

    _addEventHandlers : function () {
        this.domElement.addEventListener('click', function(){
            this.execute.call( this );
        }.bind(this));
    },

    // Generate and return button
    _buildDomElement: function () {
        var div = document.createElement('div');
        div.innerHTML += '<button class="menu-button menu-button-action" id="' +
            this.title + '">' + this.title + '</button>';
        return div.children[0];
    },

    // Where the magic happens
    execute: function() {
        console.error("L.DNC.Operation object did not properly override 'execute'", this);
    },
});

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
        var layers = L.DNC.layerlist.selection.list;

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
        L.DNC.layerlist.addLayerToList( mapLayer, newLayer.name, true );
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

L.DNC = L.DNC || {};
L.DNC.Notifications = L.Class.extend({


    statics: {},

    // defaults
    options: {},

    initialize: function (map, options) {

        // override defaults with passed options
        L.setOptions(this, options);
        this._map = map;

        // create notification center & locations
        this.hub = document.getElementById('notifications');

    } ,

    // used to add a notification to the DOM
    add: function ( options ) {

        // TODO: clean this up?
        params = {},
        params.text = options.text || 'THIS NOTIFICATION REQUIRES TEXT',
        params.time = options.time || 4000,
        params.type = options.type || 'default';

        // add a new notification to the stream
        var note = document.createElement('div');
        note.className = 'notification ' + options.type;
        note.innerHTML = options.text;
        this.hub.appendChild(note);

        // redefine for setTimeout() scope
        var _this = this;
        
        // TODO: add/remove notifications to an array to interact with them
        // instead of relying on setTimeout() dictating their existence.
        setTimeout(function () {
            _this.hub.removeChild( _this.hub.firstChild );
        }, params.time);

    }

    // TODO: add event listeners for notifications here instead of 
    // throughout the application. Maybe?

    // this.notifications.add({
    //     text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
    //     type: 'success',
    //     time: 2000
    // });


});
