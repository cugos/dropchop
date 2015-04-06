(function(){

    var DncMap = function( options ) {

        this.options = options || {};

        if ( !( this instanceof DncMap ) ) {
            return new DncMap();
        }

        this.numLayers = 0;
        this._map = null;
        this.download = document.getElementById('download');

    };

    DncMap.prototype = {

        init : function() {

            this.addEventListeners();
            this.setupMap();

            // wire L.DNC plugins
            this.dropzone = new L.DNC.DropZone( this._map, {} );
            this.layerlist = new L.DNC.JsonLayerList( { fileContainerId: 'dropzone' })
                .addTo( this._map );
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

        } ,

        // TODO: the registration event is not used anymore
        // but might be in the future for geoprocessing module registration
        addEventListeners : function() {
            document.dispatchEvent( this.registration_event );
        } ,

        setupMap : function () {

            L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
            this._map = L.mapbox.map('map', 'svmatthews.hf8pfph5', {
                zoomControl: false
            }).setView([0,0], 3);

        } ,

        updateDownload : function(file) {
            download.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
        }

    };


    /*
    **
    **  getters and setters
    **
    */
    Object.defineProperty( DncMap.prototype, 'registration_event_name', {
        get : function() {
            return 'register';
        }
    });

    Object.defineProperty( DncMap.prototype, 'registration_event', {
        writeable : false ,
        configurable: false ,
        value : (function(){
            var eventObj = new CustomEvent( DncMap.prototype.registration_event_name, { 'detail' : {}  , bubbles : true , cancelable : true } );
            eventObj.extraData = {}; // to be used later
            return eventObj;
        })()
    });

    var DncApp = {
        version: '0.0.1-dev' ,
        map: new DncMap()
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = DncApp;
    }

    if (typeof window !== 'undefined') {
        window.DncApp = DncApp;
    }
})();




