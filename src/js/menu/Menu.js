L.DNC = L.DNC || {};
L.DNC.Menu = L.DNC.MenuBar.extend({

    initialize: function ( title, options ) {
        L.setOptions(this, options);
        this.title = title;
        this.children = [];
        this.domElement = this._buildDomElement();
        this._addEventHandlers();
    },

    // Add object as child. Object must have domElement property.
    addChild: function( child, target ) {
        target = target || this.domElement.getElementsByClassName('menu-dropdown')[0];
        return this.constructor.__super__.addChild.call(this, child, target);
    },

    // handlers for menu options
    _addEventHandlers : function () {
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

    // Create and return dom element (note: this does not attach dom element to any parent)
    _buildDomElement: function () {
        var menu = document.createElement('div');
        menu.className = "menu";
        menu.innerHTML = '<button class="menu-button">' +
            this.title + '<i class="fa fa-angle-down"></i>' +
            '</button>' +
        '<div class="menu-dropdown menu-expand"></div>';
        return menu;
    }
});
