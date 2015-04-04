'use strict';

var FileList = function( options ) {
    this.options = options || {};
    if ( !( this instanceof FileList ) ) {
        return new FileList();
    }

    document.addEventListener( 'register-dnc-event-handlers' , function(e) {
        console.info( "[ REGISTER ]: FileList" );
        this.addEventHandlers();
    }.bind(this));
    
}; 

FileList.prototype = {

    readFile: function(fileObject) {
      var reader = new FileReader();
      reader.readAsText(fileObject, 'UTF-8');
      reader.onload = function() {
        var file = JSON.parse(reader.result);

        /*
        **  TODO: this tight coupling feels bad
        **  we should be able to resolve this with
        **  an observer pattern where the map responds
        **  to the FileList throwing an 'file-added' event 
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
    }
};


// NOTE: we are returning a class, not an instance
module.exports = FileList;
