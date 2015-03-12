window.onload = init();
window.selection = [];
window.numLayers = 0;

function init() {
  addEventHandlers();
  setupMap();
}

function setupMap() {
  L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
  window.map = L.mapbox.map('map', 'svmatthews.hf8pfph5').setView([0,0], 3);
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
}

function handleFiles(files) {
  fr = new FileReader();
  fr.onloadend = function() {
    var file = JSON.parse(fr.result);
    // addToFileList(files[0], file);
    addLayer(files[0], L.mapbox.featureLayer(file), files[0].name, numLayers, file.features[0].geometry.type);
    // addToMap(file);
    numLayers++;
    // var download = document.getElementById('download');
    // download.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newFile));
  }
  fr.readAsText(files[0]);
}

// function addToFileList(original, fileContent) {
//   console.log(original, fileContent);
//   var li = document.createElement('li');
//   li.className = 'layer ' + fileContent.features[0].geometry.type;
//   li.innerHTML = original.name;
//   document.getElementById('fileList').appendChild(li);
// }

function addLayer(original, layer, name, z, type) {
  layer
    .setZIndex(z)
    .addTo(map);

  var li = document.createElement('li');
      li.className = 'layer active ' + type;
      li.innerHTML = original.name;

  li.onclick = function(e) {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
      li.className = 'layer ' + type;
    } else {
      map.addLayer(layer);
      li.className = 'layer active ' + type;
    }
  };

  document.getElementById('fileList').appendChild(li);
}

function addToMap(file) {
  var fl = L.mapbox.featureLayer(file).addTo(map);
}

function buffer(object) {
  var newFile = turf.buffer(file, 100, 'miles');
}