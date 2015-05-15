L.DNC.File = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    'Save GeoJSON': {
        minFeatures: 1,
        description: 'Write out geojson file',
        parameters: [
            {
                name: 'filename',
                description :'Filename prefix to write',
                default: 'dnc'
            }
        ],
        createsLayer: false
    },

    'Save Shapefile': {
        minFeatures: 1,
        description: 'Write out shapefile file',
        createsLayer: false
    }

});
