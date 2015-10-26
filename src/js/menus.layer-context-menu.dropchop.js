var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.menus = dc.menus || {};
  dc.menus.layerContextMenu = dc.menus.layerContextMenu || {};

  dc.menus.layerContextMenu.init = function() {
    // build ops.geo container
    var geoContainer = $('<div>').addClass('operations-geo');
    dc.$elem.append(geoContainer);

    // Bind the context-menu handler on any item added to layerlist
    $(dc).on('layerlist:added', function(e, layer){
      $(layer).bind("contextmenu", function(e) {
        // Clear other open menus
        dc.menus.layerContextMenu.removeLayerContextMenus();

        // Select right-clicked layer.
        // TODO: In future, support context-menu on many layers
        $(e.target).trigger('click');

        // create left-click menu
        var menu = $('<div>').addClass('context-menu');
        menu.css({top: e.pageY, left: e.offsetX});
        var menuList = $('<ul>');
        menu.append(menuList);

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
        $(this).parent().append(menu);

        e.preventDefault();
      });
    });

    // Remove open menus
    $('html').bind('click', function (e) {
      dc.menus.layerContextMenu.removeLayerContextMenus();
    });
  };

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
    console.log(operation);
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