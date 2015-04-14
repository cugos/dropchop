L.DNC = L.DNC || {};
L.DNC.Operation = L.Class.extend({

    options: {
    },

    initialize: function ( title, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.domElement = this._buildDomElement();
        this._addEventHandlers();
    },

    _addEventHandlers : function () {
        this.domElement.addEventListener('click', function(){
            this.execute.call( this );
        }.bind(this));
    },

    // Generate and return button
    _buildDomElement: function () {
        var div = document.createElement('div');
        div.innerHTML += '<button class="menu-button menu-button-action" id="' +
            this.title + '">' + this.title + '</button>';
        return div.children[0];
    },

    // Where the magic happens
    execute: function() {
        console.error("L.DNC.Operation object did not properly override 'execute'", this);
    },
});
