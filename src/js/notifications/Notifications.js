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

        // TODO: clean this up?
        params = {},
        params.text = options.text || 'THIS NOTIFICATION REQUIRES TEXT',
        params.time = options.time || 4000,
        params.type = options.type || 'default';

        // add a new notification to the stream
        var note = document.createElement('div');
        note.className = 'notification ' + options.type;
        note.innerHTML = options.text;
        this.hub.appendChild(note);

        // redefine for setTimeout() scope
        var _this = this;
        
        // TODO: add/remove notifications to an array to interact with them
        // instead of relying on setTimeout() dictating their existence.
        setTimeout(function () {
            _this.hub.removeChild( _this.hub.firstChild );
        }, params.time);

    }

    // TODO: add event listeners for notifications here instead of 
    // throughout the application. Maybe?

    // this.notifications.add({
    //     text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
    //     type: 'success',
    //     time: 2000
    // });


});
