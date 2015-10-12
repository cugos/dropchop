function getFirstLayerStamp() {
  var stamp;
  for (var l in dc.layers.list) {
    stamp = l;
  }
  return stamp;
}