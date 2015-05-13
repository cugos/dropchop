L.DNC = L.DNC || {};
L.DNC.MenuBar = L.Class.extend({
    includes: L.Mixin.Events,

    initialize: function ( options ) {
        L.setOptions( this, options );
        this.children = [];
        this.domElement = this._buildDomElement(this.options.id);
    },

    // Append this domElement to a give parent object's dom element
    addTo: function ( parent ) {
        var parentDomElement = parent.domElement || parent; // If parent doesn't have a domElement, assume that it IS a dom element
        parentDomElement.appendChild( this.domElement );
        this.parent = parent;
        return this;
    },

    /*
    **
    ** create the DOM element #menu-bar
    **
    */
    _buildDomElement: function ( id ) {
        var nav = document.createElement('nav');
        nav.id = id;
        return nav;
    }
});