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
        this._map = L.mapbox.map('map', null, {
            zoomControl: false
        }).setView([0,0], 3);

        var baseLayers = {
            "Mapbox Streets": L.mapbox.tileLayer('mapbox.streets'),
            "Mapbox Outdoors": L.mapbox.tileLayer('mapbox.outdoors'),
            "Mapbox Light": L.mapbox.tileLayer('mapbox.light'),
            "Mapbox Dark": L.mapbox.tileLayer('mapbox.dark'),
            "Mapbox Satellite": L.mapbox.tileLayer('mapbox.satellite')
        };

        baseLayers['Mapbox Streets'].addTo(this._map);
        L.control.layers(baseLayers, {}, {
            position: 'bottomright',
            collapsed: false
        }).addTo(this._map);

    }

});
