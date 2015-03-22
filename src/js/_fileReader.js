function handleFiles(files) {
  fr = new FileReader();
  fr.onloadend = function() {
    var file = JSON.parse(fr.result);
    // addToFileList(files[0], file);

    console.log(file, files);
    addLayer(files[0], file, numLayers);
    // addToMap(file);
    numLayers++;
  };
  fr.readAsText(files[0]);
}