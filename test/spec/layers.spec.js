describe('layers.dropchop.js', function() {

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
    
  it('dc.layers.add()', function() {
    dc.layers.add({}, 'test layer name', gj);
    
    var stamp;
    for (var l in dc.layers.list) {
      stamp = l;
    }

    expect(Object.keys(dc.layers.list).length).to.equal(1);
    expect(dc.layers.list[stamp].type).to.equal('Feature<Point>');
  });

  it('dc.layers.remove()', function() {
    dc.layers.list = {}; // clear layers
    dc.layers.add({}, 'test layer name', gj);
    var stamp;
    for (var l in dc.layers.list) {
      stamp = l;
    }
    dc.layers.remove({}, stamp);
    expect(Object.keys(dc.layers.list).length).to.equal(0);
  });

  it('dc.layers.duplicate()', function() {
    dc.layers.list = {}; // clear layers
    dc.layers.add({}, 'test_duplicate', gj);
    var stamp;
    for (var l in dc.layers.list) {
      stamp = l;
    }
    dc.layers.duplicate({}, stamp);
    expect(Object.keys(dc.layers.list).length).to.equal(2);
    var stamps = [];
    for (var l in dc.layers.list) {
      stamps.push(l);
    }
    expect(dc.layers.list[stamps[0]].raw).to.equal(dc.layers.list[stamps[0]].raw);
  });

  it('dc.layers.rename()', function() {
    dc.layers.list = {}; // clear layers
    dc.layers.add({}, 'test_rename', gj);
    var stamp;
    for (var l in dc.layers.list) {
      stamp = l;
    }
    dc.layers.rename({}, dc.layers.list[stamp], 'a new name');
    expect(dc.layers.list[stamp].name).to.equal('a new name');
  });

  it('dc.layers.makeLayer()', function() {
    var l = dc.layers.makeLayer('test layer name', gj);
    expect(l.name).to.equal('test layer name');
    expect(l.raw).to.equal(gj);
  });

});


    