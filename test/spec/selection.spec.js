describe('selection.dropchop.js', function() {

  var ops = {id: '#dropchop'};
  dc = {};

  beforeEach(function() {
    var dropchopElem = document.createElement('div');
    dropchopElem.id = 'dropchop';
    document.body.appendChild(dropchopElem);
    dc = dropchop;
    dc.init(ops);
  });

  afterEach(function() {
    document.body.innerHTML = '';
  });

  var gj = {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}};
    
  it('dc.selection.add()', function() {
    // create a layer first
    dc.layers.list = {};
    dc.layers.add({}, 'test layer name', gj);
    var s = getFirstLayerStamp();

    // add the only layer
    dc.selection.add({}, dc.layers.list[s]);

    expect(dc.selection.list.length).to.equal(1);
    expect(dc.selection.list[0].stamp).to.equal(parseInt(s));
  });

  it('dc.selection.remove()', function() {
    // since we aren't resetting dc, selection already has a layer in it
    var s = getFirstLayerStamp();
    dc.selection.remove({}, dc.layers.list[s]);
    expect(dc.selection.list.length).to.equal(0);
  });

  it('dc.selection.clear()', function() {
    // create a layer first
    dc.layers.list = {};
    dc.layers.add({}, 'test layer name', gj);
    var s = getFirstLayerStamp();

    // add the only layer
    dc.selection.add({}, dc.layers.list[s]);
    dc.selection.clear();
    expect(dc.selection.list.length).to.equal(0);
  });

});


    