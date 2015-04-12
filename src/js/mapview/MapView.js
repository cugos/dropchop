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
        this.download = document.getElementById('download');

        // init hooks
        this._setupMap();
        this._registerEventHandlers();

    } ,


    _setupMap : function () {

        L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
        this._map = L.mapbox.map('map', 'svmatthews.hf8pfph5', {
            zoomControl: false
        }).setView([0,0], 3);

    } ,

    updateDownload : function(file) {
        download.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
    } ,

    _registerEventHandlers: function(){

        // wire L.DNC plugins
        this.dropzone = new L.DNC.DropZone( this._map, {} );
        this.layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' }).addTo( this._map );
        this.geoMenu = new L.DNC.GeoMenu( this.layerlist, {} );

        // examples of events that L.DNC.DropZone.FileReader throws
        this.dropzone.fileReader.on( "enabled", function(e){
            console.debug( "[ FILEREADER ]: enabled > ", e );
        });
        this.dropzone.fileReader.on( "fileparsed", function(e){
            console.debug( "[ FILEREADER ]: file parsed > ", e.file );
            var mapLayer = L.mapbox.featureLayer(e.file);
            this.layerlist.addLayerToList( mapLayer, e.fileInfo.name, true );
            this.numLayers++;
        }.bind(this));

        this.dropzone.fileReader.enable();
    }



});
