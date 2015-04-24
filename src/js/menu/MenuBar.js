L.DNC = L.DNC || {};
L.DNC.MenuBar = L.Class.extend({
    includes: L.Mixin.Events,

    initialize: function ( options ) {
        L.setOptions(this, options);
        this.children = [];
        this.domElement = this._buildDomElement();
    },

    // Add object as child. Object must have domElement property.
    addChild: function ( child ) {
        this.domElement.appendChild(child.domElement);
        child.parentDomElement = this;
        this.children.push( child );
        return this;
    },

    // Append this domElement to a give domElement
    addTo: function ( parentDomElement ) {
        parentDomElement.appendChild(this.domElement);
        this.parentDomElement = parentDomElement;
        return this;
    },

    // Create and return dom element
    _buildDomElement: function () {
        return document.createElement('div');
    }
});
