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


