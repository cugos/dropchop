var json_reader = require( './_fileReader.js' );

var addEventHandlers = function() {

    if (typeof window !== 'undefined') {
        dropzone = window;

        dropzone.addEventListener('dragover', function(e) {
            e = e || event;
            e.preventDefault();
            document.body.className = "dragging";
        }, false);

        dropzone.addEventListener('dragleave', function(e) {
            e = e || event;
            e.preventDefault();
            document.body.className = "";
        }, false);

        dropzone.addEventListener('drop', function(e) {
            e = e || event;
            e.preventDefault();
            document.body.className = "";
            files = e.dataTransfer.files;
            json_reader.handleFiles(files);
        }, false);
    }

};

module.exports = addEventHandlers;
