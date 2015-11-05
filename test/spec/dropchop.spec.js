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
      this.timeout(5000); // I need more than 2000ms on my laptop
      expect(dc.options).to.equal(ops);
    });

    it('Throws error when dc element is not found', function() {
      expect(function() { dc.init(opsBadElement); }).to.throw(Error);
    });
  });

  describe('notify.dropchop.js', function() {
    it('dc.notify() - appear & disappear', function() {
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

    it('notification closes when close button is clicked', function() {
      dc.init(ops);
      dc.notify('error', 'some error', 'close');

      expect($('.notification-close').length).to.equal(1);

      $('.notification-close').trigger('click');
      expect($('.notification-close').length).to.equal(0);
    });
  });

  describe('dropzone.dropchop.js', function() {
    it('dc.dropzone event listeners', function() {
      $('body').trigger('dragover');
      expect($('body').hasClass('dragging')).to.eq(true);

      $('body').trigger('dragleave');
      expect($('body').hasClass('dragging')).to.eq(false);
    });
  });

  describe('left menu', function() {
    it('order is accurate', function() {
      dc.init(ops);
      if (typeof dc.ops.setup[0] === 'object') {
        expect($('.menu-action:first-child').hasClass('menu-collapse')).to.equal(true);
      } else {
        var op = $('.menu-action:first-child').attr('data-operation');
        expect(op).to.equal(dc.ops.setup[0]);
      }
    });
  });

});
