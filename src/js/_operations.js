/* 
These are all of the spatial operations the tool can execute.
The first function ops.execute() should be used first, with the second
value `newLayer` typically coming from another ops.function().

For example, ops.execute(info, ops.buffer(object)) 
*/
var ops = {
  // main execution for operations
  execute: function(newLayer) {
    addLayer(newLayer, newLayer.geometry, numLayers);
  },

  // all geometry processes
  geom: {
    buffer: function(object, info) {
      console.log(object, info);
      var newLayer = {
        geometry: turf.buffer(object, 0.1),
        name: 'buffer_' + info.name
      };

      return newLayer;
    },

    // var union = turf.union(poly1, poly2);
    union: function(object1, object2, info1, info2) {

      var poly1 = object1,
          poly2 = object2,
          info1Strip = info1.name.replace('.geojson', ''),
          info2Strip = info2.name.replace('.geojson', '');

      if (object1.features) poly1 = object1.features[0];
      if (object2.features) poly2 = object2.features[0];

      var newLayer = {
        geometry: turf.union(poly1, poly2),
        name: 'union_' + info1Strip + '_' + info2Strip + '.geojson'
      };
      return newLayer;
    },

    erase: function(object1, object2, info1, info2) {
      var poly1 = object1,
          poly2 = object2,
          info1Strip = info1.name.replace('.geojson', ''),
          info2Strip = info2.name.replace('.geojson', '');

      var newLayer = {
        geometry: turf.erase(poly1, poly2),
        name: 'erase_' + info1Strip + '_' + info2Strip + '.geojson'
      };
      return newLayer;

    },

    intersect: function(object1, object2, info1, info2) {
      var poly1 = object1,
          poly2 = object2,
          info1Strip = info1.name.replace('.geojson', ''),
          info2Strip = info2.name.replace('.geojson', '');

        var newLayer = {
          geometry: turf.intersect(poly1, poly2),
          name: 'intersect_' + info1Strip + '_' + info2Strip + '.geojson' 
        };
        return newLayer;
    }
  }
};