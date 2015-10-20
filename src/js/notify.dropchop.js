var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.notify = function(type, text, time) {
    var note = $('<div>').addClass('notification')
      .addClass(type)
      .html(text);

    // `time` can equal 'close' in order to create a close button
    if (time === 'close') {

      var $close = $('<button>').addClass('notification-close')
        .prop('type', 'button')
        .html('<i class="fa fa-times"></i>');

      $close.on('click', function(event) {
        $(this).parent().remove();
      });

      $(note).append($close);
      $(dc.$elem).append(note);

    } else {

      $(dc.$elem).append(note);

      setTimeout(function() {
        note.remove();
      }, time || 3000);

    }

    

  };

  return dc;

})(dropchop || {});