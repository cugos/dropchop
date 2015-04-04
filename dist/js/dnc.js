;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var map = require( './map' );

var DNC = {
    version: '0.0.1-dev' ,
    map : map 
};

if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = DNC;
}

if (typeof window !== 'undefined') {
    window.DNC = DNC;
}


},{"./map":4}],2:[function(require,module,exports){
'use strict';

var DropZone = function( options ) {
    this.options = options || {};
    if ( !( this instanceof DropZone ) ) {
        return new DropZone();
    }

    document.addEventListener( 'register-dnc-event-handlers' , function(e) {
        console.info( "[ REGISTER ]: dropzone" );
        this.addEventHandlers();
    }.bind(this));
    
}; 

DropZone.prototype = {

    readFile: function(fileObject) {
      var reader = new FileReader();
      reader.readAsText(fileObject, 'UTF-8');
      reader.onload = function() {
        var file = JSON.parse(reader.result);

        /*
        **  TODO: this tight coupling feels bad
        **  we should be able to resolve this with
        **  an observer pattern where the map responds
        **  to the dropzone throwing an 'file-added' event 
        */
        DNC.map.addLayer(fileObject, file, DNC.map.numLayers);
        DNC.map.numLayers++;
      };
    } ,

    handleFiles : function (files) {
      for (var i = 0; i < files.length; i++) {
        this.readFile(files[i]);
      }
    } ,

    addEventHandlers : function() {
        if (typeof window !== 'undefined') {

            window.addEventListener('dragover', function(e) {
                e = e || event;
                e.preventDefault();
                document.body.className = "dragging";
            }, false);

            window.addEventListener('dragleave', function(e) {
                e = e || event;
                e.preventDefault();
                document.body.className = "";
            }, false);

            window.addEventListener('drop', function(e) {
                e = e || event;
                e.preventDefault();
                document.body.className = "";
                var files = e.dataTransfer.files;
                this.handleFiles(files);
            }.bind(this), false);

        }
    } ,
};


// NOTE: we are returning a class, not an instance
module.exports = DropZone;

},{}],3:[function(require,module,exports){
'use strict';

var Menu = function( options ) {
    this.options = options || {};
    if ( !( this instanceof Menu ) ) {
        return new Menu();
    }

    document.addEventListener( 'register-dnc-event-handlers' , function(e) {
        console.info( "[ REGISTER ]: geoprocessing menu" );
        this.addEventHandlers();
    }.bind(this));
    
}; 

Menu.prototype = {

    addEventHandlers : function() {
        /*
        **
        **  handlers for menu options
        **
        */
        var menu = document.getElementsByClassName('menu-expand');
        for (var m = 0; m < menu.length; m++) {
            menu[m].addEventListener('click', menuClick, false);
        }

        function menuClick() {
            var menuExpand = this.nextSibling.nextSibling;
            if (menuExpand.className.indexOf('expanded') == -1) {
              menuExpand.className += ' expanded';
            } else {
              menuExpand.className = 'menu';
            }      
        }


        /*
        **
        **  TODO: these 'operation' listeners 
        **  should probably not be here.
        **  it would be nice if we could have
        **  each operation we want to add register
        **  itself as a plugin with it's own HTML for
        **  the menu item and functions to bind/unbind
        **  event listeners
        **
        **  TODO: also the tight coupling to map.selection
        **  needs to be factored out
        **
        **  handlers for menu geoprocessing opertations
        */
        var buffer = document.getElementById('buffer');
        buffer.addEventListener('click', function(){
            this.ops.execute(
                this.ops.geom.buffer( DNC.map.selection.list[0].layer._geojson, DNC.map.selection.list[0].info )
            );
        }.bind(this)); 

        var union = document.getElementById('union');
        union.addEventListener('click', function(){
            this.ops.execute(
                this.ops.geom.union( DNC.map.selection.list[0].layer._geojson, DNC.map.selection.list[1].layer._geojson, DNC.map.selection.list[0].info, DNC.map.selection.list[1].info )
            );
        }.bind(this)); 

        var erase = document.getElementById('erase');
        erase.addEventListener('click', function(){
            this.ops.execute(
                this.ops.geom.erase( DNC.map.selection.list[0].layer._geojson, DNC.map.selection.list[1].layer._geojson, DNC.map.selection.list[0].info, DNC.map.selection.list[1].info)
            );
        }.bind(this)); 
    } ,

    /*
    **  TODO: flatten opts into separate functions
    **  to make it more testable and think about the
    **  idea plugin idea mentioned in above TODO(s)
    ** 
    */
    ops :  {
      // main execution for operations
      execute: function(newLayer) {
        // TODO: another tight coupling between map
        DNC.map.addLayer(newLayer, newLayer.geometry, DNC.map.numLayers);
      },

      // all geometry processes
      geom: {
        buffer: function(object, info) {
          console.log(object, info);
          var newLayer = {
            geometry: turf.buffer(object, 0.1),
            name: 'buffer_' + info.name
          };

          return newLayer;
        },

        // var union = turf.union(poly1, poly2);
        union: function(object1, object2, info1, info2) {

          var poly1 = object1,
              poly2 = object2,
              info1Strip = info1.name.replace('.geojson', ''),
              info2Strip = info2.name.replace('.geojson', '');

          if (object1.features) poly1 = object1.features[0];
          if (object2.features) poly2 = object2.features[0];

          var newLayer = {
            geometry: turf.union(poly1, poly2),
            name: 'union_' + info1Strip + '_' + info2Strip + '.geojson'
          };
          return newLayer;
        },

        erase: function(object1, object2, info1, info2) {
          var poly1 = object1,
              poly2 = object2,
              info1Strip = info1.name.replace('.geojson', ''),
              info2Strip = info2.name.replace('.geojson', '');

          var newLayer = {
            geometry: turf.erase(poly1, poly2),
            name: 'erase_' + info1Strip + '_' + info2Strip + '.geojson'
          };
          return newLayer;

        }
      }
    }

};

// NOTE: we are returning a class, not an instance
module.exports =  Menu;

},{}],4:[function(require,module,exports){
'use strict';
var Dropzone = require( '../dropzone' ) ,
    GeoMenu = require( '../geoprocessing_menu' );

var Map = function( options ) {
    this.options = options || {}; 
    if ( !( this instanceof Map ) ) { 
        return new Map();
    }

    /*
    **
    **  TODO: these variables should be put 
    **  into properties on the prototype
    **  see the getters/setters section below
    **
    */
    this.numLayers = 0;
    this.map = null;
    this.selection = {
        add: function(l) {
            this.list.push(l);
        },
        remove: function(l) {
            for (var i = 0; i < this.list.length; i++) {
              if (l._leaflet_id == this.list[i].layer._leaflet_id) {
                this.list.splice(i, 1);
              }
            }
        },
        list: []
    };
    this.download = document.getElementById('download');

};

Map.prototype = {

    init : function() {

        // wireup the other classes 
        DNC.dropzone = new Dropzone()
        DNC.menu = new GeoMenu()

        this.addEventListeners();
        this.setupMap();

    } ,
    
    /*
    **
    **  dispatch the DNC
    **  registration event
    **  so that everything that needs
    **  to attach event listeners for this
    **  application can do so
    **
    */
    addEventListeners : function() {

        console.log( "[ DISPATCH ]: register event" );
        document.dispatchEvent( this.dnc_registration_event );

    } ,

    setupMap : function () {

        L.mapbox.accessToken = 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA';
        this.map = L.mapbox.map('map', 'svmatthews.hf8pfph5', {
            zoomControl: false
        }).setView([0,0], 3);

    } ,

    // TODO: this function is really big, we should probably break it up
    addLayer : function(info, layer, z) {
      var mapLayer = L.mapbox.featureLayer(layer)
        .setZIndex(z)
        .addTo(this.map);

      // add radio button for show/hide of layer
      var check = document.createElement('input');
          check.setAttribute('type', 'checkbox');
          check.setAttribute('checked', 'true');
          check.className = 'layer-toggle';

      var layerItem = document.createElement('div');
          layerItem.className = 'layer-name';
          layerItem.innerHTML = info.name;

      var li = document.createElement('li');
          li.className = 'layer-element ' + info.name;

      // when you click the layer item, make it selectable
      layerItem.onclick = function(evt) {
        // if the element is currently not selected, add the class
        if (evt.currentTarget.className.indexOf('selected') == -1) {

          // add the class
          evt.currentTarget.className += ' selected';

          // add to select list
          this.selection.add({
            info: info,
            layer: mapLayer
          });
        } else {

          // remove selection
          this.selection.remove(mapLayer);

          // remove class name
          evt.currentTarget.className = 'layer-name';
        }
      }.bind( this );

      check.onchange = function() {
        // if the box is now checked, show the layer
        if (check.checked) {
          this.map.addLayer(mapLayer);
        } else {
          if (this.map.hasLayer(mapLayer)) this.map.removeLayer(mapLayer);
        }
      }.bind( this );

      // first append it, then add the checkbox and inner html
      document.getElementById('fileList').appendChild(li);
      li.appendChild(check);
      li.appendChild(layerItem);

      this.numLayers++;
    } ,

    updateDownload : function(file) {
        download.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
    }

};


/*
**
**  getters and setters
**
*/
Object.defineProperty( Map.prototype, 'dnc_registration_event_name', {
    get : function() {
        return 'register-dnc-event-handlers';
    } ,
});

Object.defineProperty( Map.prototype, 'dnc_registration_event', {
    writeable : false ,
    configurable: false ,
    value : (function(){
                var eventObj = new CustomEvent( Map.prototype.dnc_registration_event_name, { 'detail' : {}  , bubbles : true , cancelable : true } );
                eventObj.extra_data = {}; // to be used later
                return eventObj;
            })()
});


module.exports = new Map();



},{"../dropzone":2,"../geoprocessing_menu":3}]},{},[1])
;