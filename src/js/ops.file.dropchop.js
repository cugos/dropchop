var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.ops = dc.ops || {};

  dc.ops.file = {
    upload: {
      description: 'Upload from your computer (.shp, .geojson)',
      icon: '<i class="fa fa-upload"></i>',
      execute: function() {
        // inspired from geojson.io
        // https://github.com/mapbox/geojson.io/blob/gh-pages/src/ui/file_bar.js#L390
        var $blindInput = $('<input>')
          .attr('type', 'file')
          .attr('multiple', 'true')
          .css('visibility', 'hidden')
          .css('position', 'absolute')
          .css('height', '0')
          .on('change', function() {
            var files = this.files;
            $(files).each(function(i) {
              // var ext = dc.util.getFileExtension(files[i].name);
              
              // // if it is a shapefile or zip file
              // if (ext === 'shp' || ext === 'zip') {
              //   // upload a shapefile and add the layer
              //   dc.util.readShpFile
              //   shp("files/pandr").then(function(geojson){
              //     //do something with your geojson 
              //   });
              // } else {
                dc.util.readFile(files[i]);
              // }

            });
            $blindInput.remove();
          });
        $('body').append($blindInput);
        $blindInput.click();
      }
    },

    'load-url': {
      description: 'Import file from a URL',
      icon: '<i class="fa fa-link"></i>',
      parameters: [
        {
          name: 'url',
          description :'URL',
          type: 'text',
          default: 'http://',
        },
      ],
      execute: function() {
        $(dc.form).trigger('form:file', ['load-url']);
      },
      get: function(event, name, parameters) {
        var url = parameters[0];
        dc.util.xhr(url, dc.ops.file[name].callback);
      },
      callback: function(xhr, xhrEvent) {
        dropchop.util.loader(false);
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          // get filename based on the end of the url - not sure if this is sustainable
          var name = xhr.responseURL.substring(xhr.responseURL.lastIndexOf('/')+1);
          $(dc.layers).trigger('file:added', [name, data]);
        } else {
          dc.notify('error', xhr.status + ': could not retrieve Gist. Please check your URL');
        }
      }
    },

    'load-gist': {
      description: 'Import files from Gist',
      icon: '<i class="fa fa-github"></i>',
      parameters: [
        {
          name: 'gist',
          description :'Gist ID or URL',
          type: 'text',
          default: 'https://gist.github.com/'
        },
      ],
      execute: function() {
        $(dc.form).trigger('form:file', ['load-gist']);
      },
      get: function(event, name, parameters) {
        var gist = parameters[0].split('/')[parameters[0].split('/').length-1];
        var url = 'https://api.github.com/gists/' + gist;
        dc.util.xhr(url, dc.ops.file[name].callback);
      },
      callback: function(xhr, xhrEvent) {
        dropchop.util.loader(false);
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          for (var f in data.files) {
            var name = data.files[f].filename;
            $(dc.layers).trigger('file:added', [name, JSON.parse(data.files[f].content)]);
          }
          // dc.notify('success', 'Succesfully retrieved gist')
        } else {
          dc.notify('error', xhr.status + ': could not retrieve Gist. Please check your URL');
        }
      }
    },

    'load-overpass': {
      description: 'Query the Overpass API',
      icon: '<i class="fa fa-terminal"></i>',
      _temp: {},
      parameters: [
        {
          name: 'query',
          description :'Learn more about <a href="http://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide" target="_blank">the query language</a>.',
          type: 'text',
          default: 'amenity=bar'
        },
        {
          name: 'layer name',
          description :'Name of the layer added if results are found.',
          type: 'text',
          default: 'overpass_layer_name'
        }
      ],
      execute: function() {
        $(dc.form).trigger('form:file', ['load-overpass']);
      },
      get: function(event, name, parameters) {
        // set layer name to _temp for later usage
        dc.ops.file['load-overpass']._temp.layerName = parameters[1]; // this is ugly

        // build the query with bounding box
        var bbox = dc.util.getBBox();
        dc.util.xhr('http://overpass-api.de/api/interpreter?[out:json];node['+parameters[0]+']('+bbox+');out;', dc.ops.file['load-overpass'].callback);
      },
      callback: function(xhr, xhrEvent) {
        dropchop.util.loader(false);
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var geojson = osmtogeojson(data);
          if (!data.elements.length) {
            dc.notify('info', 'No elements found in your query.');
          } else {
            $(dc.layers).trigger('file:added', [dc.ops.file['load-overpass']._temp.layerName, geojson]);
            dc.notify('success', 'Found <strong>' + data.elements.length + ' elements</strong> from the Overpass API');
          }
        } else {
          dc.notify('error', xhr.status + ': could not query the Overpass API');
        }
      }
    },

    'break1': { type: 'break' },

    'save-geojson': {
      minFeatures: 1,
      description: 'Save as GeoJSON',
      icon: '<i class="fa fa-file-code-o"></i>',
      createsLayer: false,
      execute: function() {
        for(var i = 0; i < dc.selection.list.length; i++) {
          (function(file) {
            var content = JSON.stringify(dc.selection.list[file].raw);
            var title = 'dropchop_' + dc.selection.list[file].name + '.geojson';
            saveAs(new Blob([content], {
              type: 'text/plain;charset=utf-8'
            }), title);
          })(i);
        }
        $(dc.selection.list).each(function(i) {
          console.log(this);
          

        });
      }
    },

    'save-shapefile': {
      minFeatures: 1,
      description: 'Save as Shapefile',
      icon: '<i class="fa fa-file"></i>',
      execute: function() {
        $(dc.selection.list).each(function(i) {
          try {
            var options = {
              folder: 'dropchop_' + dc.selection.list[i].name,
              types: {
                point: 'dropchop_' + dc.selection.list[i].name + '_point',
                polygon: 'dropchop_' + dc.selection.list[i].name + '_poly',
                line: 'dropchop_' + dc.selection.list[i].name + '_line'
              }
            };
            shpwrite.download(dc.selection.list[i].raw, options);
          } catch (err) {
            dc.notify('Error', 'There was a problem downloading the shapefile.' + err);
            throw err;
          }
        });
      },
      createsLayer: false
    },

    'break2': { type: 'break' },

    extent: {
      minFeatures: 1,
      description: 'View extent of layers',
      icon: '<i class="fa fa-globe"></i>',
      execute: function() {
        if(!dc.selection.list.length) {
          // extent of entire layer list if nothing selected
          dc.map.m.fitBounds(dc.map.layergroup.getBounds());  
        } else {
          // otherwise build the bounds based on selected layers
          var bounds;
          $(dc.selection.list).each(function(l) {
            var fl = dc.selection.list[l].featurelayer;
            if(!l) bounds = fl.getBounds();
            else bounds.extend(fl.getBounds());
          });
          dc.map.m.fitBounds(bounds);
        }
        
      }
    },

    expand: {
      minFeatures: 1,
      description: 'Convert FeatureCollection into separate features',
      icon: '<i class="fa fa-expand"></i>',
      execute: function() {
        var count = 0;
        if (dc.selection.list.length === 1) {
          var fc = dc.selection.list[0];
          if (fc.raw.type === 'FeatureCollection') {
            $(fc.raw.features).each(function(f) {
              count++;
              $(dc.layers).trigger('file:added', [fc.name + count + '_' + fc.raw.features[f].geometry.type, fc.raw.features[f]]);
            });
          } else {
            var err = new Error('That needs to be a feature collection!');
            dc.notify('error', 'Layer is not a FeatureCollection.');
            throw err;
          }
        } else {
          dc.notify('info', 'Please select a single layer!');
        }
      }
    },

    combine: {
      minFeatures: 1,
      description: 'Combines selected features into a single FeatureCollection',
      icon: '<i class="fa fa-compress"></i>',
      execute: function() {
        var fc = {
          type: 'FeatureCollection',
          features: []
        };
        if (dc.selection.list.length > 0) {
          $(dc.selection.list).each(function(f) {
            if (dc.selection.list[f].raw.type !== 'FeatureCollection') {
              fc.features.push(dc.selection.list[f].raw);
            } else {
              dc.notify('info', dc.selection.list[f].name + ' was not added because it is already a FeatureCollection');
            }
          });
          $(dc.layers).trigger('file:added', ['new_FeatureCollection', fc]);
        } else {
          dc.notify('info', 'No layers selected!');
        }
      }
    },

    // 'view-attributes': {
    //   minFeatures: 1,
    //   description: 'Show attribute table',
    //   icon: '<i class="fa fa-th-list"></i>',
    //   execute: function() {
    //     dc.attr.render(dc.selection.list[0]);
    //   }
    // },

    'break3': { type: 'break' },

    rename: {
      minFeatures: 1,
      description: 'Rename layer',
      icon: '<i class="fa fa-pencil"></i>',
      parameters: [
        {
          name: 'Name',
          type: 'text',
          description: ''
        }
      ],
      execute: function() {
        if (dc.selection.list.length === 1) {
          $(dc.form).trigger('form:file', ['rename']);  
        } else {
          dc.notify('info', 'Please select <strong>one layer</strong>.');
        }
      },
      callback: function(event, name, parameters) {
        console.log(name, parameters);
        $(dc.layers).trigger('layer:rename', [dc.selection.list[0], parameters[0]]);
      }
    },

    remove: {
      minFeatures: 1,
      description: 'Remove selected layers',
      icon: '<i class="fa fa-trash-o"></i>',
      execute: function() {
        $(dc.selection.list).each(function(i) {
          $(dc.layers).trigger('layer:removed', [dc.selection.list[i].stamp]);
        });
        dc.selection.clear();
      }
    },

    info: {
      type: 'info',
      description: 'Learn more about dropchop',
      icon: '<i class="fa fa-info"></i>',
      execute: function() {
        window.location = '/about.html';
      }
    }
  };

  return dc;

})(dropchop || {});