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
    var query = location.search.substr(1)
      .split(/(&?gist=|&?url=)/g)
      .filter(function(d) {
        return d.length > 0;
      });

    var result = {}

    query.forEach(function(part, i) {
      if (i === 0 || i % 2 === 0) {
        var key = part.replace(/&|=/g, '');

        if (!result[key]) {
          result[key] = []
        }

        result[key].push(decodeURIComponent(query[i + 1]));
      }
    });

    return result;
  };

  dc.util.updateSearch = function() {
    var layers = [];

    Object.keys(dc.layers.list).forEach(function(layer) {
        /*
        ** If a layer has a type and URL (a gist or external GeoJSON link),
        ** and we haven't recored this type-url combo already, add it to the
        ** unique list. The last check is needed to account for gists with
        ** multiple layers.
        */
        if (dc.layers.list[layer].ltype && dc.layers.list[layer].url && layers.indexOf(dc.layers.list[layer].ltype + '=' + dc.layers.list[layer].url) < 0) {
            layers.push(dc.layers.list[layer].ltype + '=' + dc.layers.list[layer].url);
        }
    });

    var search = layers.length ?  ('?' + layers.join('&')) : '/';

    // Only update the URI if anything has changed
    if (search !== window.location.search) {
      window.history.pushState(null, null, search);
    }

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

  dc.util.uncollect = function(fc) {
    return fc.features[0];
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

  dc.util.welcome = function() {
    var welcome = '\nWelcome to Dropchop!\n';
        welcome += 'Once you drop, the chop don\'t stop.\n\n';
        welcome += 'This project is brought to you by the great people of CUGOS, the Cascadian chapter of OSGeo. If you are ever in Seattle, hit us up\nhello@cugos.org\n\n';
        welcome += 'You can learn more about this project at dropchop.io/about.'
    console.log(welcome);
  };

  return dc;


})(dropchop || {});
