var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.ops = dc.ops || {};

  dc.ops.init = function() {
    // build ops.geo container
    var geoContainer = $('<div>').addClass('operations-geo');
    dc.$elem.append(geoContainer);

    for (var op in dc.ops.geo) {
      var btn = $('<button>').addClass('operation operation-geo operation-inactive')
        .text(op)
        .attr('data-operation', op);
      geoContainer.append(btn);
    }

    // when layers are selected or unselected, lets check our geo operations
    $(dc.ops).on('layer:selected', dc.ops.geoCheck);
    $(dc.ops).on('layer:unselected', dc.ops.geoCheck);
  };

  dc.ops.geoCheck = function(event, layer) {
    // run through each layer in selection
    if (Object.keys(dc.selection.list).length) {
      for (var l in dc.selection.list) {
        var lyr = dc.selection.list[l];
        var checkType = lyr.raw.type;
        var checkGeomType = lyr.raw.type === 'FeatureCollection' ? null : lyr.raw.geometry.type;
        for (var x in dc.ops.geo) {
          var reqs = dc.ops.geo[x].requirements;
          if (reqs) {
            var btn = $('[data-operation='+ x +']');
            // if just type check
            if (!reqs.geometry) {
              if ($.inArray(checkType, reqs.type) > -1) {
                btn.removeClass('operation-inactive');
              } else {
                btn.addClass('operation-inactive');
              }
            // if just geom check
            } else if (!reqs.type) {
              if ($.inArray(checkGeomType, reqs.geometry) > -1) {
                btn.removeClass('operation-inactive');
              } else {
                btn.addClass('operation-inactive');
              }
            // if both check
            } else if (reqs.type && reqs.geometry) {
              console.log('this is where we get for bezier');
              console.log(checkType, reqs.type, $.inArray(checkType, reqs.type));
              console.log(checkGeomType, reqs.geometry, $.inArray(checkGeomType, reqs.geometry));
              if ($.inArray(checkType, reqs.type) > -1 && $.inArray(checkGeomType, reqs.geometry) > -1) {
                btn.removeClass('operation-inactive');
              } else {
                btn.addClass('operation-inactive');
              }
            }
          }
        }
      }
    } else {
      $('.operation-geo').addClass('operation-inactive');
    }
  };

  return dc;

})(dropchop || {});