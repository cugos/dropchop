L.DNC = L.DNC || {};
L.DNC.Menu = L.Class.extend({ // This is a base class. It should never be initiated directly.

    // defaults
    options: {
        parentId : 'menu-bar'
    },

    initialize: function ( title, options ) {
        L.setOptions(this, options);

        this.title = title;

        this.domElement = this._buildMenu();
        this._addEventHandlers();
    },

    _addEventHandlers : function () {
        /*
        **
        **  handlers for menu options
        **
        */
        if (this.domElement) {
            this.domElement.addEventListener('click', menuClick, false);
        }

        // Dropdown tooling
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
    },

    // Create and attach dom elements
    _buildMenu: function () {
        var menu = document.createElement('div');
        menu.className = "menu";
        menu.innerHTML = '<button class="menu-button">' +
            this.title + '<i class="fa fa-angle-down"></i>' +
            '</button>' +
        '<div class="menu-dropdown menu-expand"></div>';

        var domElement = document.getElementById(this.options.parentId).appendChild(menu);
        return domElement;
    },

    // Add operation to menu
    addOperation: function( operation ) {
        var dropdown = this.domElement.getElementsByClassName('menu-dropdown')[0];
        dropdown.appendChild( operation.domElement );
        return this;
    }
});
