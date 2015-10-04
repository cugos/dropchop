{id: '#dropchop'}describe('Dropchop!', function() {

  var ops = {id: '#dropchop'};
  var opsBadElement = {id: '#doesnotexist'};

  beforeEach(function() {
    var dropchopElem = document.createElement('div');
    dropchopElem.id = 'dropchop';
    document.body.appendChild(dropchopElem);

    // dc = dropchop;
  });

  afterEach(function() {
    document.body.innerHTML = '';
  });

  describe('Initialization', function() {
    
    it('Throws error without options set', function() {
      expect(function() { dropchop.init(); }).to.throw(Error);
    });

    it('Options are set', function() {
      dropchop.init(ops);
      expect(dropchop.options).to.equal(ops);
    });

    it('Throws error when dropchop element is not found', function() {
      expect(function() { dropchop.init(opsBadElement) }).to.throw(Error);
    });

    it('Layer added is successful', function() {
      dropchop.init(ops);
      var testGeoJSON = {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}};
      $(dropchop.layers).trigger('file:added', ['new file', testGeoJSON]);
      expect(Object.keys(dropchop.layers.list).length).to.be.above(0);
    });
  });

});