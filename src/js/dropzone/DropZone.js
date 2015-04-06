L.DNC.DropZone = L.Class.extend({


    statics: {
        TYPE: 'dropzone'
    },

    // defaults
    options: {

    },

    initialize: function (map, options) {

        // override defaults with passed options
        L.setOptions(this, options);
        this._map = map;
        this.type = L.DNC.DropZone.TYPE;

        this.fileReader = new L.DNC.DropZone.FileReader( this._map, options );
    }

});