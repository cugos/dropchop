var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.menus = dc.menus || {};
  dc.menus.left = dc.menus.left || {};

  dc.menus.left.init = function() {
    // build ops.geo container
    var geoContainer = $('<div>').addClass('operations-geo');
    dc.$elem.append(geoContainer);

    // wire up signal handlers
    $(dc).on('operation:file:load-gist', dc.ops.file['load-gist'].get);
    $(dc).on('operation:file:load-url', dc.ops.file['load-url'].get);
    $(dc).on('operation:file:load-overpass', dc.ops.file['load-overpass'].get);
    $(dc).on('operation:file:rename', dc.ops.file.rename.callback);

    // setup ops file
    var leftMenu = $('<div>').addClass('dropchop-menu-left');
    var menuItems = dc.menus.left._getMenuOperations();
    for (var opName in menuItems) {
      var fileOp = menuItems[opName];
      if (fileOp.type === 'break') {
        var $breakSpace = $('<div>').addClass('menu-action-break');
        leftMenu.append($breakSpace);
      } else {
        var fileBtn = $('<button>').addClass('menu-action')
          .html(fileOp.icon || 'A')
          .attr('data-operation', opName)
          .attr('data-tooltip', fileOp.description);
          if (fileOp.type === 'info') fileBtn.addClass('dropchop-info');
        fileBtn.on('click', _handleBtnClick);
        leftMenu.append(fileBtn);
      }
    }
    dc.$elem.append(leftMenu);
  };

  dc.menus.left._getMenuOperations = function() {
    return {
      /* jshint ignore:start */
      'upload': dc.ops.file['upload'],
      'load-url': dc.ops.file['load-url'],
      'load-gist': dc.ops.file['load-gist'],
      'load-overpass': dc.ops.file['load-overpass'],
      'location': dc.ops.file['location'],
      'break1': {type: 'break'},
      'save-geojson': dc.ops.file['save-geojson'],
      'save-shapefile': dc.ops.file['save-shapefile'],
      'break2': {type: 'break'},

      // TODO: DUPLICATE IN CONTEXT-MENU
      'extent': dc.ops.file['extent'],

      // TODO: MOVE TO CONTEXT-MENU
      'expand': dc.ops.file['expand'],

      // TODO: When layer-context-menu supports multiple layers, mv to
      // context menu
      'combine': dc.ops.file['combine'],
      'break3': {type: 'break'},

      // TODO: MOVE TO CONTEXT-MENU
      'rename': dc.ops.file['rename'],
      'remove': dc.ops.file['remove'],
      'info': dc.ops.file['info'],
      /* jshint ignore:end */
    }
  };

  /* jshint ignore:start */
  /* ignoring these functions in jshint because we are getting
  an unecessary strict violation warning, but our usage of `this`
  is proper here. */
  function _handleBtnClick(event) {
    event.preventDefault();
    var operation = $(this).attr('data-operation');
    try {
      dc.ops.file[operation].execute();
    } catch (err) {
      dc.notify('error', 'This operation doesn\'t exist!');
      throw err;
    }
  };
  /* jshint ignore:end */

  return dc;

})(dropchop || {});