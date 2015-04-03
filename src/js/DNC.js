var map = require( './map' );

var DNC = {
    version: '0.0.1-dev' ,
    map : map 
};

if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = DNC;
}

if (typeof window !== 'undefined') {
    window.DNC = DNC;
}

