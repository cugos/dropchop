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
/*
**
** AppController is the primary point of app initialization. It basically 'ties
** every together'
**
*/
L.DNC.AppController = L.Class.extend({

    statics: {},

    // default options
    options: {},

    // L.Class.extend automatically executes 'initialize'
    initialize : function( options ) {

        // override defaults with passed options
        L.setOptions(this, options);

        this.mapView = new L.DNC.MapView();
        this.dropzone = new L.DNC.DropZone( this.mapView._map, {} );
        this.layerlist = new L.DNC.LayerList( this.mapView._map, { layerContainerId: 'sidebar' } );
        this.menubar = new L.DNC.MenuBar(
            { id: 'menu-bar' }
        ).addTo( document.body );
        this.bottom_menu = new L.DNC.MenuBar(
            { id: 'add-remove', classList: ["bottom", "menu"] }
        ).addTo( document.getElementById('sidebar') );

        // build out menus
        this.menus = {
            geo: new L.DNC.Menu('Geoprocessing', {  // New dropdown menu
                items: ['bezier', 'buffer', 'center', 'centroid', 'envelope', 'union', 'tin']
            }).addTo( this.menubar ),               // Append to menubar

            addLayer: new L.DNC.Menu('Add', {       // New dropdown menu
                items: ['upload', 'load from url'],
                menuDirection: 'above',
                iconClassName: "fa fa-plus",
            }).addTo( this.bottom_menu ),           // Append to menubar

            removeLayer: new L.DNC.Menu('Remove', {
                iconClassName: "fa fa-minus",
            }).addTo( this.bottom_menu ),
        };
        this.geoOpsConfig = {
            operations: new L.DNC.Geo(),        // Configurations of GeoOperations
            executor: new L.DNC.GeoExecute()    // Executor of GeoOperations
        };

        this.fileOpsConfig = {
            operations: new L.DNC.File(),       // Configurations of FileOperations
            executor: new L.DNC.FileExecute()    // Executor of GeoOperations
        };


        this.forms = new L.DNC.Forms();

        this.notification = new L.DNC.Notifications();
        this._addEventHandlers();

    },

    _addEventHandlers: function(){
        this.dropzone.fileReader.on( 'fileparsed', this._handleParsedFile.bind( this ) );
        this.fileOpsConfig.executor.on( 'uploadedfiles', this.dropzone.fileReader._handleFiles.bind(this.dropzone.fileReader) );

        // Handle clicks on items within geoMenu
        // NOTE: This is where an operation is tied to a menu item
        this.menus.geo.on( 'clickedOperation', this._handleOperationClick.bind( this, this.geoOpsConfig ) );
        this.menus.addLayer.on( 'clickedOperation', this._handleOperationClick.bind( this, this.fileOpsConfig ) );
        this.menus.removeLayer.on( 'clickedOperation', this._handleOperationClick.bind( this, this.fileOpsConfig ) );
    },

    /*
    **
    ** Lookup operation by name from operations configuration, validate selection,
    ** and render appropriate form
    **
    */
    _handleOperationClick: function( opsConfig, e ) {
        var config = opsConfig.operations[e.action];
        // Validate selection
        try {
            opsConfig.executor.validate( e.action, this.getLayerSelection(), config );
        }
        catch(err) {
            this.notification.add({
                text: err.message,
                type: 'alert',
                time: 2500
            });
            console.error(err);
            return;
        }

        if (config.disableForm) {
            return this._handleFormSubmit( opsConfig, e );
        } else {
            var form = this.forms.render( e.action, config );
            form.on( 'submit', this._handleFormSubmit.bind( this, opsConfig ) );
        }
    },

    /*
    **
    ** Take input from an options form, use input to execute operation, get new
    ** layer, pass new layer off to be added to map.
    **
    */
    _handleFormSubmit: function( opsConfig, e ) {
        var config = opsConfig.operations[e.action];
        opsConfig.executor.execute(
            e.action,
            e.parameters,
            config,
            this.getLayerSelection(),
            function(results) { // Callback
                return this._handleResults(results);
            }.bind(this)
        );
    },

    /*
    **
    ** Take newly parsed file, add to map and layerlist
    **
    */
    _handleParsedFile: function( e ) {
        var layer = L.mapbox.featureLayer( e.file );
        this.layerlist.addLayer( layer, e.fileInfo.name );
        this.mapView.numLayers++;

        this.notification.add({
            text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
            type: 'success',
            time: 2500
        });
    },

    /*
    **
    ** Take new layer, add to map and layerlist
    **
    */
    _handleResults: function( resultPkg ) {
        if (!resultPkg) {
            return console.warn("No results returned from operation.");
        }
        var i;
        var obj;

        // Add
        if (resultPkg.add && resultPkg.add.length) {
            for (i = 0; i < resultPkg.add.length; i++) {
                obj = resultPkg.add[i];
                var mapLayer = L.mapbox.featureLayer( obj.geometry );
                this.layerlist.addLayer( mapLayer, obj.name );

                this.notification.add({
                    text: '<strong>' + obj.name + '</strong> created successfully.',
                    type: 'success',
                    time: 2500
                });
            }
        }
        // Remove
        if (resultPkg.remove && resultPkg.remove.length) {
            for (i = 0; i < resultPkg.remove.length; i++) {
                obj = resultPkg.remove[i];
                this.layerlist.removeLayer(obj.layer);
                this.notification.add({
                    text: '<strong>' + obj.name + '</strong> removed successfully.',
                    type: 'success',
                    time: 2500
                });
            }
        }
    },

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
L.DNC.Forms = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** RENDER FORM TEMPLATE
    **
    */
    // TODO: write tests for Forms
    render: function ( title, options ) {

        this.title = title;
        this.paramArray = [];
        this.options = {}; // reset options for next form
        L.setOptions(this, options);

        var html = '<div class="form-inner"><div class="form">'+
                '<button type="button" class="btn close form-close"><i class="fa fa-times"></i></button>'+
                '<div class="form-information"><h3 class="form-title">' + this.title + '</h3>';
        if (this.options.description) {
            html += '<p class="form-description">' + this.options.description + '</p>';
        }
        html += '</div><form id="operation-form" class="form-inputs">';

        if ( this.options.parameters ) {

            for ( var i = 0; i < this.options.parameters.length; i++ ) {
                var parameter = this.options.parameters[i];

                var input = '<div class="parameter">';
                if (parameter.name) {
                    input += '<label class="parameter-name">' + parameter.name + '</label>';
                }

                // select
                if ( parameter.type == 'select') {
                    input += this._inputTypeSelect( parameter );
                // input
                } else {
                    input += this._inputTypeDefault( parameter );
                }

                if (parameter.description) input += '<p class="parameter-description">' + parameter.description + '</p>';
                html += input + '</div>';
            }

        }

        // submit button
        html += '<button type="button" class="btn form-submit" id="operation-submit">Execute<i class="fa fa-thumbs-o-up push-left"></i></button>';
        html += '</div></div>';

        var div = document.createElement('div');
        div.className = 'form-outer';
        div.id = 'DNC-FORM';
        div.innerHTML = html;
        document.body.appendChild(div);
        this.domElement = div;

        this._formHandlers(div);

        return this;
    },

    closeForm: function ( event ) {
        var child = document.getElementById('DNC-FORM');
        child.parentElement.removeChild(child);
    },

    submitForm: function( e ) {
        // function that grabs all parameter information from the
        // current open form, and publishes 'form-submitted' so the
        // operations subscriber can execute the turf operation

        // reset paramArray for new parameters
        this.paramArray = [];

        // get form info
        var inputs = document.getElementsByClassName('param');
        for ( var p = 0; p < inputs.length; p++ ) {
            var paramValue = null;
            if (inputs[p].nodeName == 'SELECT') {
                paramValue = inputs[p].options[inputs[p].selectedIndex].value;
            } else {
                paramValue = inputs[p].value;
                if (inputs[p].type == 'number') paramValue = parseInt(paramValue);
            }
            this.paramArray.push(paramValue);
        }

        if ( this.validateForm() ) {
            this.fire( 'submit', { action: this.title, parameters: this.paramArray } );
            this.closeForm();

            // Remove event listener
            this._leaflet_events.submit = []; // TODO: There's surely a better way to do this
        }


    },

    // TODO: validate the form
    validateForm: function () {
        // do some validation eventually
        return true;
    },

    _formHandlers: function() {

        var _this = this;

        var closers = document.getElementsByClassName('form-close');
        for ( var x = 0; x < closers.length; x++ ) {
            closers[x].addEventListener('click', this.closeForm.bind(this));
        }

        // form submit checks for enter key to prevent default
        var form = document.getElementById('operation-form');
        form.addEventListener('keypress', function( event ){
            if ( event.keyCode == 13 ) {
                event.preventDefault();
                _this.submitForm();
            }
        });

        // bind event handler to form submit button
        var submit = document.getElementById('operation-submit');
        submit.addEventListener('click', this.submitForm.bind(this));
    },

    _inputTypeDefault: function ( p ) {
        var field = '<input class="param" name="' + p.name + '" type="' +
            p.type + '" value="' + (p.default || '') + '"' +
            (p.extra || '') + '>';
        return field;
    },

    _inputTypeSelect: function( p ) {
        var select = '<select class="param" type="select" name="' + p.name + '">';
        for ( var o = 0; o < p.options.length; o++ ) {
            select += '<option value="' + p.options[o] + '"';
            if ( p.options[o] == p.default ) select += ' selected';
            select += '>' + p.options[o] + '</option>';
        }
        return select + '</select>';
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
        obj.domElement = this._buildListItemDomElement( obj );

        var id = L.stamp(layer);
        this._layers[id] = obj;
        this._map.addLayer( layer );
        this.domElement.appendChild( obj.domElement );

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
        this.domElement.removeChild(this._layers[id].domElement); // Rm from layerlist
        this._map.removeLayer(layer); // Rm from map
        this.selection.remove(layer); // Rm from selection
        delete this._layers[id]; // Rm knowledge of layer
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
        this._map = L.mapbox.map('map', null, {
            zoomControl: false
        }).setView([0,0], 3);

        var baseLayers = {
            "Mapbox Streets": L.mapbox.tileLayer('mapbox.streets'),
            "Mapbox Outdoors": L.mapbox.tileLayer('mapbox.outdoors'),
            "Mapbox Light": L.mapbox.tileLayer('mapbox.light'),
            "Mapbox Dark": L.mapbox.tileLayer('mapbox.dark'),
            "Mapbox Satellite": L.mapbox.tileLayer('mapbox.satellite')
        };

        baseLayers['Mapbox Streets'].addTo(this._map);
        L.control.layers(baseLayers, {}, {
            position: 'bottomright',
            collapsed: false
        }).addTo(this._map);
        L.control.zoom({
            position: 'topright'
        }).addTo(this._map);

    }

});

