window.onload = init();
window.selection = [];
window.numLayers = 0;
window.download = document.getElementById('download');

function init() {
  addEventHandlers();
  setupMap();
}

function setupMap() {
  L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
  window.map = L.mapbox.map('map', 'svmatthews.hf8pfph5', {
    zoomControl: false
  }).setView([0,0], 3);
}

function addEventHandlers() {

  // dropzone event handlers
  var dz = document.getElementById('dropzone');
  dz.addEventListener('dragover', function(e) {
    e = e || event;
    e.preventDefault();
    this.className = "dragging";
  }, false);
  dz.addEventListener('dragleave', function(e) {
    e = e || event;
    e.preventDefault();
    this.className = "";
  }, false);
  dz.addEventListener('drop', function(e) {
    e = e || event;
    e.preventDefault();
    files = e.dataTransfer.files;
    handleFiles(files);
  }, false);

  // operation event handlers
  var buffer = document.getElementById('buffer');
  buffer.addEventListener('click', function(e){
    // ops.geom.buffer(object, info);
    ops.execute(ops.geom.buffer(selection.list[0].layer._geojson, selection.list[0].info));
  });

  var union = document.getElementById('union');
  union.addEventListener('click', function(e){
    // ops.geom.union(object1, object2, info1, info2);

    ops.execute(ops.geom.union(selection.list[0].layer._geojson, selection.list[1].layer._geojson, selection.list[0].info, selection.list[1].info));
  });

  // menu expand
  var menu = document.getElementsByClassName('menu-expand');
  for (var m = 0; m < menu.length; m++) {
    menu[m].addEventListener('click', function(e) {
      var menuExpand = this.nextSibling.nextSibling;
      if (menuExpand.className.indexOf('expanded') == -1) {
        menuExpand.className += ' expanded';
      } else {
        menuExpand.className = 'menu';
      }      
    });
  }
  
}

function handleFiles(files) {
  fr = new FileReader();
  fr.onloadend = function() {
    var file = JSON.parse(fr.result);
    // addToFileList(files[0], file);

    console.log(file, files);
    addLayer(files[0], file, numLayers);
    // addToMap(file);
    numLayers++;
  }
  fr.readAsText(files[0]);
}

function addLayer(info, layer, z) {
  var mapLayer = L.mapbox.featureLayer(layer)
    .setZIndex(z)
    .addTo(map);

  // add radio button for show/hide of layer
  var check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      check.setAttribute('checked', 'true');
      check.className = 'layer-toggle';

  var layerItem = document.createElement('div');
      layerItem.className = 'layer-name';
      layerItem.innerHTML = info.name;

  var li = document.createElement('li');
      li.className = 'layer-element ' + info.name;

  // when you click the layer item, make it selectable
  layerItem.onclick = function(e) {
    // if the element is currently not selected, add the class
    if (this.className.indexOf('selected') == -1) {

      // add the class
      this.className += ' selected';

      // add to select list
      selection.add({
        info: info,
        layer: mapLayer
      });
    } else {

      // remove selection
      selection.remove(mapLayer);

      // remove class name
      this.className = 'layer-name';
    }
  }

  check.onchange = function(e) {
    // if the box is now checked, show the layer
    console.log(this);
    if (check.checked) {
      map.addLayer(mapLayer);
    } else {
      if (map.hasLayer(mapLayer)) map.removeLayer(mapLayer);
    }
  };

  // first append it, then add the checkbox and inner html
  document.getElementById('fileList').appendChild(li);
  li.appendChild(check);
  li.appendChild(layerItem);

  numLayers++;
}

function addToMap(file) {
  var fl = L.mapbox.featureLayer(file).addTo(map);
}

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
}

function updateDownload(file) {
  download.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
}


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
      }

      console.log(newLayer);
      return newLayer;
    },

    // var union = turf.union(poly1, poly2);
    union: function(object1, object2, info1, info2) {
      console.log(object1, object2);
      var poly1 = object1,
          poly2 = object2,
          info1Strip = info1.name.replace('.geojson', ''),
          info2Strip = info2.name.replace('.geojson', '');

      if (object1.features.length) poly1 = object1.features[0];
      if (object2.features.length) poly2 = object2.features[0];

      var newLayer = {
        geometry: turf.union(poly1, poly2),
        name: 'union_' + info1Strip + '_' + info2Strip + '.geojson'
      }
      return newLayer;
    }
  }


}