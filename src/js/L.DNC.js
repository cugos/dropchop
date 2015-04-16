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
            this.layerlist = new L.DNC.LayerList( { layerContainerId: 'dropzone' } )
                .addTo( this.mapView._map );
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
        };
    }
})();
