describe('Dropchop!', function() {

  var ops = {id: '#dropchop'};
  var opsBadElement = {id: '#doesnotexist'};

  beforeEach(function() {
    var dropchopElem = document.createElement('div');
    dropchopElem.id = 'dropchop';
    document.body.appendChild(dropchopElem);

    dc = dropchop;
  });

  afterEach(function() {
    document.body.innerHTML = '';
  });

  describe('dropchop.js', function() {
    
    it('Throws error without options set', function() {
      expect(function() { dc.init(); }).to.throw(Error);
    });

    it('Options are set', function() {
      dc.init(ops);
      expect(dc.options).to.equal(ops);
    });

    it('Throws error when dc element is not found', function() {
      expect(function() { dc.init(opsBadElement) }).to.throw(Error);
    });
  });

  describe('notify.dropchop.js', function() {
    it('Notifications fire, and disappear', function() {
      dc.init(ops);
      dc.notify('success', 'some text', 200);
      
      // there should be one notification on the DOM
      expect($('.notification').length).to.equal(1);

      // after 200 ms, there should be no notifications on the DOM
      // let's check after 300 ms
      setTimeout(function() {
        expect($('.notification').length).to.equal(0);
      }, 300);
    });
  });

});