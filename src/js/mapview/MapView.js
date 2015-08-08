L.Dropchop = L.Dropchop || {};
L.Dropchop.MapView = L.Class.extend({

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

        // mapbox token
        L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
            
        // create a map object on the `map` element id
        this._map = L.mapbox.map('map', null, {
            zoomControl: false,
            worldCopyJump: true
        }).setView([0,0], 3);

        // define our baselayers from mapbox defaults
        var baseLayers = {
            "Mapbox Streets": L.mapbox.tileLayer('mapbox.streets'),
            "Mapbox Outdoors": L.mapbox.tileLayer('mapbox.outdoors'),
            "Mapbox Light": L.mapbox.tileLayer('mapbox.light'),
            "Mapbox Dark": L.mapbox.tileLayer('mapbox.dark'),
            "Mapbox Satellite": L.mapbox.tileLayer('mapbox.satellite')
        };

        // sets the base layer default as mapbox streets
        baseLayers['Mapbox Streets'].addTo(this._map);

        // sets location of base layer control to the bottom right
        L.control.layers(baseLayers, {}, {
            position: 'bottomright',
            collapsed: false
        }).addTo(this._map);

        // sets the location of the zoom buttons to the top right
        L.control.zoom({
            position: 'topright'
        }).addTo(this._map);

    }

});
