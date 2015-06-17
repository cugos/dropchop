L.Dropchop = L.Dropchop || {};
L.Dropchop.MenuBar = L.Class.extend({
    includes: L.Mixin.Events,
    options: { id: '#menu-bar', classList: [] },

    initialize: function ( options ) {
        L.setOptions( this, options );
        this.children = [];
        this.domElement = this._buildDomElement(this.options.id, this.options.classList, this.options.logo_src, this.options.logo_class);
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
    _buildDomElement: function ( id, classList, logo_src, logo_class ) {
        var nav = document.createElement('nav');
        nav.id = id;
        for (var i=0; i < classList.length; i++) {
            nav.classList.add(classList[i]);
        }

        // add logo
        if (logo_src) {
            var logo = document.createElement('img');
            logo.className = logo_class;
            logo.src = logo_src;
            nav.appendChild(logo);
        }

        return nav;
    }
});
