L.DNC = L.DNC || {};
L.DNC.Notifications = L.Class.extend({

    statics: {},

    // defaults
    options: {},

    initialize: function (fileReader, options) {

        // override defaults with passed options
        L.setOptions(this, options);

        // listen for fileReader events
        this._fileReader = fileReader;

        // create notification center & locations
        this.hub = document.getElementById('notifications');

        // set all "handlers" as subscribers to events as they come through
        this._registerEventHandlers();

    } ,

    // used to add a notification to the DOM
    add: function ( options ) {

        // TODO: clean this up?
        params = {};
        params.text = options.text || 'THIS NOTIFICATION REQUIRES TEXT';
        params.time = options.time || 4000;
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

    } ,

    _registerEventHandlers: function () {
        // NEW FILE: success
        this._fileReader.on('fileparsed', function(e) {
            L.DNC.notifications.add({
                text: '<strong>' + e.fileInfo.name + '</strong> added successfully.',
                type: 'success',
                time: 2000
            });
        });
    }

});
