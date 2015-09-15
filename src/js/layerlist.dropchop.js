var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.layerlist = {};
  dc.layerlist.elems = {};

  dc.layerlist.create = function(name) {
    dc.layerlist.$elem = $('<ol>').addClass(name);
    dc.$elem.append(dc.layerlist.$elem);

    var liHelper = $('<li>').addClass('layer-help')
      .html('Welcome to <strong>dropchop</strong>! Here you can drag and drop files and they will show up in the layer list below.<br><br>To the left you can upload and save your files or <a href="/?gist=09129c20ec020b83bf85">add example data</a>.<br><br>To the right you\'ll notice some geospatial operations that become available based on selecting specific layers.' );
    dc.layerlist.$elem.append(liHelper);

    var toggleLayers = $('<li>').addClass('layer-toggleAll')
      .html('<label><input type="checkbox" checked>Toggle all layers</label>');
    toggleLayers.on('change', dc.layerlist.toggleAll);
    dc.layerlist.$elem.append(toggleLayers);

    $(dc.layerlist).on('layer:added', dc.layerlist.addLayerListItem);
    $(dc.layerlist).on('layer:removed', dc.layerlist.removeLayerListItem);
  };

  // triggered in dropchop.js
  dc.layerlist.addLayerListItem = function(event, layer) {
    var layerlistItem = $('<li>').addClass('layer-element').attr('data-stamp', layer.stamp);
    var layerDiv = $('<div>')
      .addClass('layer-name layer-new')
      .text(layer.name)
      .delay(3000)
      .queue(function(next) {
        $(this).removeClass('layer-new');
      });

    
    var layerType = $('<span>').addClass('layer-type-image sprite sprite-layer-'+layerTypeIcon(layer.raw));
    var checkbox = $('<input>').addClass('layer-toggle').prop({'type': 'checkbox', 'checked': true});
    var remove = $('<button>').addClass('layer-action layer-remove').html('<i class="fa fa-times"></i>');
    var duplicate = $('<button>').addClass('layer-action layer-duplicate').html('<i class="fa fa-files-o"></i>');

    duplicate.on('click', function(event) {
      event.preventDefault();
      console.log('make a dupe');
      $(dc.layers).trigger('layer:duplicate', [$(this).parent().attr('data-stamp')]);
      return false;
    });
    
    remove.on('click', function(event) {
      event.preventDefault();
      $(dc.layers).trigger('layer:removed', [$(this).parent().attr('data-stamp')]);
      dc.selection.clear();
      return false;
    });
    
    checkbox.on('change', function(event) {
      if (this.checked) {
        // trigger layer:show
        $(dc.map).trigger('layer:show', [layer]);
      } else {
        $(dc.map).trigger('layer:hide', [layer]);
      }
    });

    layerDiv.on('click', function(event) {
      toggleSelection($(this), layer);
    });

    layerlistItem.append(layerDiv);
    layerlistItem.append(checkbox);
    layerlistItem.append(layerType);
    layerlistItem.append(remove);
    layerlistItem.append(duplicate);
    dc.layerlist.$elem.append(layerlistItem);

    dc.layerlist.elems[layer.stamp] = layerlistItem;

    // hide helper text
    $('.layer-help').hide();
    $('.layer-toggleAll').show();
  };

  function layerTypeIcon(lyr) {
    var icon;
    if (lyr.type === 'FeatureCollection') {
      icon = 'featurecollection';
      return icon;
    } else {
      // otherwise switch
      switch(lyr.geometry.type) {
        case 'Point': 
        case 'MultiPoint': 
          icon = 'point';
          break;
        case 'LineString': 
        case 'MultiLineString': 
          icon = 'line';
          break;
        case 'Polygon': 
        case 'MultiPolygon': 
          icon = 'polygon';
          break;
        case 'GeometryCollection': 
          icon = 'geom';
          break;
        default:
          icon = 'default';
          break; 
      }
      return icon;
    }
  }

  function toggleSelection($item, layer) {
    $item.toggleClass('selected');
    if($item.hasClass('selected')) {
      // remove from selection
      // trigger layer:selected
      $(dc.selection).trigger('layer:selected', [layer]);
      $(dc.ops).trigger('layer:selected', [layer]);
    } else {
      // add to selection
      // trigger layer:unselected
      $(dc.selection).trigger('layer:unselected', [layer]);
      $(dc.ops).trigger('layer:unselected', [layer]);
    }
    dc.form.remove();
  }

  dc.layerlist.toggleAll = function(event) {
    // turn them on
    if ($(this).find('input').prop('checked')) {
      for (var i in dc.layers.list) {
        elemToggle(dc.layers.list[i].stamp, true);
      }
    // turn them off
    } else {
      for (var o in dc.layers.list) {
        elemToggle(dc.layers.list[o].stamp, false);
      }
    }

    function elemToggle(stamp, bool) {
      $('.layer-element[data-stamp='+stamp+']')
        .find('.layer-toggle')
        .prop('checked', bool)
        .trigger('change'); // sets off a chain reaction
    }
  };

  dc.layerlist.removeLayerListItem = function(event, stamp) {
    $('[data-stamp='+stamp+']').fadeOut(300, function() {
      $(this).remove();

      // show helper text if no layers exist
      // this has to check inside since there is a 300 ms delay with the fade
      if ($('.layer-element').length === 0) {
        $('.layer-help').show();
        $('.layer-toggleAll').hide();
      }
    });
  };

  return dc;

})(dropchop || {});