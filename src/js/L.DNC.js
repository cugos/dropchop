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
            this.notifications = new L.DNC.Notifications( this.dropzone.fileReader, {} );
            
        };
    }
})();
