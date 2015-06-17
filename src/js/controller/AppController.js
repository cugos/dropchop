L.Dropchop = L.Dropchop || {};
/*
**
** AppController is the primary point of app initialization. It basically 'ties
** every together'
**
*/
L.Dropchop.AppController = L.Class.extend({

    statics: {},

    // default options
    options: {},

    // L.Class.extend automatically executes 'initialize'
    initialize : function( options ) {

        // override defaults with passed options
        L.setOptions(this, options);

        this.mapView = new L.Dropchop.MapView();
        this.dropzone = new L.Dropchop.DropZone( this.mapView._map, {} );
        this.layerlist = new L.Dropchop.LayerList( this.mapView._map, { layerContainerId: 'sidebar' } );
        this.menubar = new L.Dropchop.MenuBar(
            { id: 'menu-bar' }
        ).addTo( document.body );
        this.bottom_menu = new L.Dropchop.MenuBar(
            { id: 'add-remove', classList: ["bottom", "menu"] }
        ).addTo( document.getElementById('sidebar') );

        // build out menus
        this.menus = {
            // GEO
            geo: new L.Dropchop.Menu('Geoprocessing', {     // New dropdown menu
                items: [
                    'along',
                    'bezier',
                    'buffer',
                    'center',
                    'centroid',
                    'destination',
                    'envelope',
                    'explode',
                    'midpoint',
                    'simplify',
                    'union',
                    'tin'
                ]
            }).addTo( this.menubar ),                       // Append to menubar

            // SAVE
            save: new L.Dropchop.Menu('Save', {
                items: ['save geojson', 'save shapefile']
            }).addTo( this.menubar ),

            // ADD LAYER
            addLayer: new L.Dropchop.Menu('Add', {
                items: ['upload', 'load from url', 'load from gist'],
                menuDirection: 'above',
                iconClassName: "fa fa-plus",
            }).addTo( this.bottom_menu ),           // Append to menubar

            // REMOVE LAYER
            removeLayer: new L.Dropchop.Menu('Remove', {
                iconClassName: "fa fa-minus",
            }).addTo( this.bottom_menu ),
        };

        this.geoOpsConfig = {
            operations: new L.Dropchop.Geo(),        // Configurations of GeoOperations
            executor: new L.Dropchop.TurfExecute()   // Executor of GeoOperations
        };

        this.fileOpsConfig = {
            operations: new L.Dropchop.File(),        // Configurations of FileOperations
            executor: new L.Dropchop.FileExecute()    // Executor of FileOperations
        };

        this.forms = new L.Dropchop.Forms();
        this.notification = new L.Dropchop.Notifications();
        this._addEventHandlers();
        this._handleGetParams();
    },

    /*
    **
    ** Bind events to handlers
    **
    */
    _addEventHandlers: function(){
        this.dropzone.fileReader.on( 'fileparsed', this._handleParsedFile.bind( this ) );
        this.fileOpsConfig.executor.on( 'uploadedfiles', this.dropzone.fileReader._handleFiles.bind(this) );

        // Handle clicks on items within menus
        // NOTE: This is where an operation is tied to a menu item
        this.menus.geo.on( 'clickedOperation', this._handleOperationClick.bind( this, this.geoOpsConfig ) );
        this.menus.save.on( 'clickedOperation', this._handleOperationClick.bind( this, this.fileOpsConfig ) );
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
            this._handleResults.bind(this) // Callback
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
    ** Take results from operation, handle accordingly
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
    },

    /*
    **
    **
    ** Parse URL GET parameters into JSON object
    **
    */
    _getJsonFromUrl: function() {
        var query = location.search.substr(1);
        var result = {};
        query.split("&").forEach(function(part) {
            var item = part.split("=");
            if (!result[item[0]]) {
                result[item[0]] = [];
            }
            result[item[0]].push(decodeURIComponent(item[1]));
        });
        return result;
    },

    /*
    **
    **
    ** Handle URL GET parameters
    **
    */
    _handleGetParams: function() {
        var i, url;
        var data = this._getJsonFromUrl();

        // Handle 'url' Parameter
        if (data.url && data.url.length) {
            for (i = 0; i < data.url.length; i++) {
                url = data.url[i];
                this.fileOpsConfig.executor.execute(
                    'load from url', [url], null, null, this._handleResults.bind(this)
                );
            }
        }

        // Handle 'gist' Parameter
        if (data.gist && data.gist.length) {
            for (i = 0; i < data.gist.length; i++) {
                var gist = data.gist[i];
                this.fileOpsConfig.executor.execute(
                    'load from gist', [gist], null, null, this._handleResults.bind(this)
                );
            }
        }
    }
});
