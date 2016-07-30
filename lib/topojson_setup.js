var browserify = require('browserify');

var client = browserify('../node_modules/topojson/client.js').transform("babelify").bundle();

window.topojson = {
  topology: require('../node_modules/topojson/lib/topojson/topology'),
  client: client
}