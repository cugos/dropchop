describe('form.dropchop.js', function() {

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

  it('dc.form.create()', function() {
    // test with buffer operation
    dc.form.create('buffer', dc.ops.geo.buffer, 'geo');
    expect($('.dropchop-form').length).to.equal(1);
  });

  it('dc.form.remove()', function() {
    dc.form.create('buffer', dc.ops.geo.buffer, 'geo');
    dc.form.remove();
    expect($('.dropchop-form').length).to.equal(0);
  });

  it('dc.form.createParam()', function() {
    dc.form.create('buffer', dc.ops.geo.buffer, 'geo');
    // buffer has two parameters, so let's expect to when we query for them
    expect($('.dropchop-form-parameter').length).to.equal(2);
  });

  describe('dc.form.inputs', function() {
    it('dc.form.inputs.number()', function() {
      // use buffer number parameter
      var numberParam = {
        name: 'distance',
        description: 'Distance to draw the buffer.',
        type: 'number',
        default: 10
      };

      var $param = dc.form.inputs.number(numberParam);
      expect($param.val()).to.equal('10');
      expect($param.attr('name')).to.equal('distance');
      expect($param.attr('type')).to.equal('number');
    });

    it('dc.form.inputs.select()', function() {
      // use buffer select parameter
      var selectParam = {
        name: 'unit',
        type: 'select',
        description: '',
        options: ['miles', 'feet', 'kilometers', 'meters', 'degrees'],
        default: 'miles'
      };

      var $param = dc.form.inputs.select(selectParam);
      expect($param.val()).to.equal('miles');
      expect($param.attr('name')).to.equal('unit');
      expect($param.find('option').length).to.equal(5);
    });

    it('dc.form.inputs.radio()', function() {
      var radioParam = {
        name: 'favorite fruit',
        type: 'radio',
        description: '',
        options: ['Avocado', 'Kiwi'],
        default: 'Avocado'
      };

      var $param = dc.form.inputs.radio(radioParam);
      expect($param.children(":input")).to.have.length(2);
      expect($param.children(':input[name="favoritefruit"]:checked').val()).to.equal('Avocado');

    });

    it('dc.form.inputs.checkbox()', function() {
      // use simplify checkbox parameter
      var checkboxParam = {
        name: 'high quality',
        type: 'checkbox',
        description: 'whether or not to spend more time to create a higher-quality simplification with a different algorithm',
        default: false
      };

      var $param = dc.form.inputs.checkbox(checkboxParam);
      expect($param.val()).to.equal('false');
      expect($param.attr('name')).to.equal('high quality');
      expect($param.attr('type')).to.equal('checkbox');
    });

    var gj = {"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Dinagat Islands"}};
    var gj2 = {"type":"Feature","geometry":{"type":"Point","coordinates":[131,15]},"properties":{"name":"Some other islands"}};

    it('dc.form.inputs.switch()', function() {


      // var switchParam = {
      //   name: 'Points to clip',
      //   description :'Select the layer that represents the points you want to clip. This assumes the other layer is your clipping polygon.',
      //   type: 'switch'
      // }

      // var $param = dc.form.inputs.switch(switchParam);
      // console.log($param);
      // expect($param.val()).to.equal('false');
      // expect($param.attr('name')).to.equal('high quality');
      // expect($param.attr('type')).to.equal('checkbox');
    });

    it('dc.form.inputs.recursive()', function() {
      // use center recursive parameter
      var checkboxParam = {
        name: 'recursive',
        description: 'Run the operation on each feature in the collection or the entire collection.',
        type: 'recursive'
      };

      var $param = dc.form.inputs.recursive(checkboxParam);
      expect($param.find('.sub-label').length).to.equal(2);
    });

  });



});
