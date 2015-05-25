L.DNC.File = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    remove: {
        minFeatures: 1,
        description: 'Removes a layer from the application.',
        disableForm: true,
    },
    "load from url": {
        description: 'Import file from a URL',
        parameters: [
            {
                name: 'url',
                description :'URL',
                type: 'text',
                default: 'http://'
            },
        ],
    }
});
