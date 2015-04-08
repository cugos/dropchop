/* The selection object is used when a user selects
specific layers on the layer panel. In order to execute
specific processes, we store what the user has selected
into this object so we can grab the layers quickly and work
on clones of the layers instead of the layers themselves.
*/

var selection = {
  add: function(l) {
    this.list.push(l);
  },
  remove: function(l) {
    for (var i = 0; i < this.list.length; i++) {
      if (l._leaflet_id == this.list[i].layer._leaflet_id) {
        this.list.splice(i, 1);
      }
    }
  },
  list: []
}; 

