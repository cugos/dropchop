var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.menus = dc.menus || {};
  dc.menus.geo = dc.menus.geo || {};

  dc.menus.geo.init = function() {
    // build ops.geo container
    var geoContainer = $('<div>').addClass('operations-geo');
    dc.$elem.append(geoContainer);

    // wire up signal handlers
    $(dc).on('layer:selected', dc.menus.geo.geoCheck);
    $(dc).on('layer:unselected', dc.menus.geo.geoCheck);
    $(dc).on('operation:geo', dc.menus.geo.geoExecute);

    // create geo buttons & forms
    for (var geoOp in dc.ops.geo) {
      var geoBtn = $('<button>').addClass('operation operation-geo operation-inactive')
        .html('<h4>' + geoOp + '</h4><p>' + dc.ops.geo[geoOp].description + '</p>')
        .prop('disabled', true)
        .attr('data-operation', geoOp);
      geoBtn.on('click', _handleBtnClick);

      geoContainer.append(geoBtn);
    }
  };


  /* jshint ignore:start */
  /* ignoring these functions in jshint because we are getting
  an unecessary strict violation warning, but our usage of `this`
  is proper here. */
  function _handleBtnClick(event) {
    event.preventDefault();
    var operation = $(this).attr('data-operation');
    // if operation requires no parameters, don't render a form
    if (!dc.ops.geo[operation].parameters) {
      $(dc).trigger('operation:geo', [operation, dc.selection.list]);
    // otherwise render the form
    } else {
      $(dc).trigger('form:geo', [operation]);
    }
  }
  /* jshint ignore:end */

  // Sort turf operations by availablility and alphabetically
  function _sortGeo() {

    // Get all of the turf buttons and sort them alphabetically
    var alpha = $('.operation-geo').sort(function(a, b) {
      return ($(b).data('operation') < $(a).data('operation')) ? 1 : -1;
    });

    // Grab all the active buttons and reappend them
    alpha.filter(function(i, d) {
      if (!($(d).prop('disabled'))) { return d; }
    }).appendTo('.operations-geo');

    // Grab all the inactive buttons and reappend them
    alpha.filter(function(i, d) {
      if ($(d).prop('disabled')) { return d; }
    }).appendTo('.operations-geo');

    // Scroll to the top to keep things nice
    $('.operations-geo').scrollTop(0);
  }

  /**
   * Execute a turf function based on button operation click.
   * @param {object} original event that triggered this function
   * @param {string} operation to be executed via turf
   * @param {array} series of parameters to be applied to turf operation
   */
  dc.menus.geo.geoExecute = function(event, operation, parameters) {
    var prep = dc.menus.geo.prepareTurfParams(operation, parameters);
    var result = null;
    try {
      result = dc.ops.geo[operation].execute(prep.options);
    } catch(err) {
      dc.notify('That operation isn\'t possible. Try changing the order of your selection.');
      throw err;
    }

    $(dc).trigger('file:added', [prep.name, result]);
  };

  /**
   * Prepare parameters for executing within a turf function using .apply() - returns an array
   * @param {array} options from the user passed from the original event trigger
   */
  dc.menus.geo.prepareTurfParams = function(operation, params) {
    var data = {};
    data.options = [];

    var geoms = [];
    var nameArray = [];
    // get geometry array from selection
    $(dc.selection.list).each(function(i) {
      if ($.inArray('switch-' + dc.selection.list[i].stamp, params) === -1) {
        geoms.push(dc.selection.list[i].raw);
      } else {
        geoms.unshift(dc.selection.list[i].raw);
      }
      nameArray.push(dc.selection.list[i].name);
    });

    // merge params with options array
    data.options = $.merge(geoms, params);

    // create name array
    data.name = dc.util.concat(nameArray, '_', operation);

    return data;
  };

  dc.menus.geo.geoCheck = function(event, layer) {
    // check selection count vs operation min/max
    for (var o in dc.ops.geo) {
      var op = dc.ops.geo[o];
      if (dc.selection.list.length > op.maxFeatures || dc.selection.list.length < op.minFeatures) {
        turnItOff(o);
        // don't go any further
      } else {

        // check operation against each selection data type
        for (var x = 0; x < dc.selection.list.length; x++) {
          var sel = dc.selection.list[x];

          // if the selection type is in the array, mark it as active!
          if ($.inArray(sel.type, op.requirements.types) > -1 || op.requirements.generalFeature === true) {
            turnItOn(o);
          } else {
            turnItOff(o);
          }

        }
      }
    }

    function turnItOff(op) {
      var btn = $('[data-operation='+ op +']');
      btn.addClass('operation-inactive');
      btn.prop('disabled', true);
    }

    function turnItOn(op) {
      var btn = $('[data-operation='+ op +']');
      btn.removeClass('operation-inactive');
      btn.prop('disabled', false);
    }

    // Sort the list
    _sortGeo();
  };

  return dc;

})(dropchop || {});