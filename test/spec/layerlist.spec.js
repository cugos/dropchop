describe('layerlist.dropchop.js', function() {

  var ops = {id: '#dropchop'};
  dc = {};

  beforeEach(function() {
    var dropchopElem = document.createElement('div');
    dropchopElem.id = 'dropchop';
    document.body.appendChild(dropchopElem);
    dc = dropchop;
    dc.init(ops);
    dc.layers.list = {};
  });

  afterEach(function() {
    document.body.innerHTML = '';
  });

  var gj = {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}};
    
  it('after adding a layer, the DOM element exists', function() {
    dc.layers.add({}, 'test layer name', gj);    
    expect(Object.keys(dc.layerlist.elems).length).to.equal(1);
  });

  // SOMETHING IS BORKED HERE - THERE ARE MANY DUPLICATES OF .layer-element <li>
  // it('dc.layerlist.removeLayerListItem()', function() {
  //   dc.layers.add({}, 'test remove', gj);    
  //   var stamp = getFirstLayerStamp();
  //   var len = Object.keys(dc.layerlist.elems).length;
  //   dc.layerlist.removeLayerListItem({}, stamp);
  //   expect(Object.keys(dc.layerlist.elems).length).to.equal(len - 1);
  // });

});


    