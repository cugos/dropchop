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
                    description: 'Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.',
                    parameters: [
                        {
                            name: 'distance',
                            description: 'Distance to draw the buffer.',
                            type: 'number'
                        },
                        {
                            name: 'unit',
                            type: 'select',
                            description: '',
                            options: ['miles', 'feet', 'kilometers', 'meters', 'degrees'],
                            selected: 'miles'
                        }
                    ]
                }))
                .addChild(new L.DNC.TurfOperation('union', {
                    minFeatures: 2,
                    maxFeatures: 2,
                    description: 'Takes two polygons and returns a combined polygon. If the input polygons are not contiguous, this function returns a MultiPolygon feature.'
                }))
                .addChild(new L.DNC.TurfOperation('erase', {
                    minFeatures: 2,
                    maxFeatures: 2
                }))
            );

        this.notification = new L.DNC.Notifications();
        this.forms = new L.DNC.Forms();
        this._addEventHandlers();

    },

    _addEventHandlers: function(){
        this.dropzone.fileReader.on( 'fileparsed', this._handleParsedFile.bind( this ) );
        this.menuBar.on( 'operation-result', this._handleTurfResults.bind(this) );

        this.menuBar.on( 'operation-click', this._handleOperationClick.bind(this) );
    },

    _handleParsedFile: function( e ) {
        var mapLayer = L.mapbox.featureLayer(e.file);
        this.layerlist.addLayerToList( mapLayer, e.fileInfo.name, true );
        this.mapView.numLayers++;

        this.notification.add({
            text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
            type: 'success',
            time: 2500
        });
    },

    _handleTurfResults: function( e ) {
        this.layerlist.addLayerToList(e.mapLayer, e.layerName, e.isOverlay );
    },

    _handleOperationClick: function ( e ) {
        this.forms.render( e );
    },

    getLayerSelection: function(){
        return this.layerlist.selection.list || [];
    }

});
