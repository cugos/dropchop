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
    execute: function ( action, parameters, options, layers, callback ) {
        var actions = {
            remove: function( action, parameters, options, layers ){
                callback({
                    remove: layers.map(
                        function(l){ return { layer: l.layer, name: l.info.name };
                    })
                });
            },
            'load from url': function ( action, parameters, options, layers ) {
                var url = parameters[0];
                var xhr = new XMLHttpRequest();
                xhr.open('GET', encodeURI(url));
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var file = JSON.parse(xhr.responseText);
                        var filename = xhr.responseURL.substring(xhr.responseURL.lastIndexOf('/')+1);
                        callback({ add: [{ layer: file, name: filename }] });
                    } else {
                        console.error('Request failed. Returned status of ' + xhr.status);
                    }
                };
                xhr.send();
            }
        };
        if (typeof actions[action] !== 'function') {
          throw new Error('Invalid action.');
        }
        return actions[action](action, parameters, options, layers);
    },

});
