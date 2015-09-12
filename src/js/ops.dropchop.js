var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.ops = dc.ops || {};

  dc.ops.init = function() {
    // build ops.geo container
    var geoContainer = $('<div>').addClass('operations-geo');
    dc.$elem.append(geoContainer);

    // create geo buttons & forms
    for (var op in dc.ops.geo) {
      var btn = $('<button>').addClass('operation operation-geo operation-inactive')
        .text(op)
        .prop('disabled', true)
        .attr('data-operation', op);
      btn.on('click', _geoBtnClick);

      geoContainer.append(btn);
    }

    // when layers are selected or unselected, lets check our geo operations
    $(dc.ops).on('layer:selected', dc.ops.geoCheck);
    $(dc.ops).on('layer:unselected', dc.ops.geoCheck);
    $(dc.ops).on('operation:geo', dc.ops.geoExecute);
  };

  function _createGeoForm(operation) {
    console.log(operation + ' form making');
    var data = dc.ops.geo[operation];
    var $html = $('<form>').addClass('operation-geo-form');

    $html.append('<h3>').text(operation);

    return html;
  }

  function _geoBtnClick(event) {
    event.preventDefault();
    var operation = $(this).attr('data-operation');
    var paramsArray = [10, 'miles'];
    $(dc.form).trigger('form:geo', [operation]);
  }

  /**
   * Prepare parameters for executing within a turf function using .apply() - returns an array
   * @param {array} options from the user passed from the original event trigger
   */
  dc.ops.prepareTurfParams = function(params) {
    var data = {};
    data.options = [];

    var geoms = [];
    // get geometry array from selection
    $(dc.selection.list).each(function(i) {
      geoms.push(dc.selection.list[i].raw);
    });

    // merge params with options array
    data.options = $.merge(geoms, params);
    console.log(data.options);

    // prepare name here?
    data.name = 'waka';
    
    return data;
  }; 

  /**
   * Execute a turf function based on button operation click.
   * @param {object} original event that triggered this function
   * @param {string} operation to be executed via turf
   * @param {array} series of parameters to be applied to turf operation
   */
  dc.ops.geoExecute = function(event, operation, parameters) {
    var prep = dc.ops.prepareTurfParams(parameters);
    var result = turf[operation].apply(null, prep.options);

    var newFile = {
      name: prep.name,
      lastModifiedDate: new Date()
    };

    $(dc.layers).trigger('file:added', [newFile, result]);
  };

  dc.ops.geoCheck = function(event, layer) {
    // run through each layer in selection

    if (dc.selection.list.length) {
      $(dc.selection.list).each(function(l) {
        var lyr = dc.selection.list[l];
        var checkType = lyr.raw.type;
        var checkGeomType = lyr.raw.type === 'FeatureCollection' ? null : lyr.raw.geometry.type;
        for (var x in dc.ops.geo) {
          var reqs = dc.ops.geo[x].requirements;
          var btn = $('[data-operation='+ x +']');
          if (reqs &&
              dc.selection.list.length >= dc.ops.geo[x].minFeatures && 
              dc.selection.list.length <= dc.ops.geo[x].maxFeatures) { // if requirements exist and selection matches the minimum number of features

            // if just type check
            if (!reqs.geometry) {
              if ($.inArray(checkType, reqs.type) > -1) {
                btn.removeClass('operation-inactive');
                btn.prop('disabled', false);
              } else {
                btn.addClass('operation-inactive');
                btn.prop('disabled', true);
              }

            // if just geom check
            } else if (!reqs.type) {
              if ($.inArray(checkGeomType, reqs.geometry) > -1) {
                btn.removeClass('operation-inactive');
                btn.prop('disabled', false);
              } else {
                btn.addClass('operation-inactive');
                btn.prop('disabled', true);
              }

            // if both check
            } else if (reqs.type && reqs.geometry) {
              // console.log('this is where we get for bezier');
              // console.log(checkType, reqs.type, $.inArray(checkType, reqs.type));
              // console.log(checkGeomType, reqs.geometry, $.inArray(checkGeomType, reqs.geometry));
              if ($.inArray(checkType, reqs.type) > -1 && $.inArray(checkGeomType, reqs.geometry) > -1) {
                btn.removeClass('operation-inactive');
                btn.prop('disabled', false);
              } else {
                btn.addClass('operation-inactive');
                btn.prop('disabled', true);
              }
            }
          } else {
            btn.addClass('operation-inactive');
            btn.prop('disabled', true);
          }
        }
      });
    } else {
      $('.operation-geo').addClass('operation-inactive');
      $('.operation-geo').prop('disabled', true);
    }
  };

  return dc;

})(dropchop || {});