L.DNC = L.DNC || {};
L.DNC.Menu = L.Class.extend({ // This is a base class. It should never be initiated directly.

    // defaults
    options: {
        parentId : 'menu-bar'
    },

    initialize: function ( jsonLayerList, options ) {
        this._jsonLayerList = jsonLayerList;

        // override defaults with passed options
        L.setOptions(this, options);

        this.buildMenu();
        this.addEventHandlers();
    },

    addEventHandlers : function () {
        /*
        **
        **  handlers for menu options
        **
        */
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
    },

    _buildElement: function (str) {
        // Helper to insert raw HTML into element
        var div = document.createElement('div');
        div.innerHTML = str;
        return div.children[0];
    },

    buildMenu: function () {
        var html =
        '<div class="menu">' +
          '<button class="menu-button">' +
            this.title + '<i class="fa fa-angle-down"></i>' +
          '</button>' +
        '</div>';
        menu = this._buildElement(html);

        this.domElement = document.getElementById(this.options.parentId).appendChild(menu);
        return this.domElement;
    }
});
