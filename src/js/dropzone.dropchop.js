var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};

  /**
   * Create the dropzone.
   * @param {object} container element (lets do document.body)
   */
  dc.dropzone = function($container) {
    _events($container);
  };

  function _events($container) {
    $container.on('dragover', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).addClass('dragging');
    });

    $container.on('dragleave', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).removeClass('dragging');
    });

    $container.on('drop', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).removeClass('dragging');
      var files = event.originalEvent.dataTransfer.files;
      $(files).each(function(i) {
        dc.util.readFile(files[i]);
      });
    });
  }

  return dc;

})(dropchop || {});