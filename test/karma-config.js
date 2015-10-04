// config: http://karma-runner.github.io/0.10/config/configuration-file.html
// plugins: http://karma-runner.github.io/0.10/config/plugins.html
module.exports = function(config) {
  config.set({
    basePath: '.',
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