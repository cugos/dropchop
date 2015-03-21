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

  var buffer = document.getElementById('buffer');
  buffer.addEventListener('click', function(e){
    operations.buffer(selection.list[0]._geojson);
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
    addLayer(files[0], L.mapbox.featureLayer(file), files[0].name, numLayers, file.features[0].geometry.type);
    // addToMap(file);
    numLayers++;
  }
  fr.readAsText(files[0]);
}

function addLayer(original, layer, name, z, type) {
  layer
    .setZIndex(z)
    .addTo(map);

  // add radio button for show/hide of layer
  var check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      check.setAttribute('checked', 'true');
      check.className = 'layer-toggle';

  var layerItem = document.createElement('div');
      layerItem.className = 'layer-name';
      layerItem.innerHTML = original.name;

  var li = document.createElement('li');
      li.className = 'layer-element ' + type;

  // when you click the layer item, make it selectable
  layerItem.onclick = function(e) {
    // if the element is currently not selected, add the class
    if (this.className.indexOf('selected') == -1) {

      // add the class
      this.className += ' selected';

      // add to select list
      selection.add(layer);
    } else {

      // remove selection
      selection.remove(layer);

      // remove class name
      this.className = 'layer-name';
    }
  }

  check.onchange = function(e) {
    // if the box is now checked, show the layer
    console.log(this);
    if (check.checked) {
      map.addLayer(layer);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  };

  // first append it, then add the checkbox and inner html
  document.getElementById('fileList').appendChild(li);
  li.appendChild(check);
  li.appendChild(layerItem);
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
      if (l._leaflet_id == this.list[i]._leaflet_id) {
        this.list.splice(i, 1);
      }
    }
  },
  list: []
}

function updateDownload(file) {

  download.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));

}

var operations = {
  buffer: function(object) {
    var newFile = turf.buffer(object, 10);
    var orig = {
      name: 'this is a new layer'
    }
    addLayer(orig, L.mapbox.featureLayer(newFile), orig.name, numLayers, newFile.features[0].geometry.type);
    updateDownload(newFile);
  }
}