L.DNC = L.DNC || {};

/*
**
** A dropdown menu
**
*/
L.DNC.Menu = L.Class.extend({
    includes: L.Mixin.Events,
    options: { items: [], menuDirection: 'below' },

    initialize: function ( title, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.children = this._buildMenuItems(this.options.items);
        this.domElement = this._buildDomElement(this.children);
        this._addEventHandlers();
    },

    /*
    **
    ** Create event handlers for dom elements within this object
    **
    */
    _addEventHandlers : function () {

        // using within the click function scope since we need to pass information
        // about the clicked object (id) AND its parent scope (menu) for .fire()
        var _this = this;

        // Dropdown tooling
        if (this.domElement && this.children.length) { // Only if menu has child objects
            this.domElement.addEventListener('click', menuClick, false);
        }
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

        if (this.children.length) {
            for ( var c = 0; c < this.children.length; c++ ) {
                this.children[c].addEventListener('click', itemClick, false);
            }
        } else {  // Handle menu with no sub-items (thus, the menu itself is the button)
            this.domElement.addEventListener('click', itemClick, false);
        }
        function itemClick() {
            _this.fire('clickedOperation', { action: this.id || _this.title.toLowerCase() }); // Set action to operation id or lowercase menu title
        }
    },

    /*
    **
    ** Append this domElement to a give parent object's dom element
    **
    */
    addTo: function ( parent ) {
        var parentDomElement = parent.domElement || parent; // If parent doesn't have a domElement, assume that it IS a dom element
        parentDomElement.appendChild( this.domElement );
        this.parent = parent;
        return this;
    },

    /*
    **
    ** Take in an array of operations names, return array of dom elements for
    ** each item
    **
    */
    _buildMenuItems: function ( items ) {
        var tempArray = [];
        for ( var i = 0; i < items.length; i++ ) {
            var menuItem = document.createElement('button');
            menuItem.className = 'menu-button menu-button-action';
            menuItem.id = items[i];
            menuItem.innerHTML = items[i];
            tempArray.push(menuItem);
        }
        return tempArray;
    },

    /*
    **
    ** Take in array of menu item dom elements, return dom element for this menu
    **
    */
    _buildDomElement: function ( childElements ) {
        // Create menu div
        var menu = document.createElement('div');
        menu.className = "menu";

        // Create button for menu
        var button = document.createElement('button');
        button.className = "menu-button";
        button.innerHTML = this.title;

        // Create icon for menu's button
        var icon = document.createElement('i');
        if ( this.options.iconClassName ){
            icon.className = this.options.iconClassName;
        } else if ( childElements.length ) { // Only if child elements
            if ( this.options.menuDirection == 'above' ) {
                icon.className = 'fa fa-angle-up';
            } else {
                icon.className = 'fa fa-angle-down';
            }
        }

        // Create menu dropdown
        var menuDropdown = document.createElement('div');
        menuDropdown.className = 'menu-dropdown menu-expand';

        if ( this.options.menuDirection == 'above' ) {
            menuDropdown.className += ' opens-above'; // Menu dropdown opens to above menu
        }
        for ( var e = 0; e < childElements.length; e++ ) {  // Add childElements
            menuDropdown.appendChild(childElements[e]);
        }

        // Join it all together
        button.appendChild(icon);
        menu.appendChild(button);
        menu.appendChild(menuDropdown);
        return menu;
    }
});

