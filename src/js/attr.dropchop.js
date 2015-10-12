// var dropchop = (function(dc) {
  
//   'use strict';

//   dc = dc || {};
//   dc.attr = {};
//   dc.attr.selection = [];

//   dc.attr.render = function(layer) {
//     console.log(layer);
//     var count = 1,
//         fl = layer.featurelayer,
//         content = '<table id="dropchop-attr-table">',
//         headers = '<tr><th class="attr-count-th">#</th>',
//         rows = '';

//     // create row
//     fl.eachLayer(function(lyr) {
//       rows += '<tr class="attr-row" data-layer-id="'+lyr._leaflet_id+'"><td class="attr-count">'+count+'</td>';

//       for (var prop in lyr.feature.properties) {
//         if (count === 1) headers += '<th>' + prop + '</th>';
//         rows += '<td>' + lyr.feature.properties[prop] + '</td>';
//       }

//       headers += '</tr>';
//       rows += '</tr>';
//       count++;
//     });

//     content += headers + rows;
//     content += '</table>';

//     var $table = $('<div>')
//       .addClass('dropchop-attr-table')
//       .html(content);

//     var $actionContainer = $('<div>').addClass('attr-action-container');
    
//     var $actionClose = $('<button>')
//       .addClass('attr-action attr-action-close')
//       .html('<i class="fa fa-times"></i> Close')
//       .on('click', dc.attr.close);

//     var $actionRemove = $('<button>')
//       .addClass('attr-action attr-action-remove')
//       .html('<i class="fa fa-trash"></i> Remove Selection');
    
//     $actionContainer.append($actionRemove);
//     $actionContainer.append($actionClose);

//     $table.append($actionContainer);

//     dc.attr.$elem = $table;
//     dc.$elem.append($table);

//     $('#dropchop-attr-table').stupidtable();

//     $('.attr-row').on('click', attrRowClick);
//   };

//   function attrRowClick(event) {
//     var lyrId = $(this).attr('data-layer-id');

//     // update classnames & selection
//     if ($(this).hasClass('attr-row-selected')) {
//       $(this).removeClass('attr-row-selected');
      
//       // remove from selection
//       dc.attr.selectionRemove(lyrId);
//     } else {
//       $(this).addClass('attr-row-selected');

//       // add to selection
//       dc.attr.selectionAdd(lyrId);

//       // update style

//       // update options

//     }
//   }

//   dc.attr.selectionAdd = function(id) {
//     dc.attr.selection.push(id);
//   };

//   dc.attr.selectionRemove = function(id) {
//     var index = null;
//     $(dc.selection.list).each(function(i) {
//       if (dc.attr.selection[i] === id) {
//         index = i;
//       }
//     });
//     dc.attr.selection.splice(index, 1);
//   };

//   dc.attr.close = function() {
//     dc.attr.$elem.remove();
//   };

//   function removeLayer(id) {
//     mylayergroup.eachLayer(function (layer) {
//       if (layer._leaflet_id === id){
//         mylayergroup.removeLayer(layer)
//       }
//     }); 
//   }
    

//   return dc;

// })(dropchop || {});