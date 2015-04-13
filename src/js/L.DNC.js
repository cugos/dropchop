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
            this.geoMenu = new L.DNC.Menu( this.layerlist, {} );
            this.notifications = new L.DNC.Notifications( this.mapView._map, {} );

            // examples of events that L.DNC.DropZone.FileReader throws
            this.dropzone.fileReader.on( "fileparsed", function(e){
                // TODO: This should be refactored so that this.dropzone and
                // this.layerlist are not so tightly coupled. The logic behind
                // this tooling should exist within their respective modules.
                console.debug( "[ FILEREADER ]: file parsed > ", e.file );
                var mapLayer = L.mapbox.featureLayer(e.file);
                this.layerlist.addLayerToList( mapLayer, e.fileInfo.name, true );
                this.numLayers++;

                this.notifications.add({
                    text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
                    type: 'success',
                    time: 2000
                });
            }.bind(this));
        };
    }
})();
