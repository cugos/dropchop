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
    console.log(string);
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
    dropchop.util.loader(true);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = callback.bind(this, xhr);
    xhr.onerror = function( xhr ) {
      dropchop.util.loader(false);
      console.error(xhr);
      dc.notify('error', 'Unable to access ' + url, 2500);
    };
    xhr.send();
  };

  dc.util.get = function(url, data, cors) {
      var params = {
          data: data,
          dataType: 'json'
      };
      if(!dc.util.corsSupport || cors === false) {
          console.log('No CORS support, using JSONP');
          params.dataType = 'jsonp';
      }
      dropchop.util.loader(true);
      var xhr = $.ajax(url, params);
      return xhr;
  };

  dc.util.readFile = function(file) {
    var reader = new FileReader();
    // if a zipfile, assume shapefile for now
    if (file.name.indexOf('.zip') > -1 || file.name.indexOf('.shp') > -1) {
      reader.readAsArrayBuffer(file);
      dc.util.loader(true);
      reader.onloadend = function(event) {
        shp(reader.result).then(function(geojson) {
          dc.util.loader(false);
          $(dc).trigger('file:added', [geojson.fileName, geojson]);
        });
      };
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = function() {
        $(dc).trigger('file:added', [file.name, JSON.parse(reader.result)]);
      };
    }

    function forwardToGeoJsonIo(data) {
      console.log(data);
      var url = "http://geojson.io/#data=data:application/json," + encodeURIComponent(JSON.stringify(data));
      window.location = url;
    }
  };

  dc.util.jsonFromUrl = function() {
    var query = location.search.substr(1);
    var result = {};










    query.split("&").forEach(function(part) {
      var item = part.split("=");
      if (!result[item[0]]) {
        result[item[0]] = [];
      }
      result[item[0]].push(decodeURIComponent(item[1]));
    });
    return result;
  };

  dc.util.executeUrlParams = function() {
    var data = dc.util.jsonFromUrl();

    // load gist
    if (data.gist && data.gist.length) {
      $(data.gist).each(function(i) {
        dc.ops.file['load-gist'].get({}, 'load-gist', [data.gist[i]]);
      });
    }

    // load
    if (data.url && data.url.length) {
      $(data.url).each(function(i) {
        dc.ops.file['load-url'].get({}, 'load-url', [data.url[i]]);
      });
    }
  };

  dc.util.getFileExtension = function(filename) {
    return filename.substr(filename.lastIndexOf('.')+1);
  };

  dc.util.getBBox = function() {
    var bounds = dc.map.m.getBounds(),
            sw = bounds.getSouthWest(),
            ne = bounds.getNorthEast();
    // we should probably check the size here?
    // node(57.7,11.9,57.8,12.0)
    return sw.lat+','+sw.lng+','+ne.lat+','+ne.lng;
  };

  dc.util.getEsriBBox = function() {
      var bounds = dc.map.m.getBounds(),
          sw = bounds.getSouthWest(),
          ne = bounds.getNorthEast();
      return sw.lng+','+sw.lat+','+ne.lng+','+ne.lat;
  };

  dc.util.uncollect = function(fc) {
    return fc.features[0];
  };

  dc.util.esri2geo = function(arcjson) {
    return toGeoJSON(arcjson);
  };

  dc.util.executeFC = function(fc, operation, params) {

    var newParams = params;
    var newFC = {};
    newFC.type = 'FeatureCollection';
    newFC.features = [];

    for (var f = 0; f < fc.features.length; f++) {
      newParams[0] = fc.features[f];
      var feature;
      try {
        feature = turf[operation].apply(null, newParams);
        feature.properties = fc.features[f].properties || {};
      } catch (err) {
        dc.notify('error', err);
      }
      newFC.features.push(feature);
    }

    return newFC;

  };

  dc.util.loader = function(yes) {
    var loader = $('<div>').addClass('dropchop-loader');

    if (yes) {
      $('body').addClass('dropchop-loading');
      $('body').append(loader);
    } else {
      $('body').removeClass('dropchop-loading');
      $('.dropchop-loader').addClass('loader-complete').fadeOut(2000, function(){
        $(this).remove();
      });
    }
  };

  dc.util.corsSupport = function() {
      return 'XMLHttprequest' in window && 'withCredentials' in new window.XMLHttpRequest();
  };

  dc.util.welcome = function() {
    var welcome = '\nWelcome to Dropchop!\n';
        welcome += 'Once you drop, the chop don\'t stop.\n\n';
        welcome += 'This project is brought to you by the great people of CUGOS, the Cascadian chapter of OSGeo. If you are ever in Seattle, hit us up\nhello@cugos.org\n\n';
        welcome += 'You can learn more about this project at dropchop.io/about.'
    console.log(welcome);
  };

  return dc;


})(dropchop || {});