L.DNC = L.DNC || {};
L.DNC.MenuBar = L.Class.extend({
    includes: L.Mixin.Events,
    options: { id: '#menu-bar', classList: [] },

    initialize: function ( options ) {
        L.setOptions( this, options );
        this.children = [];
        this.domElement = this._buildDomElement(this.options.id, this.options.classList);
    },

    /*
    **
    ** Append this domElement to a give parent object's dom element
    **
    */
    addTo: function ( parent ) {
        var parentDomElement = parent.domElement || parent; // If parent doesn't have a domElement, assume that it IS a dom element
        parentDomElement.appendChild( this.domElement );
        this.parent = parent;
        return this;
    },

    /*
    **
    ** Create the DOM element
    **
    */
    _buildDomElement: function ( id, classList ) {
        var nav = document.createElement('nav');
        nav.id = id;
        for (var i=0; i < classList.length; i++) {
            nav.classList.add(classList[i]);
        }
        return nav;
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

        // create DOM element
        this.domElement = this._buildDomElement();

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

    },

    _buildDomElement: function() {
        var el = document.createElement('div');
        el.id = 'notifications';
        document.body.appendChild(el);
        return el;
    }

});

L.DNC = L.DNC || {};
L.DNC.BaseExecute = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    ** Should be overwritten...
    **
    */
    execute: function ( action, parameters, options, layers ) {
        throw new Error("Execute method not implemented");
    },


    /*
    **
    **  VALIDATE LAYERS
    **  Checks if the proper number of layers are in the current selection to
    **  allow Turf operations to run
    **
    */
    validate: function ( title, layers, options ) {
        var length = layers.length;

        // TODO: This should live elsewhere
        function ValidationError(message) {
              this.name = 'ValidationError';
              this.message = message || 'Validation Error';
        }
        ValidationError.prototype = Object.create(Error.prototype);
        ValidationError.prototype.constructor = ValidationError;

        if (options.maxFeatures && length > options.maxFeatures) {
            throw new ValidationError("Too many layers. Max is set to " + options.maxFeatures + ", got " + length + ".");
        }

        if (options.minFeatures && length < options.minFeatures) {
            throw new ValidationError("Too few layers. Min is set to " + options.minFeatures + ", got " + length + ".");
        }
    },

});

