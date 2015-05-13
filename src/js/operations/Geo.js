L.DNC.Geo = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    buffer: {
        maxFeatures: 1,
        additionalArgs: 0.1,
        description: 'Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.',
        parameters: [
            {
                name: 'distance',
                description: 'Distance to draw the buffer.',
                type: 'number',
                default: 10
            },
            {
                name: 'unit',
                type: 'select',
                description: '',
                options: ['miles', 'feet', 'kilometers', 'meters', 'degrees'],
                default: 'miles'
            }
        ],
        createsLayer: true
    },

    union: {
        minFeatures: 2,
        maxFeatures: 2,
        description: 'Takes two polygons and returns a combined polygon. If the input polygons are not contiguous, this function returns a MultiPolygon feature.',
        createsLayer: true
    },

    bezier: {
        minFeatures: 1,
        description: 'Takes a line and returns a curved version by applying a Bezier spline algorithm.',
        parameters: [
            {
                name: 'resolution',
                description :'Time in milliseconds between points',
                type: 'number',
                default: 10000
            },
            {
                name: 'sharpness',
                description :'a measure of how curvy the path should be between splines',
                type: 'number',
                default:  0.85 

            }
        ],
        createsLayer: true
    }

});
