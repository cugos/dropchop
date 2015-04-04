var map = require( './map' );

var DncApp = {
    version: '0.0.1-dev' ,
    map : map 
};

if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = DncApp;
}

if (typeof window !== 'undefined') {
    window.DncApp = DncApp;
}

