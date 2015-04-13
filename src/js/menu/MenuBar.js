L.DNC = L.DNC || {};
L.DNC.MenuBar = L.Class.extend({

    // defaults
    options: {
        parentId : 'menu-bar'
    },

    initialize: function ( options ) {
        // override defaults with passed options
        L.setOptions(this, options);

        var geotools = new L.DNC.Menu( "Geoprocessing Tools", this.layerlist, {} )
            .addOperation(new L.DNC.TurfOperation('buffer', {}))

        this.menus = [];
        this.menus.push( geotools );
    }
});
