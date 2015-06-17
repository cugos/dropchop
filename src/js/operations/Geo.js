L.Dropchop.Geo = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

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
    },

    buffer: {
        maxFeatures: 1,
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
    },

    center: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Creates a point in the center of the feature.',
    },

    centroid: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Creates a point in the centroid of the features.',
    },

    destination: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Takes a Point and calculates the location of a destination point given a distance in degrees, radians, miles, or kilometers; and bearing in degrees. This uses the Haversine formula to account for global curvature.',
        parameters: [
            {
                name: 'distance',
                description :'distance from the starting point',
                type: 'number',
                default: 10
            },
            {
                name: 'bearing',
                description :'ranging from -180 to 180',
                type: 'number',
                default:  0

            },
            {
                name: 'units',
                type: 'select',
                description: '',
                options: ['miles', 'kilometers', 'radians', 'degrees'],
                default: 'miles'
            }
        ],
    },

    envelope: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Takes any number of features and returns a rectangular Polygon that encompasses all vertices.',
    },

    midpoint: {
        minFeatures: 2,
        maxFeatures: 2,
        description: 'Takes two points and returns a point midway between them.',
    },

    union: {
        minFeatures: 2,
        maxFeatures: 2,
        description: 'Takes two polygons and returns a combined polygon. If the input polygons are not contiguous, this function returns a MultiPolygon feature.',
    },

    tin: {
        minFeatures: 1,
        maxFeatures: 1,
        description: 'Triangulated irregular network, interpolation method',
    }



});
