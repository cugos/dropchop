L.DNC = L.DNC || {};
L.DNC.Menu = L.Class.extend({ // This is a base class. It should never be initiated directly.

    // defaults
    options: {
    },

    initialize: function ( jsonLayerList, options ) {
        this._jsonLayerList = jsonLayerList;

        // override defaults with passed options
        L.setOptions(this, options);

        this.addEventHandlers();
    },

    addEventHandlers : function() {
        /*
        **
        **  handlers for menu options
        **
        */
        var menu = document.getElementsByClassName('menu');
        for (var m = 0; m < menu.length; m++) {
            menu[m].addEventListener('click', menuClick, false);
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
    }
});
