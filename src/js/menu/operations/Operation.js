L.DNC = L.DNC || {};
L.DNC.Operation = L.DNC.Menu.extend({

    _addEventHandlers : function () {
        this.domElement.addEventListener('click', function(){
            this.renderInput.call( this );
        }.bind(this));
    },

    // Create and return dom element (note: this does not attach dom element to any parent)
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
