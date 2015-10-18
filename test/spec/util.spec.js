describe('util.dropchop.js', function() {

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
  var fcToUncollect = {"type":"FeatureCollection","features": [
    {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}},
  ]};
  var fc = {"type":"FeatureCollection","features": [
    {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}},
    {"type":"Feature","geometry":{"type":"Point","coordinates":[130,15]},"properties":{"name":"Some other islands"}}
  ]};

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

  it('dc.util.uncollect()', function() {
    expect(dc.util.uncollect(fcToUncollect)).to.eql(gj);
  });

  it('dc.util.executeFC()', function() {
    // testing destination operation
    var expectedOutput = {"type":"FeatureCollection","features": [
      {"type":"Feature","geometry":{"type":"Point","coordinates":[126.61573747959451, 10.098445590759695]},"properties":{"name":"Dinagat Islands"}},
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

  it('dc.util.jsonFromUrl()', function() {
    var url = '/?url=http://google.com&gist=1234&gist=456&url=http%3A%2F%2Fdropchop.io&url=https://mug.com?cat=booker&fish=truman';
    window.history.pushState(null, null, url);
    expect(dc.util.jsonFromUrl()).to.eql(
        {
            url: ['http://google.com', 'http://dropchop.io', 'https://mug.com?cat=booker&fish=truman'],
            gist: ['1234', '456']
        }
    );
  });




});
