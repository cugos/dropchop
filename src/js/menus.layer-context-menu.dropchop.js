var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.menus = dc.menus || {};
  dc.menus.layerContextMenu = dc.menus.layerContextMenu || {};

  dc.menus.layerContextMenu.init = function() {
    // build ops.geo container
    var geoContainer = $('<div>').addClass('operations-geo');
    dc.$elem.append(geoContainer);

    // Remove open menus
    $('html').bind('click', function (e) {
      dc.menus.layerContextMenu.removeLayerContextMenus();
    });
  };

  dc.menus.layerContextMenu.createLayerContextMenu = function(e) {
    dc.menus.layerContextMenu.removeLayerContextMenus();

    // Select right-clicked layer.
    var layerName = $(e.target)
    var layer = layerName.parent();
    var lyrData = dc.layers.list[layer.attr('data-stamp')];

    // Select layer if unselected
    if (!Boolean(dropchop.selection.list.indexOf(lyrData) + 1)) {
      layerName.trigger('click');
    }

    // create left-click context-menu
    var menu = $('<div>').addClass('context-menu');
    menu.css({top: e.pageY, left: e.offsetX});
    var menuList = $('<ul>');
    menu.append(menuList);

    // populate context-menu
    var menuItems = dc.menus.layerContextMenu._getMenuOperations();
    for (var menuItem in menuItems) {
      var fileBtn = $('<li>').addClass('menu-action')
        .html(menuItems[menuItem].icon + menuItems[menuItem].description)
        .attr('data-operation', menuItem)
        .attr('data-tooltip', menuItems[menuItem].description);
        // .text(menuItems[menuItem].description);
        if (menuItems[menuItem].type === 'info') fileBtn.addClass('dropchop-info');
      fileBtn.on('click', _handleBtnClick);
      menuList.append(fileBtn);
    }
    layer.parent().append(menu);

    e.preventDefault();
  }

  // Remove any open context-menus from DOM
  dc.menus.layerContextMenu.removeLayerContextMenus = function() {
    $('.context-menu').remove();
  };

  dc.menus.layerContextMenu._getMenuOperations = function() {
    return {
      /* jshint ignore:start */
      'extent': dc.ops.file['extent'],
      'expand': dc.ops.file['expand'],
      'combine': dc.ops.file['combine'],
      'rename': dc.ops.file['rename'],
      'remove': dc.ops.file['remove'],
      /* jshint ignore:end */
    };
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