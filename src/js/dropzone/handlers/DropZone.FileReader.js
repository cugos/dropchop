L.DNC.DropZone = L.DNC.DropZone || {};

L.DNC.DropZone.FileReader = L.Handler.extend({
    includes: L.Mixin.Events,

    initialize: function (map, options) {
        this._map = map;
        this._container = map._container;

        if (options && options.fileReaderOptions) {
            options.fileReaderOptions = L.Util.extend({}, this.options.fileReaderOptions, options.fileReaderOptions);
        }
        L.setOptions(this, options);
    },

    enable: function () {
        if (this._enabled) { return; }

        L.Handler.prototype.enable.call(this);

        this.fire('enabled', { options : this.options });
        this._map.fire('dropzone:enabled', { options : this.options });
    },

    disable: function () {
        if (!this._enabled) { return; }

        L.Handler.prototype.disable.call(this);

        this._map.fire('dropzone:disabled', { options : this.options });
        this.fire('disabled', { options : this.options });
    },

    addHooks: function () {
        /*
        **
        **  hook called on super.enable()
        **
        */
        var map = this._map;

        if (map) {
            // attach DropZone events
            L.DomEvent.on(this._container, 'dragover', this._handleDragOver, this);
            L.DomEvent.on(this._container, 'dragleave', this._handleDragLeave, this);
            L.DomEvent.on(this._container, 'drop', this._handleDrop, this);
        }
    },

    removeHooks: function () {
        /*
         **
         **  hook called on super.disable()
         **
         */
        if (this._map) {
            // detach DropZone events
            L.DomEvent.off(this._container, 'dragover', this._handleDragOver, this);
            L.DomEvent.off(this._container, 'dragleave', this._handleDragLeave, this);
            L.DomEvent.off(this._container, 'drop', this._handleDrop, this);
        }
    },


    _handleDragOver: function(e) {
        e = e || event;
        e.preventDefault();
        document.body.className = "dragging";
    },

    _handleDragLeave: function(e) {
        e = e || event;
        e.preventDefault();
        document.body.className = "";
    },

    _handleDrop: function(e) {
        e = e || event;
        e.preventDefault();
        document.body.className = "";
        var files = e.dataTransfer.files;
        console.debug( "[ FILES TRANSFERED  ]: ", files );
        this._handleFiles(files);
    },

    _handleFiles : function (files) {
        for (var i = 0; i < files.length; i++) {
            this._readFile(files[i]);
        }
    } ,

    _readFile: function(fileObject) {
        var reader = new FileReader();
        reader.readAsText(fileObject, 'UTF-8');
        reader.onload = function() {
            var file = JSON.parse(reader.result);

            this._map.fire('dropzone:fileparsed', { file: file });
            this.fire('fileparsed', { fileInfo: fileObject, file: file });
        }.bind(this);
    }

});