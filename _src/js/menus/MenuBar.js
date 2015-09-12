L.Dropchop = L.Dropchop || {};
L.Dropchop.MenuBar = L.Class.extend({
    includes: L.Mixin.Events,
    options: { id: '#menu-bar', classList: [] },

    initialize: function ( options ) {
        L.setOptions( this, options );
        this.children = [];
        this.domElement = this._buildDomElement(this.options.id, this.options.classList);
    },

    /*
    **
    ** Append this domElement to a give parent object's dom element
    **
    */
    addTo: function ( parent ) {
        var parentDomElement = parent.domElement || parent; // If parent doesn't have a domElement, assume that it IS a dom element
        parentDomElement.appendChild( this.domElement );
        this.parent = parent;
        return this;
    },

    /*
    **
    ** Create the DOM element
    **
    */
    _buildDomElement: function ( id, classList ) {
        var nav = document.createElement('nav');
        nav.id = id;
        for (var i=0; i < classList.length; i++) {
            nav.classList.add(classList[i]);
        }
        return nav;
    }
});
