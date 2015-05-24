L.DNC = L.DNC || {};
L.DNC.FileExecute = L.DNC.BaseExecute.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** EXECUTE OPERATIONS FROM INPUT
    ** Should be overwritten...
    **
    */
    execute: function ( action, parameters, options, layers ) {
        var actions = {
            remove: function( action, parameters, options, layers ){
                return {
                    remove: layers.map( function(l){
                        return {
                            layer: l.layer,
                            name: l.info.name
                        };
                    })
                };
            }
        };
        if (typeof actions[action] !== 'function') {
          throw new Error('Invalid action.');
        }
        return actions[action](action, parameters, options, layers);
    },

});
