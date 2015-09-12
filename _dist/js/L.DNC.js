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

L.DNC = L.DNC || {};
L.DNC.MenuBar = L.Class.extend({
    includes: L.Mixin.Events,

    initialize: function ( options ) {
        L.setOptions( this, options );
        this.children = [];
        this.domElement = this._buildDomElement();
    },

    // Add object as child. Object must have domElement property.
    addChild: function ( child, target ) {
        target = target || this.domElement;
        target.appendChild( child.domElement );
        child.parent = this;
        this.children.push( child );
        return this;
    },

    // Append this domElement to a give parent object's dom element
    addTo: function ( parent ) {
        var parentDomElement = parent.domElement || parent; // If parent doesn't have a domElement, assume that it IS a dom element
        parentDomElement.appendChild( this.domElement );
        this.parent = parent;
        return this;
    },

    // Create and return dom element
    _buildDomElement: function () {
        return document.createElement( 'div' );
    }
});

L.DNC = L.DNC || {};
L.DNC.AppController = L.Class.extend({

    statics: {},

    // default options
    options: {},


    initialize : function( options ) {

        // override defaults with passed options
        L.setOptions(this, options);

        this.mapView = new L.DNC.MapView();
        this.dropzone = new L.DNC.DropZone( this.mapView._map, {} );
        this.layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } ).addTo( this.mapView._map );
        this.menuBar = new L.DNC.MenuBar()
            .addTo( document.getElementById('menu-bar') )
            .addChild( new L.DNC.Menu( "Geoprocessing Tools", {} )
                .addChild(new L.DNC.TurfOperation('buffer', {
                    maxFeatures: 1,
                    additionalArgs: 0.1,
                    icon: 'icon-turf-buffer.svg'
                }))
                .addChild(new L.DNC.TurfOperation('union', {
                    minFeatures: 2,
                    maxFeatures: 2,
                    icon: 'icon-turf-union.svg'
                }))
                .addChild(new L.DNC.TurfOperation('erase', {
                    minFeatures: 2,
                    maxFeatures: 2,
                    icon: 'icon-turf-erase.svg'
                }))
            );

        this.notification = new L.DNC.Notifications();

        this._addEventHandlers();

    } ,

    _addEventHandlers: function(){
        this.dropzone.fileReader.on( "fileparsed", this._handleParsedFile.bind( this ) );
        this.menuBar.on( "operation-result", this._handleTurfResults.bind(this) );
    } ,

    _handleParsedFile: function( e ) {
        var mapLayer = L.mapbox.featureLayer(e.file);
        this.layerlist.addLayerToList( mapLayer, e.fileInfo.name, true );
        this.mapView.numLayers++;

        this.notification.add({
            text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
            type: 'success',
            time: 2500
        });
    } ,

    _handleTurfResults: function( e ) {
        this.layerlist.addLayerToList(e.mapLayer, e.layerName, e.isOverlay );
    } ,

    getLayerSelection: function(){
        return this.layerlist.selection.list || [];
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
        this._container = document.body;

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

        this._container.parentElement.removeChild( this._container );
        this._container = null;

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


    _addItem: function (obj) {
        var inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'checkbox');
        inputEl.setAttribute('checked', 'true');
        inputEl.className = 'layer-toggle';
        inputEl.setAttribute( 'data-id', L.stamp(obj.layer) );
        inputEl.onchange = this._handleLayerChange.bind( this, obj );

        var layerItem = document.createElement('div');
        layerItem.className = 'layer-name';
        layerItem.innerHTML = obj.name;
        layerItem.setAttribute( 'data-id', L.stamp(obj.layer) );
        layerItem.onclick = this._handleLayerClick.bind( this, obj );

        var li = document.createElement('li');
        li.className = 'layer-element ' + obj.name;


        li.appendChild(inputEl);
        li.appendChild(layerItem);
        this._container.appendChild(li);

    } ,

    _handleLayerChange: function(obj, e){
        var inputEl = e.target;
        if (inputEl.checked) {
            this._map.addLayer(obj.layer);
        } else {
            if (this._map.hasLayer(obj.layer)) this._map.removeLayer(obj.layer);
        }
    } ,

    _handleLayerClick: function(obj,e) {

        if (e.currentTarget.className.indexOf('selected') == -1) {

            // add the class
            e.currentTarget.className += ' selected';

            // add to select list
            this.selection.add({
                info: obj,
                layer: obj.layer
            });
        } else {

            // remove selection
            this.selection.remove(obj.layer);

            // remove class name
            e.currentTarget.className = 'layer-name';

        }
    } ,

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
L.DNC.Menu = L.DNC.MenuBar.extend({

    initialize: function ( title, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.children = [];
        this.domElement = this._buildDomElement();
        this._addEventHandlers();
    },

    // Add object as child. Object must have domElement property.
    addChild: function( child, target ) {
        target = target || this.domElement.getElementsByClassName('menu-dropdown')[0];
        return this.constructor.__super__.addChild.call(this, child, target);
    },

    // handlers for menu options
    _addEventHandlers : function () {
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

    // Create and return dom element (note: this does not attach dom element to any parent)
    _buildDomElement: function () {
        var menu = document.createElement('div');
        menu.className = "menu";
        menu.innerHTML = '<button class="menu-button">' +
            this.title + '<i class="fa fa-angle-down"></i>' +
            '</button>' +
        '<div class="menu-dropdown menu-expand"></div>';
        return menu;
    }
});

L.DNC = L.DNC || {};
L.DNC.Operation = L.DNC.Menu.extend({

    _addEventHandlers : function () {
        this.domElement.addEventListener('click', function(){
            this.execute.call( this );
        }.bind(this));
    },

    // Create and return dom element (note: this does not attach dom element to any parent)
    _buildDomElement: function () {
        var div = document.createElement('div');
        div.innerHTML += '<button class="menu-button menu-button-action" id="' +
            this.title + '">' + this.title + '<img class="icon" src="icons/' + this.options.icon + '"></button>';
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
        icon: 'no icon specified',
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

L.DNC = L.DNC || {};
L.DNC.Notifications = L.Class.extend({

    statics: {},

    // defaults
    options: {},

    initialize: function (fileReader, options) {

        // override defaults with passed options
        L.setOptions(this, options);

        // create notification center & locations
        this.hub = document.getElementById('notifications');

    } ,

    // used to add a notification to the DOM
    add: function ( options ) {

        // TODO: clean this up?
        params = {};
        params.text = options.text || 'THIS NOTIFICATION REQUIRES TEXT';
        params.time = options.time || 4000;
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

});
