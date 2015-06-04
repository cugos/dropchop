L.Dropchop = L.Dropchop || {};
L.Dropchop.DropZone = L.Class.extend({


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
        this.type = L.Dropchop.DropZone.TYPE;

        this.fileReader = new L.Dropchop.DropZone.FileReader( this._map, options );
        this.fileReader.enable();
    }

});
