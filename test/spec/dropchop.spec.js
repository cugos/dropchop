describe('Dropchop!', function() {

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
  });

});