// config: http://karma-runner.github.io/0.10/config/configuration-file.html
// plugins: http://karma-runner.github.io/0.10/config/plugins.html
module.exports = function(config) {
  config.set({
    basePath: '.',
    files: [
      '../node_modules/js-polyfills/typedarray.js',
      'helpers.js',
      'spec/*.spec.js',
      'https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js',
      '../dist/static/js/vendor.js',
      '../dist/static/js/dropchop.js'
    ],
    frameworks: [
      'mocha',
      'chai',
      'sinon'
    ],
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-sinon',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher'
    ],
    browsers: ['PhantomJS'],
    colors: true,
    reporters: ['mocha']
  });
};
