var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.form = dc.form || {};
  dc.form.init = function() {
    $(dc.form).on('form:geo', dc.form.geo);
  };

  dc.form.geo = function(event, operation) {
    dc.form.create(operation, dc.ops.geo[operation], 'geo');
  };

  dc.form.create = function(name, info, trigger) {
    dc.form.remove();
    var $html = $('<form>').addClass('dropchop-form dropchop-form-'+trigger)
      .attr('id', 'dropchop-form')
      .attr('data', name);
    var $title = $('<h3>').addClass('dropchop-form-title').text(name).appendTo($html);
    var $desc = $('<p>').addClass('dropchop-form-description').text(info.description).appendTo($html);

    // create params
    if(info.parameters) {
      $(info.parameters).each(function() {
        var p = dc.form.createParam(this);
        p.appendTo($html);
      });
    }

    // create submit button
    var $submit = $('<button>').addClass('dropchop-form-submit').text('Execute').attr('for', name);
    $html.on('submit', function(event) {
      event.preventDefault();
      // get the parameters from the form
      console.log('operation:' + trigger, name);
      var parameters = [];
      var data = $(this).serializeArray();
      $(data).each(function(i) {
        parameters.push(data[i].value);
      });
      console.log(data, parameters);
      $(dc.ops).trigger('operation:' + trigger, [name, parameters]);
      dc.form.remove();
      return false;
    });
    $html.append($submit);
    dc.$elem.append($html);
    // submit button needs trigger operation:geo with op and parameter array
  };

  dc.form.remove = function() {
    $('#dropchop-form').remove();
  };

  dc.form.createParam = function(param) {
    var $input = $('<div>').addClass('dropchop-form-parameter');
    var $label = $('<label>').text(param.name);
    var $field = dc.form.inputs[param.type](param);
    $field.appendTo($label);
    if(param.description.length) {
      $('<p>').addClass('dropchop-form-parameter-description').text(param.description).appendTo($label);
    }
    $input.append($label);
    return $input;
  };

  dc.form.inputs = {
    number: function(p) {
      var $i = $('<input>').attr('type', 'number')
        .attr('name', p.name)
        .attr('value', p.default);
      return $i;
    },
    select: function(p) {
      var $i = $('<select>').attr('name', p.name);
      $(p.options).each(function(i) {
        var $opt = $('<option>').text(p.options[i])
          .attr('value', p.options[i]);
        $opt.appendTo($i);
      });
      return $i;
    },
    text: function(p) {
      var $i = $('<input>').attr('type', 'text')
        .attr('name', p.name)
        .attr('value', p.default);
      return $i;
    }
  };

  // dc.form.getValues = function($form) {
  //   var values = [];
  //   console.log($form);
  //   return values;
  // };

  return dc;

})(dropchop || {});