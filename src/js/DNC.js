var map = require( './map' ) ,
    Menu = require( './geoprocessing_menu' ) ,
    Dropzone = require( './dropzone' );

var DNC = {
    version: '0.0.1-dev' ,
    map : map ,
    Menu : Menu ,
    Dropzone: Dropzone ,
};

if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = DNC;
}

if (typeof window !== 'undefined') {
    window.DNC = DNC;
}