L.DNC.File = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    remove: {
        minFeatures: 1,
        description: 'Removes a layer from the application.',
        disableForm: true,
    },
    upload: {
        parameters: [
            {
                description: 'File to upload.',
                type: 'file',
                extra: 'multiple',
            }
        ]
    },
    "load from url": {
        description: 'Import file from a URL',
        parameters: [
            {
                name: 'url',
                description :'URL',
                type: 'text',
                default: 'http://',
            },
        ],
    }
});

L.DNC = L.DNC || {};
L.DNC.FileExecute = L.DNC.BaseExecute.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    **
    */
    execute: function ( action, parameters, options, layers, callback ) {
        var _this = this;
        var actions = {
            remove: function( action, parameters, options, layers ){
                callback({
                    remove: layers.map(
                        function(l){ return { layer: l.layer, name: l.info.name };
                    })
                });
            },
            upload: function ( action, parameters, options, layers ){
                var files = document.querySelectorAll('input[type=file]')[0].files;
                _this.fire('uploadedfiles', files);
            },
            'load from url': function ( action, parameters, options, layers ) {
                var url = parameters[0];
                var xhr = new XMLHttpRequest();
                xhr.open('GET', encodeURI(url));
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var newLayer = JSON.parse(xhr.responseText);
                        var filename = xhr.responseURL.substring(xhr.responseURL.lastIndexOf('/')+1);

                        // if the new object is a feature collection and only has one layer,
                        // remove it and just keep it as a feature
                        if ( newLayer.geometry.type == "FeatureCollection" && newLayer.geometry.features.length == 1 ) {
                            newLayer.geometry = this._unCollect( newLayer.geometry );
                        }

                        callback( { add: [{ geometry: newLayer, name: filename }] } );
                    } else {
                        console.error('Request failed. Returned status of ' + xhr.status);
                    }
                };
                xhr.send();
            }
        };
        if (typeof actions[action] !== 'function') {
          throw new Error('Invalid action.');
        }
        return actions[action](action, parameters, options, layers);
    },

});

