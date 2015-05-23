L.DNC.File = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    remove: {
        minFeatures: 1,
        description: 'Removes a layer from the application.',
        createsLayer: false
    },
});
