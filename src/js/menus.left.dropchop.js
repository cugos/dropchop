var dropchop = (function(dc) {

  'use strict';

  dc = dc || {};
  dc.menus = dc.menus || {};
  dc.menus.left = dc.menus.left || {};

  dc.menus.left.init = function() {
    // wire up signal handlers
    $(dc).on('operation:file:load-gist', dc.ops.file['load-gist'].get);
    $(dc).on('operation:file:load-url', dc.ops.file['load-url'].get);
    $(dc).on('operation:file:load-overpass', dc.ops.file['load-overpass'].get);
    $(dc).on('operation:file:load-arcgis', dc.ops.file['load-arcgis'].get);
    $(dc).on('operation:file:load-custom-base', dc.ops.file['load-custom-base'].get);
    $(dc).on('operation:file:rename', dc.ops.file.rename.callback);

    dc.menus.left.setup = [
      {
        name: 'import',
        icon: '<i class="fa fa-plus"></i>',
        actions: [
          'upload',
          'load-url',
          'load-gist',
          'load-overpass',
          'load-arcgis',
          'load-custom-base',
          'location'
        ]
      },
      {
        name: 'Save',
        icon: '<i class="fa fa-floppy-o"></i>',
        actions: [
          'save-geojson',
          'save-topojson',
          'save-shapefile'
        ]
      },
      'info'
    ];

    // setup ops file
    var leftMenu = $('<div>').addClass('dropchop-menu-left');
    var setup = dc.menus.left.setup;

    for (var i = 0; i < setup.length; i++) {
      var action = setup[i];
      if (typeof setup[i] !== 'object') {
        if(dc.ops.file[action].type === 'break') {
          var $breakSpace = $('<div>').addClass('menu-action-break');
          leftMenu.append($breakSpace);
        } else {
          leftMenu.append(buildMenuButton(action));
        }

      } else {
        // build a collapseable menu "button"
        var collapseBtn = $('<div>')
          .addClass('menu-action menu-collapse')
          .html(setup[i].icon);
        if (setup[i].name === 'import') collapseBtn.addClass('menu-import');

        var collapseInner = $('<div>')
          .addClass('menu-collapse-inner');

        // loop through each action and build a button for it, just like above,
        // but append it to the menu-collapse-inner element
        for (var a = 0; a < setup[i].actions.length; a++) {
          var actn = setup[i].actions[a];
          collapseInner.append(buildMenuButton(actn));
        }
        collapseBtn.append(collapseInner);

        // append the entire collapseBtn to the leftMenu
        leftMenu.append(collapseBtn);
      }
    }
    dc.$elem.append(leftMenu);

    function buildMenuButton(action) {
      var button = $('<button>').addClass('menu-action')
        .html(dc.ops.file[action].icon || '!')
        .attr('data-operation', action)
        .attr('data-tooltip', dc.ops.file[action].description);
        if (dc.ops.file[action].type === 'info') button.addClass('dropchop-info');
      button.on('click', _handleBtnClick);
      return button;
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
