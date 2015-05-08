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

        L.mapbox.accessToken = 'pk.eyJ1IjoibHl6aWRpYW1vbmQiLCJhIjoicVFlRGd0SSJ9.raSJU76jSGHUvxkub6JKSg';
        this._map = L.mapbox.map('map', 'mapbox.streets', {
            zoomControl: false
        }).setView([0,0], 3);

    }

});
