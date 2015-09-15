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

        //add locate me button
        var geolocate = document.getElementById('geolocate');

        // create a map object on the `map` element id
        this._map = L.mapbox.map('map', null, {
            zoomControl: false,
            worldCopyJump: true
        }).setView([0,0], 3);

        // locate me js shhtuffs


var myLayer = L.mapbox.featureLayer().addTo(this._map);

// This uses the HTML5 geolocation API, which is available on
// most mobile browsers and modern browsers, but not in Internet Explorer
//
// See this chart of compatibility for details:
// http://caniuse.com/#feat=geolocation
if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
} else {
    geolocate.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this._map.locate();
    };
}

// Once we've got a position, zoom and center the map
// on it, and add a single marker.
this._map.on('locationfound', function(e) {
    this._map.fitBounds(e.bounds);

    myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
    });

    // And hide the geolocation button
    geolocate.parentNode.removeChild(geolocate);
});

// If the user chooses not to allow their location
// to be shared, display an error message.
this._map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
});
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
