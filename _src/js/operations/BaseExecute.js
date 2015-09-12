L.Dropchop = L.Dropchop || {};
L.Dropchop.BaseExecute = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    initialize: function (notification, options) {
        self.notification = notification;
        // override defaults with passed options
        L.setOptions(this, options);
    },

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    ** Should be overwritten...
    **
    */
    execute: function ( action, parameters, options, layers ) {
        throw new Error("Execute method not implemented");
    },


    /*
    **
    **  VALIDATE LAYERS
    **  Checks if the proper number of layers are in the current selection to
    **  allow Turf operations to run
    **
    */
    validate: function ( title, layers, options ) {
        var length = layers.length;

        // TODO: This should live elsewhere
        function ValidationError(message) {
              this.name = 'ValidationError';
              this.message = message || 'Validation Error';
        }
        ValidationError.prototype = Object.create(Error.prototype);
        ValidationError.prototype.constructor = ValidationError;

        if (options.maxFeatures && length > options.maxFeatures) {
            throw new ValidationError("Too many layers. Max is set to " + options.maxFeatures + ", got " + length + ".");
        }

        if (options.minFeatures && length < options.minFeatures) {
            throw new ValidationError("Too few layers. Min is set to " + options.minFeatures + ", got " + length + ".");
        }
    },

});
