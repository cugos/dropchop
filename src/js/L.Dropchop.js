var turf = require('turf');

(function(){
    var Dropchop = {
        version: '0.0.1-dev'
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = Dropchop;
    }

    if (typeof window !== 'undefined' && window.L ) {
        window.L.Dropchop = Dropchop;
    }
})();
