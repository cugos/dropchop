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
        this.layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } ).addTo( this.mapView._map );

        this.menubar = new L.DNC.MenuBar( { id: 'menu-bar' } ).addTo( document.body );

        // build out menus
        this.menus = {
            geo: new L.DNC.Menu('Geoprocessing', {  // New dropdown menu
                items: ['buffer', 'union', 'tin']          // Items in menu
            }).addTo( this.menubar )                // Append to menubar
        };

        this.geoOpsConfig = {
            operations: new L.DNC.Geo(),        // Configurations of GeoOperations
            executor: new L.DNC.GeoExecute()    // Executor of GeoOperations
        };

        this.forms = new L.DNC.Forms();

        this.notification = new L.DNC.Notifications();
        this._addEventHandlers();

    },

    _addEventHandlers: function(){
        this.dropzone.fileReader.on( 'fileparsed', this._handleParsedFile.bind( this ) );

        // Handle clicks on items within geoMenu
        // NOTE: This is where an operation is tied to a menu item
        this.menus.geo.on( 'clickedOperation', this._handleOperationClick.bind( this, this.geoOpsConfig ) );
    },

    /*
    **
    ** Lookup operation by name from operations configuration, validate selection,
    ** and render appropriate form
    **
    */
    _handleOperationClick: function( opsConfig, e ) {
        var config = opsConfig.operations[e.action];
        try {
            opsConfig.executor.validate( this.getLayerSelection(), config );
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

        var form = this.forms.render( e.action, config );
        form.on( 'submit', this._handleFormSubmit.bind( this, opsConfig ) );
    },

    /*
    **
    ** Take input from an options form, use input to execute operation, get new
    ** layer, pass new layer off to be added to map.
    **
    */
    _handleFormSubmit: function( opsConfig, e ) {
        var config = opsConfig.operations[e.action];
        var results = opsConfig.executor.execute(
            e.action,
            e.parameters,
            config,
            this.getLayerSelection()
        );

        if (config.createsLayer) {
            this._handleGeoResult(results);
        } else {
            // TODO: Handle non-geo results
        }
    },

    /*
    **
    ** Take newly parsed file, add to make and layerlist
    **
    */
    _handleParsedFile: function( e ) {
        var layer = L.mapbox.featureLayer( e.file );
        this.layerlist.addLayerToList( layer, e.fileInfo.name, true );
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
    _handleGeoResult: function( layer ) {
        var mapLayer = L.mapbox.featureLayer( layer.geometry );
        this.layerlist.addLayerToList( mapLayer, layer.name, true );

        this.notification.add({
            text: '<strong>' + layer.name + '</strong> created successfully.',
            type: 'success',
            time: 2500
        });
    },

    getLayerSelection: function(){
        return this.layerlist.selection.list || [];
    }

});
