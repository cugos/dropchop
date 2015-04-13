L.DNC.Operation = L.Class.extend({

    options: {
        // supportedFeatures : [],
        minFeatures : 1,
        maxFeatures : 0,
        orderImport : false,
        // iterable : true
    },

    initialize: function ( title, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.domElement = this.buildDomElement();
        this._addEventHandlers();
    },

    _addEventHandlers : function () {
        this.domElement.addEventListener('click', function(){
            this._execute.call( this );
        }.bind(this));
    },

    // Append button within provided element
    buildDomElement: function () {
        var div = document.createElement('div');
        div.innerHTML += '<button class="menu-button menu-button-action" id="' +
            this.title + '">' + this.title + '</button>';
        return div.children[0];
    },

    // Where the magic happens
    _execute: function( ) {
        console.error("L.DNC.Operation object did not properly override '_execute'", this);
    },
});
