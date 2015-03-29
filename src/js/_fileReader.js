function handleFiles(files) {
  for (i = 0; i < files.length; i++) {
    readFile(files[i]);
  }
}

function readFile(fileObject) {
  var fr = new FileReader();
  fr.readAsText(fileObject, 'UTF-8');
  fr.onload = function() {
    var file = JSON.parse(fr.result);
    addLayer(fileObject, file, numLayers);
    numLayers++;
  };
}