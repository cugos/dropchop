function handleFiles(files) {
  for (i = 0; i < files.length; i++) {
    (function(file){
      var fr = new FileReader();
      fr.readAsText(file, 'UTF-8');
      fr.onload = function() {
        var file = JSON.parse(fr.result);
        addLayer(files[0], file, numLayers);
        numLayers++;
      };
    })(files[i]);
  }
}