var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.form = dc.form || {};
  dc.form.init = function() {
    $(dc).on('form:geo', dc.form.geo);
    $(dc).on('form:file', dc.form.file);
  };

  dc.form.geo = function(event, operation) {
    dc.form.create(operation, dc.ops.geo[operation], 'geo');
  };

  dc.form.file = function(event, operation) {
    dc.form.create(operation, dc.ops.file[operation], 'file:' + operation);
  };

  dc.form.create = function(name, info, trigger) {
    dc.form.remove();
    var $html = $('<form>').addClass('dropchop-form dropchop-form-'+trigger)
          .attr('id', 'dropchop-form')
          .attr('data', name);
    var $title = $('<h2>').addClass('dropchop-form-title').text(name).appendTo($html);
    var $desc = $('<p>').addClass('dropchop-form-description').text(info.description).appendTo($html);

    // create params
    if(info.parameters) {
      $(info.parameters).each(function() {
        var p = dc.form.createParam(this);
        p.appendTo($html);
      });
    }

    // create submit button
    var $submit = $('<button>').addClass('dropchop-btn dropchop-btn-green dropchop-form-submit').text('Execute').attr('for', name);
    var $cancel = $('<button>').addClass('dropchop-btn dropchop-btn-cancel dropchop-form-cancel').text('Cancel').attr('type', 'button');
    $cancel.on('click', function(event) {
      event.preventDefault();
      dc.form.remove();
      return false;
    });
    $html.on('submit', function(event) {
      event.preventDefault();
      // get the parameters from the form
      var parameters = [];
      var data = $(this).serializeArray();
      $(data).each(function(i) {
        parameters.push(data[i].value);
      });
      $(dc).trigger('operation:' + trigger, [name, parameters]);
      dc.form.remove();
      return false;
    });
    $html.append($submit);
    $html.append($cancel);

    dc.$elem.append($html);
    // submit button needs trigger operation:geo with op and parameter array
  };

  dc.form.remove = function() {
    $('#dropchop-form').remove();
  };

  dc.form.createParam = function(param) {
    var $input = $('<div>').addClass('dropchop-form-parameter');
    var $label = $('<label>').text(param.name).addClass('dropchop-form-parameter-label');
    var $field = dc.form.inputs[param.type](param);
    $field.appendTo($label);
    if(param.description.length) {
      $('<p>').addClass('dropchop-form-parameter-description').html(param.description).appendTo($label);
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
    },
    checkbox: function(p) {
      var $i = $('<input>').attr('type', 'checkbox')
            .attr('name', p.name)
            .attr('value', p.default);
      return $i;
    },
    radio: function(p) {
      var $i = $('<div>').attr('class', 'radioGroup');
      var groupName = p.name.replace(/\s/g, '');
      $(p.options).each(function(i) {
        var opt = p.options[i];
        var optId = opt.replace(/\s/g, '');
        var $lbl = $('<label>')
              .addClass('sub-label')
              .attr('for', optId);

        var $opt = $('<input>')
              .attr('type', 'radio')
              .attr('id', optId)
              .attr('name', groupName)
              .addClass('radio')
              .val(opt);
        if (opt === p.default) {
          $opt.prop('defaultChecked', true);
        }
        $lbl.append(opt);
        $lbl.appendTo($i);
        $opt.appendTo($i);
      });
      return $i;
    },
    switch: function(p) {
      var $i = $('<div>');
      $(dc.selection.list).each(function(i) {
        var $lbl = $('<label>')
              .addClass('sub-label');
        var $opt = $('<input>')
              .attr('type', 'radio')
              .val('switch-' + dc.selection.list[i].stamp)
              .attr('name', p.name);
        $opt.appendTo($lbl);
        $lbl.append(dc.selection.list[i].name);
        $lbl.appendTo($i);
      });
      return $i;
    },
    recursive: function(p) {
      var $i = $('<div>');

      var $lbl1 = $('<label>')
            .addClass('sub-label');
      var $opt1 = $('<input>')
            .attr('type', 'radio')
            .val('true')
            .attr('name', p.name);
      $opt1.appendTo($lbl1);
      $lbl1.append('Individual features');

      var $lbl2 = $('<label>')
            .addClass('sub-label');
      var $opt2 = $('<input>')
            .attr('type', 'radio')
            .val('false')
            .attr('name', p.name);
      $opt2.appendTo($lbl2);
      $lbl2.append('Entire collection');

      $lbl1.appendTo($i);
      $lbl2.appendTo($i);

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
