describe('util.dropchop.js', function() {

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
  var fcToUncollect = {"type":"FeatureCollection","features": [
    {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}},
  ]};
  var fc = {"type":"FeatureCollection","features": [
    {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}},
    {"type":"Feature","geometry":{"type":"Point","coordinates":[130,15]},"properties":{"name":"Some other islands"}}
  ]};
  var arcjson = {"features": [{"attributes": { "name": "Dinagat Islands"}, "geometry": {"x": 125.6, "y": 10.1}}, {"attributes": {"name": "Some other islands"}, "geometry": {"x": 130, "y": 15}}]};

  var bounds = {"_southWest": { "lat": 46.0, "lng": -123.0}, "_northEast": {"lat": 48.0, "lng": -121.0}};

  it('dc.util.removeFileExtension()', function() {
    var noExtension = dc.util.removeFileExtension('filename.geojson');
    expect(noExtension).to.equal('filename');
  });

  it('dc.util.removeWhiteSpace()', function() {
    // TODO: do we need this? not currently being used
  });

  it('dc.util.concat()', function() {
    var concat = dc.util.concat(['red', 'blue'], '_', 'prefix');
    expect(concat).to.equal('prefix_red_blue');
  });

  it('dc.util.xhr()', function() {
    // TODO: write an xhr test when I have internet connection
  });

  it('dc.util.readFile()', function() {
    // TODO: how do we pass in a real live file?
  });

  it('dc.util.executeUrlParams()', function() {
    // TODO: execute gist and url options, works only with an internet connection
  });

  it('dc.util.getFileExtension()', function() {
    expect(dc.util.getFileExtension('filename.geojson')).to.equal('geojson');
  });

  it('dc.util.getBBox()', function() {
    // TOOD: not sure how to test the bounding box of the map in PhantomJS
  });

  it('dc.util.getEsriBBox()', function() {
    var bounds = dc.map.m.getBounds();
    expect(dc.util.getEsriBBox()).to.equal('-33.75,0,33.75,0');
  });

  it('dc.util.uncollect()', function() {
    expect(dc.util.uncollect(fcToUncollect)).to.eql(gj);
  });

  it('dc.util.esri2geo()', function() {
    var data = dc.util.esri2geo(arcjson);
    expect(data).to.eql(fc);
  });

  it('dc.util.executeFC()', function() {
    // testing destination operation
    var expectedOutput = {"type":"FeatureCollection","features": [
      {"type":"Feature","geometry":{"type":"Point","coordinates":[126.61573747959454, 10.098445590759694]},"properties":{"name":"Dinagat Islands"}},
      {"type":"Feature","geometry":{"type":"Point","coordinates":[131.03526863385326, 14.997661774321049]},"properties":{"name":"Some other islands"}}
    ]};
    var newFC = dc.util.executeFC(fc, 'destination', [fc, 1, 90, 'degrees']);
    expect(newFC).to.eql(expectedOutput);
  });

  it('dc.util.loader()', function() {
    dc.util.loader(true);
    expect($('body').hasClass('dropchop-loading')).to.equal(true);
    dc.util.loader(false);
    expect($('body').hasClass('dropchop-loading')).to.equal(false);
  });

  it('dc.util.jsonFromUrl()', function(done) {
    var url = '/?url=http://google.com&gist=1234&gist=456&url=http%3A%2F%2Fdropchop.io&url=https://mug.com?cat=booker&fish=truman';
    window.history.pushState(null, null, url);
    expect(dc.util.jsonFromUrl()).to.eql(
      {
        url: ['http://google.com', 'http://dropchop.io', 'https://mug.com?cat=booker&fish=truman'],
        gist: ['1234', '456']
      }
    );
    done();
  });

  it('dc.util.updateSearch()', function() {
    var url = '/?gist=333';
    window.history.pushState(null, null, url);

    expect(window.location.search).to.equal('?gist=333');

    // adding a new layer should update, and remove the previous since
    // it doesn't actually exist as a layer
    dc.layers.add({}, 'new gist', gj, 'gist', '444');
    expect(window.location.search).to.equal('?gist=444');

    dc.layers.add({}, 'from a url', gj, 'url', 'http://google.com');
    expect(window.location.search).to.equal('?gist=444&url=http://google.com');
  });

});
