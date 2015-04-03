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
        **  handlers for menu geoprocessing opertations
        **  TODO: these should not be here
        **  we should have menu-item components
        **  that insert their DOM buttons and attached
        **  and destroy event listeners
        **
        **  TODO: also the tight coupling to map.selection
        **  should not be here. we need to break this out into events
        **
        **
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

    //
    // TODO: flatten opts into separate functions for testing
    // and each turf-related function register itself
    //
    ops :  {
      //
      // TODO: this tight coupling between map
      // should be evented
      //
      // main execution for operations
      execute: function(newLayer) {
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
