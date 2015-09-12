var dropchop = (function(dc) {
  
  'use strict';

  dc = dc || {};
  dc.ops = dc.ops || {};

  dc.ops.file = {
    'save-geojson': {
      minFeatures: 1,
      description: 'Save as GeoJSON',
      icon: '<i class="fa fa-file-code-o"></i>',
      parameters: [
        {
          name: 'filename',
          description :'Filename prefix to write',
          default: 'dnc'
        }
      ],
      createsLayer: false,
      execute: function() {
        $(dc.selection.list).each(function(i) {
          var content = JSON.stringify(dc.selection.list[i].raw);
          var title = 'dropchop_' + dc.selection.list[i].name + '.geojson';
          saveAs(new Blob([content], {
            type: 'text/plain;charset=utf-8'
          }), title);

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

    remove: {
        minFeatures: 1,
        description: 'Remove selected layers',
        icon: '<i class="fa fa-trash-o"></i>',
        disableForm: true,
    },
    upload: {
        description: 'Upload from your computer',
        icon: '<i class="fa fa-upload"></i>',
        parameters: [
            {
                description: 'File to upload.',
                type: 'file',
                extra: 'multiple',
            }
        ]
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
    },

    'load-gist': {
        description: 'Import files from Gist',
        icon: '<i class="fa fa-github"></i>',
        parameters: [
            {
                name: 'gist',
                description :'Gist ID or URL',
                type: 'text',
            },
        ],
    }
  };

  return dc;

})(dropchop || {});