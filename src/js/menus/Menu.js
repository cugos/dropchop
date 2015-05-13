L.DNC = L.DNC || {};
L.DNC.Menu = L.Class.extend({
    includes: L.Mixin.Events,

    initialize: function ( title, parent, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.parent = parent;
        this.children = this._buildMenuItems(this.options.items);
        this.domElement = this._buildDomElement(this.children);
        this._addEventHandlers();
    },

    // handlers for menu options
    _addEventHandlers : function () {

        // using within the click function scope since we need to pass information
        // about the clicked object (id) AND its parent scope (menu) for .fire()
        var _this = this;

        // Dropdown tooling
        if (this.domElement) {
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

        if (this.children) {
            for ( var c = 0; c < this.children.length; c++ ) {
                this.children[c].addEventListener('click', itemClick, false);
            }
        }
        function itemClick() {
            _this.fire('click', { action: this.id });
        }
    },

    _buildMenuItems: function ( items ) {
        var tempArray = [];
        for ( var i = 0; i < items.length; i++ ) {
            var menuItem = document.createElement('button');
            menuItem.className = 'menu-button menu-button-action';
            menuItem.id = items[i];
            menuItem.innerHTML = items[i];
            tempArray.push(menuItem);
        }
        return tempArray;
    },

    // Create, add, and return dom element
    _buildDomElement: function ( elems ) {
        var menu = document.createElement('div');
        menu.className = "menu";
        menu.innerHTML = '<button class="menu-button">' + this.title + '<i class="fa fa-angle-down"></i></button>';

        var menuDropdown = document.createElement('div');
        menuDropdown.className = 'menu-dropdown menu-expand';
        for ( var e = 0; e < elems.length; e++ ) {
            menuDropdown.appendChild(elems[e]);
        }

        menu.appendChild(menuDropdown);
        this.parent.domElement.appendChild(menu); // add to DOM
        return menu;
    }
});
