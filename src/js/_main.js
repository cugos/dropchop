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
  layerItem.onclick = function() {
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
  };

  check.onchange = function() {
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

function updateDownload(file) {
  download.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
}
