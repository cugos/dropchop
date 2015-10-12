var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.ops = dc.ops || {};

  dc.ops.geo = {
    along: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: false,
        types: ['Feature<LineString>', 'FeatureCollection']
      },
      description: 'Takes a line and returns a point at a specified distance along the line.',
      parameters: [
        {
          name: 'distance',
          description :'distance along the line',
          type: 'number',
          default: 10
        },
        {
          name: 'units',
          type: 'select',
          description: '',
          options: ['miles', 'kilometers', 'radians', 'degrees'],
          default: 'miles'
        }
      ],
      execute: function(params) {
        var result = {};
        var newParams = params;

        // if there is a feature collection, do it recursively
        if (params[0].type === 'FeatureCollection') {
          result = dc.util.executeFC(params[0], 'along', params);
        // otherwise it's a single 
        } else {
          result = turf.along.apply(null, params);
        }
        return result;
      }
    },

    bezier: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: false,
        types: ['Feature<LineString>', 'FeatureCollection']
      },
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
      execute: function(params) {
        var result = {};
        var newParams = params;

        // if there is a feature collection, do it recursively
        if (params[0].type === 'FeatureCollection') {
          result = dc.util.executeFC(params[0], 'bezier', params);
        // otherwise it's a single 
        } else {
          result = turf.bezier.apply(null, params);
        }
        return result;
      }
    },

    buffer: {
      maxFeatures: 1,
      minFeatures: 1,
      requirements: {
        generalFeature: true,
        types: ['Feature', 'FeatureCollection']
      },
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
      execute: function(params) {
        var result = turf.buffer.apply(null, params);
        return result;
      }
    },

    center: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: true,
        types: ['Feature', 'FeatureCollection']
      },
      description: 'Creates a point in the center of the feature.',
      parameters: [
        {
          name: 'recursive',
          description: 'Run the operation on each feature in the collection or the entire collection.',
          type: 'recursive'
        }
      ],
      execute: function(params) {
        var result = {};
        // if running the operation recursively "true"
        if (params[1] === "true") {
          result = dc.util.executeFC(params[0], 'center', params);
        } else {
          result = turf.center.apply(null, params);
        }
        return result;
      }
    },

    centroid: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: true,
        types: ['Feature', 'FeatureCollection']
      },
      description: 'Creates a point in the centroid of the features.',
      parameters: [
        {
          name: 'recursive',
          description: 'Run the operation on each feature in the collection or the entire collection.',
          type: 'recursive'
        }
      ],
      execute: function(params) {
        var result = {};
        // if running the operation recursively "true"
        if (params[1] === "true") {
          result = dc.util.executeFC(params[0], 'centroid', params);
        } else {
          result = turf.centroid.apply(null, params);
        }
        return result;
      }
    },

    destination: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: false,
        types: ['Feature<Point>', 'FeatureCollection']
      },
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
      execute: function(params) {
        var result = {};
        var newParams = params;

        // if there is a feature collection, do it recursively
        if (params[0].type === 'FeatureCollection') {
          result = dc.util.executeFC(params[0], 'destination', params);
        // otherwise it's a single 
        } else {
          result = turf.destination.apply(null, params);
        }
        return result;
      }
    },

    envelope: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: false,
        types: ['FeatureCollection'] // TODO: make this take features and run across full selection
      },
      description: 'Takes any number of features and returns a rectangular Polygon that encompasses all vertices.',
      execute: function(params) {
        var result = turf.envelope.apply(null, params);
        return result;
      }
    },

    explode: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: true,
        types: ['Feature', 'FeatureCollection']
      },
      description: 'Takes a feature or set of features and returns all positions as points.',
      execute: function(params) {
        var result = turf.explode.apply(null, params);
        return result;
      }
    },

    midpoint: {
      minFeatures: 2,
      maxFeatures: 2,
      requirements: {
        generalFeature: false,
        types: ['Feature<Point>']
      },
      description: 'Takes two points and returns a point midway between them.',
      execute: function(params) {
        var result = turf.midpoint.apply(null, params);
        return result;
      }
    },

    simplify: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: false,
        types: ['Feature<LineString>', 'Feature<Polygon>', 'FeatureCollection']
      },
      description: 'Takes a LineString or Polygon and returns a simplified version. Internally uses simplify-js to perform simplification.',
      parameters: [
          {
            name: 'tolerance',
            description :'simplification tolerance',
            type: 'number',
            default: 0.1
          },
          {
            name: 'high quality',
            type: 'checkbox',
            description: 'whether or not to spend more time to create a higher-quality simplification with a different algorithm',
            default: false
          }
      ],
      execute: function(params) {
        var result = {};
        var newParams = params;

        // if there is a feature collection, do it recursively
        if (params[0].type === 'FeatureCollection') {
          result = dc.util.executeFC(params[0], 'simplify', params);
        // otherwise it's a single 
        } else {
          result = turf.simplify.apply(null, params);
        }
        return result;
      }
    },

    tin: {
      minFeatures: 1,
      maxFeatures: 1,
      requirements: {
        generalFeature: false,
        types: ['FeatureCollection']
      },
      description: 'Triangulated irregular network, interpolation method',
      execute: function(params) {
        var result = turf.tin.apply(null, params);
        return result;
      }
    },

    union: {
      minFeatures: 2,
      maxFeatures: 2,
      requirements: {
        generalFeature: false,
        types: ['Feature<Polygon>']
      },
      description: 'Takes two polygons and returns a combined polygon. If the input polygons are not contiguous, this function returns a MultiPolygon feature.',
      execute: function(params) {
        var result = turf.union.apply(null, params);
        return result;
      }
    },

    within: {
      minFeatures: 2,
      maxFeatures: 2,
      requirements: {
        generalFeature: false,
        types: ['FeatureCollection']
      },
      description: 'Takes a set of points and a set of polygons and returns the points that fall within the polygons. First input should be the points.',
      parameters: [
        {
          name: 'Points to clip',
          description :'Select the layer that represents the points you want to clip. This assumes the other layer is your clipping polygon.',
          type: 'switch'
          // default: dc.selection.list[0]
        }
      ],
      execute: function(params) {
        var result = turf.within.apply(null, params);
        return result;
      }
    }
  };

  return dc;

})(dropchop || {});