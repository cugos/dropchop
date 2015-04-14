L.DNC = L.DNC || {};
L.DNC.Notifications = L.Class.extend({


    statics: {},

    // defaults
    options: {},

    initialize: function (map, options) {

        // override defaults with passed options
        L.setOptions(this, options);
        this._map = map;

        // create notification center & locations
        this.hub = document.getElementById('notifications');

    } ,

    // used to add a notification to the DOM
    add: function ( options ) {
        // add a new notification to the stream
        noteCenter = this.hub;

        var note = document.createElement('div');
        note.className = 'notification ' + options.type;
        note.innerHTML = options.text;
        noteCenter.appendChild(note);
        
        // TODO: add/remove notifications to an array to interact with them
        // instead of relying on setTimeout() dictating their existence.
        setTimeout(function () {
            noteCenter.removeChild( noteCenter.firstChild );
        }, 4000);

    }

    // TODO: add event listeners for notifications here instead of 
    // throughout the application. Maybe?



});
