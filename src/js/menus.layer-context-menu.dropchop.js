var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.menus = dc.menus || {};
  dc.menus.layerContextMenu = dc.menus.layerContextMenu || {};

  dc.menus.layerContextMenu.init = function() {
    // Remove open menus
    $('html').bind('click', function (e) {
      dc.menus.layerContextMenu.removeLayerContextMenus();
    });
  };

  // Generate layer context menu dom element (bound to right-click on layerlist)
  dc.menus.layerContextMenu.createLayerContextMenu = function($layerNameDiv, xPos, yPos) {
    if (!($layerNameDiv instanceof jQuery)) {
      $layerNameDiv = $($layerNameDiv);
    }

    // Close any already-open contextmenus
    dc.menus.layerContextMenu.removeLayerContextMenus();

    // Select right-clicked layer.
    var layer = $layerNameDiv.parent();
    var lyrData = dc.layers.list[layer.attr('data-stamp')];

    // Select layer if unselected
    if (!Boolean(dropchop.selection.list.indexOf(lyrData) + 1)) {
      $layerNameDiv.trigger('click');
    }

    // create left-click context-menu
    var menu = $('<div>').addClass('context-menu');
    
    var menuList = $('<ul>');
    menu.append(menuList);

    // populate context-menu
    var menuItems = {
      /* jshint ignore:start */
      'title1': 'Layer',
      'rename': dc.ops.file['rename'],
      'duplicate': dc.ops.file['duplicate'],
      'remove': dc.ops.file['remove'],
      'title2': 'Geo',
      'extent': dc.ops.file['extent'],
      'expand': dc.ops.file['expand'],
      'combine': dc.ops.file['combine'],
      /* jshint ignore:end */
    };

    for (var menuItem in menuItems) {
      var item = menuItems[menuItem];
      if (typeof item === 'string' || item instanceof String) {
        menuList.append($('<li class="title"><h4>' + item + '</h4></li>'));
        continue;
      }
      var fileBtn = $('<li>').addClass('menu-action')
        .html('<div class="icon">' + item.icon + '</div><div class="description">' + item.description + '</div>')
        .attr('data-operation', menuItem)
        .attr('data-tooltip', item.description);

      // disable invalid operations
      if (
        (item.minFeatures > dropchop.selection.list.length) ||
        (item.maxFeatures < dropchop.selection.list.length)
      ) {
        fileBtn.addClass('operation-inactive');
      }
      fileBtn.on('click', _handleBtnClick);
      menuList.append(fileBtn);
    }


    // make sure to set visibility:hidden
    menu.addClass('hidden');

    // append to DOM
    layer.parent().append(menu);

    // calculate the height, set position
    var position = _calculateMenuLocation();
    menu.css(position);

    // remove visibility:hidden
    menu.removeClass('hidden');

    function _calculateMenuLocation() {
      // buffer from the edge of the window (in pixels)
      var buffer = 10;

      // first get the window height
      var windowHeight = $(window).height();

      // then get the menu height
      var menuHeight = menu.height();

      // check to make sure from the top of window to the bottom of menu
      // is larger than the window height
      if ( yPos + menuHeight < windowHeight ) {
        // return normally
        return {top: yPos, left: xPos};
      } else {
        // if it isn't, figure out by how much, and return
        // y position with safe context space and buffer from the window
        var difference = (yPos + menuHeight) - windowHeight;
        return {top: (yPos - difference - buffer), left: xPos};
      }

    }

  };

  // Remove any open context-menus from DOM
  dc.menus.layerContextMenu.removeLayerContextMenus = function() {
    $('.context-menu').remove();
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