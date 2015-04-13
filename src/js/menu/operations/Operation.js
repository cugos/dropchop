L.DNC.Operation = L.Class.extend({

    options: {
        // supportedFeatures : [],
        minFeatures : 1,
        maxFeatures : 0,
        orderImport : false,
        // iterable : true
    },

    initialize: function (title, options) {
        L.setOptions(this, options);

        this.title = title;
    },

    buildDomElement: function (element) {
        // Append button within provided element
        element.innerHTML += '<button class="menu-button menu-button-action" id="' +
            this.title + '">' + this.title + '</button>';
    },
});
