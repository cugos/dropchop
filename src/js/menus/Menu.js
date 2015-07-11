L.Dropchop = L.Dropchop || {};

/*
**
** A dropdown menu
**
*/
L.Dropchop.Menu = L.Class.extend({
    includes: L.Mixin.Events,
    options: { items: [], menuDirection: 'below' },

    initialize: function ( title, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.children = this._buildMenuItems(this.options.items);
        this.domElement = this._buildDomElement(this.children);
        this._addEventHandlers();
    },

    /*
    **
    ** Create event handlers for dom elements within this object
    **
    */
    _addEventHandlers : function () {

        // using within the click function scope since we need to pass information
        // about the clicked object (id) AND its parent scope (menu) for .fire()
        var _this = this;

        // Dropdown tooling
        if (this.domElement && this.children.length) { // Only if menu has child objects
            this.domElement.addEventListener('click', menuClick, false);
        }
        function menuClick() {
            var menuExpand = this.querySelector('.menu-dropdown');

            if (menuExpand.className.indexOf('expanded') == -1) {
                // Close open menus
                var openMenus = document.getElementsByClassName('expanded');
                for (var i=0; i < openMenus.length; i++){
                  openMenus[i].className = openMenus[i].className.replace(/\b expanded\b/,'');
                }

                // Open this menu
                menuExpand.className += ' expanded';

            } else {
                menuExpand.className = menuExpand.className.replace(/\b expanded\b/,'');
            }
        }

        if (this.children.length) {
            for ( var c = 0; c < this.children.length; c++ ) {
                this.children[c].addEventListener('click', itemClick, false);
            }
        } else {  // Handle menu with no sub-items (thus, the menu itself is the button)
            this.domElement.addEventListener('click', itemClick, false);
        }
        function itemClick() {
            // Set action to operation id or lowercase menu title
            _this.fire('clickedOperation', { action: this.id || _this.title.toLowerCase() });
        }
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
    ** Take in an array of operations names, return array of dom elements for
    ** each item
    **
    */
    _buildMenuItems: function ( items ) {
        var tempArray = [];
        for ( var i = 0; i < items.length; i++ ) {
            var menuItem = document.createElement('button');
            menuItem.className = 'menu-button menu-button-action';
            
            menuItem.id = items[i];

            // if this is a side menu button, add the class
            if (this.options.expand === false) {
                menuItem.className += ' side-menu-button';
            }

            // put the name of the action into the button unless
            // it's supposed to be a side button and not expand
            if (this.options.expand !== false) {
                menuItem.innerHTML = items[i];    
            } else { // add an icon
                menuItem.innerHTML = '<img class="icon" src="/icons/turf-'+items[i]+'.svg">';
            }

            tempArray.push(menuItem);
        }
        return tempArray;
    },

    /*
    **
    ** Take in array of menu item dom elements, return dom element for this menu
    **
    */
    _buildDomElement: function ( childElements ) {

        // Create menu div
        var menu = document.createElement('div');
        menu.className = "menu";
        if (this.options.expand === false) {
            menu.className += " no-expand";
        }


        if (this.options.expand !== false) {
            // Create button for menu
            var button = document.createElement('button');
            button.className = "menu-button";
            button.innerHTML = this.title;

            // Create icon for menu's button
            var icon = document.createElement('i');
            if ( this.options.iconClassName ){
                icon.className = this.options.iconClassName;
            } else if ( childElements.length ) { // Only if child elements
                if ( this.options.menuDirection == 'above' ) {
                    icon.className = 'fa fa-angle-up';
                } else {
                    icon.className = 'fa fa-angle-down';
                }
            }
            button.appendChild(icon);
            menu.appendChild(button);
        }


        // Create menu dropdown
        var menuDropdown = document.createElement('div');
        if (this.options.expand === false) {
            menuDropdown.className = 'menu-container';
        } else {
            menuDropdown.className = 'menu-dropdown menu-expand';
        }

        if ( this.options.menuDirection == 'above' ) {
            menuDropdown.className += ' opens-above'; // Menu dropdown opens to above menu
        }

        for ( var e = 0; e < childElements.length; e++ ) {  // Add childElements
            menuDropdown.appendChild(childElements[e]);
        }        
        
        menu.appendChild(menuDropdown);
        return menu;
    }
});
