L.DNC = L.DNC || {};
L.DNC.Menu = L.Class.extend({ // This is a base class. It should never be initiated directly.

    // defaults
    options: {
    },

    initialize: function ( options ) {

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
        var menu = document.getElementsByClassName('menu-expand');
        for (var m = 0; m < menu.length; m++) {
            menu[m].addEventListener('click', menuClick, false);
        }

        function menuClick() {
            var menuExpand = this.nextSibling.nextSibling;
            if (menuExpand.className.indexOf('expanded') == -1) {
                menuExpand.className += ' expanded';
            } else {
                menuExpand.className = 'menu';
            }

        }
    }
});
