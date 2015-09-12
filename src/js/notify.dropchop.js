var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.notify = function(type, text, time) {
    var note = $('<div>').addClass('notification')
      .addClass(type)
      .html(text);

    $(dc.$elem).append(note);

    setTimeout(function() {
      note.remove();
    }, time || 3000);
  };

  return dc;

})(dropchop || {});