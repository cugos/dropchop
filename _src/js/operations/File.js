L.Dropchop.File = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    'save geojson': {
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

    'save shapefile': {
        minFeatures: 1,
        description: 'Write out shapefile file',
        createsLayer: false
    },

    remove: {
        minFeatures: 1,
        description: 'Removes a layer from the application.',
        disableForm: true,
    },
    upload: {
        parameters: [
            {
                description: 'File to upload.',
                type: 'file',
                extra: 'multiple',
            }
        ]
    },

    'load from url': {
        description: 'Import file from a URL',
        parameters: [
            {
                name: 'url',
                description :'URL',
                type: 'text',
                default: 'http://',
            },
        ],
    },

    'load from gist': {
        description: 'Import files from a Github Gist',
        parameters: [
            {
                name: 'gist',
                description :'Gist ID or URL',
                type: 'text',
            },
        ],
    }
});
