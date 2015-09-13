var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  
  dc.util = {};
  
  dc.util.removeFileExtension = function(string) {
    string = string.replace(/\.[^/.]+$/, "");
    return string;
  };

  dc.util.removeWhiteSpace = function(string) {
    string = string.replace(/^\s+|\s+$/g, '');
    return string;
  };

  dc.util.concat = function(array, separator, prefix) {
    var string = '';
    $(array).each(function(a) {
      string += separator + array[a];
    });
    string = prefix + string;
    return string;
  };

  dc.util.xhr = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url));
    xhr.onload = callback.bind(this, xhr);
    xhr.onerror = function( xhr ) {
        console.error(xhr);
        dc.notify('error', 'Unable to access ' + url, 2500);
    };
    xhr.send();
  };

  return dc;


})(dropchop || {});