L.DNC.Geo = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    bezier: {
        minFeatures: 1,
        description: 'Takes a line and returns a curved version by applying a Bezier spline algorithm.',
        parameters: [
            {
                name: 'resolution',
                description :'Time in milliseconds between points',
                type: 'number',
                default: 10000
            },
            {
                name: 'sharpness',
                description :'a measure of how curvy the path should be between splines',
                type: 'number',
                default:  0.85

            }
        ],
    },

    buffer: {
        maxFeatures: 1,
        description: 'Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.',
        parameters: [
            {
                name: 'distance',
                description: 'Distance to draw the buffer.',
                type: 'number',
                default: 10
            },
            {
                name: 'unit',
                type: 'select',
                description: '',
                options: ['miles', 'feet', 'kilometers', 'meters', 'degrees'],
                default: 'miles'
            }
        ],
    },

    center: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Creates a point in the center of the feature.',
    },

    centroid: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Creates a point in the centroid of the features.',
    },

    envelope: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Extent of all the features.',
    },

    union: {
        minFeatures: 2,
        maxFeatures: 2,
        description: 'Takes two polygons and returns a combined polygon. If the input polygons are not contiguous, this function returns a MultiPolygon feature.',
    },

    tin: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Triangulated irregular network, interpolation method',
    }



});

L.DNC = L.DNC || {};
L.DNC.GeoExecute = L.DNC.BaseExecute.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    **
    */
    execute: function ( action, parameters, options, layers, callback ) {

        L.setOptions(this, options);
        this.action = action;

        // Prep
        var params = this._prepareParameters( layers, options, parameters );
        var name = this._prepareName( layers );

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

        callback({ add: [newLayer] });
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
