function handleFiles(files) {
  for (i = 0; i < files.length; i++) {
    readFile(files[i]);
  }
}

function readFile(fileObject) {
  var reader = new FileReader();
  reader.readAsText(fileObject, 'UTF-8');
  reader.onload = function() {
    var file = JSON.parse(reader.result);
    addLayer(fileObject, file, numLayers);
    numLayers++;
  };
  // reader.onprogress = function(data) {
  //   console.log(data);
  // };
}