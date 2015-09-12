var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.layerlist = {};
  dc.layerlist.elems = {};

  dc.layerlist.create = function(name) {
    dc.layerlist.$elem = $('<ol>').addClass(name);
    dc.$elem.append(dc.layerlist.$elem);

    $(dc.layerlist).on('layer:added', dc.layerlist.addLayerListItem);
  };

  // triggered in dropchop.js
  dc.layerlist.addLayerListItem = function(event, layer) {
    var layerlistItem = $('<li>').addClass('layer-element').attr('data-stamp', layer.stamp);
    var layerDiv = $('<div>').addClass('layer-name').text(layer.name);
    var checkbox = $('<input>').addClass('layer-toggle').prop({'type': 'checkbox', 'checked': true});
    
    checkbox.on('change', function(e) {
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
    dc.layerlist.$elem.append(layerlistItem);

    dc.layerlist.elems[layer.stamp] = layerlistItem;
  };

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
  }

  return dc;

})(dropchop || {});