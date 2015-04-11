L.DNC = L.DNC || {};
L.DNC.Menu = L.Class.extend({

    // defaults
    options: {
    },

    initialize: function ( jsonLayerList, options ) {

        // override defaults with passed options
        L.setOptions(this, options);

        this._jsonLayerList = jsonLayerList;
        this.addEventHandlers();

    },

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
         **  should probably be somewhere else.
         **  it would be nice if we could have
         **  each operation we want register
         **  itself as a plugin with it's own HTML for
         **  the menu item and functions to bind/unbind
         **  event listeners
         **
         **  handlers for menu geoprocessing opertations
         */
        var buffer = document.getElementById('buffer');
        buffer.addEventListener('click', function(){
            this.ops.execute.call( this,
                this.ops.geom.buffer(
                    this._jsonLayerList.selection.list[0].layer._geojson,
                    this._jsonLayerList.selection.list[0].info
                )
            );
        }.bind(this));

        var union = document.getElementById('union');
        union.addEventListener('click', function(){
            this.ops.execute.call( this,
                this.ops.geom.union(
                    this._jsonLayerList.selection.list[0].layer._geojson,
                    this._jsonLayerList.selection.list[1].layer._geojson,
                    this._jsonLayerList.selection.list[0].info,
                    this._jsonLayerList.selection.list[1].info
                )
            );
        }.bind(this));

        var erase = document.getElementById('erase');
        erase.addEventListener('click', function(){
            this.ops.execute.call( this,
                this.ops.geom.erase(
                    this._jsonLayerList.selection.list[0].layer._geojson,
                    this._jsonLayerList.selection.list[1].layer._geojson,
                    this._jsonLayerList.selection.list[0].info,
                    this._jsonLayerList.selection.list[1].info
                )
            );
        }.bind(this));
    } ,

    /*
    **  TODO: flatten opts into separate functions
    **  to make it more testable and think about the
    **  plugin idea mentioned in above TODO(s)
    **
    */
    ops :  {
        // main execution for operations
        execute: function(newLayer) {
            var mapLayer = L.mapbox.featureLayer(newLayer.geometry);
            this._jsonLayerList.addLayerToList( mapLayer, newLayer.name, true );
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


});