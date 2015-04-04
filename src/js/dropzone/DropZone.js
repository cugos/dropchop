L.DNC.DropZone = L.Class.extend({


    statics: {
        TYPE: 'dropzone'
    },

    options: {
    },

    initialize: function (map, options) {
        this._map = map;
        this.type = L.DNC.DropZone.TYPE;

        this.fileReader = new L.DNC.DropZone.FileReader( this._map, options );
    }

});