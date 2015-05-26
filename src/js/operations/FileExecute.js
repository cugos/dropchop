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
                        var newLayer = JSON.parse(xhr.responseText);
                        var filename = xhr.responseURL.substring(xhr.responseURL.lastIndexOf('/')+1);

                        // if the new object is a feature collection and only has one layer,
                        // remove it and just keep it as a feature
                        if ( newLayer.geometry.type == "FeatureCollection" && newLayer.geometry.features.length == 1 ) {
                            newLayer.geometry = this._unCollect( newLayer.geometry );
                        }

                        callback({ add: [{ geometry: newLayer, name: filename }] });
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
