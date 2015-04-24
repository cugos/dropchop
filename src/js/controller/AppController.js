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
                    additionalArgs: 0.1
                }))
                .addChild(new L.DNC.TurfOperation('union', {
                    minFeatures: 2,
                    maxFeatures: 2
                }))
                .addChild(new L.DNC.TurfOperation('erase', {
                    minFeatures: 2,
                    maxFeatures: 2
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
            time: 2000
        });
    } ,

    _handleTurfResults: function( e ) {
        this.layerlist.addLayerToList(e.mapLayer, e.layerName, e.isOverlay );
    } ,

    getLayerSelection: function(){
        return this.layerlist.selection.list || [];
    }

});
