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

        L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
        this._map = L.mapbox.map('map', 'svmatthews.hf8pfph5', {
            zoomControl: false
        }).setView([0,0], 3);

    }

});
