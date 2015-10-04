var gulp = require('gulp');
var sourcemap = require('gulp-sourcemaps');
var karma = require('gulp-karma');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');


gulp.task('sass', function(){
  return gulp.src('./src/scss/dropchop.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/static/css'));
});

var vendorCSS = [
  './node_modules/mapbox.js/dist/mapbox.css',
  './node_modules/font-awesome/css/font-awesome.css'
];

gulp.task('css_vendor', function() {
  return gulp.src(vendorCSS)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/static/css'));
});

gulp.task('mapbox_assets', function() {
  return gulp.src('./node_modules/mapbox.js/dist/images/**.*')
    .pipe(gulp.dest('./dist/static/css/images'));
});

var vendorJS = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/browser-filesaver/FileSaver.js',
  './node_modules/shp-write/shpwrite.js',
  './src/lib/shp-2-geojson.js',
  './node_modules/osmtogeojson/osmtogeojson.js',
  './node_modules/turf/turf.js',
  './node_modules/mapbox.js/dist/mapbox.js' // requires to be built
];

gulp.task('lint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js_dropchop', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(sourcemap.init())
    .pipe(concat('dropchop.js'))
    .pipe(uglify())
    .pipe(sourcemap.write())
    .pipe(gulp.dest('./dist/static/js'));
});

gulp.task('js_vendor', function() {
  return gulp.src(vendorJS)
    .pipe(sourcemap.init())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(sourcemap.write())
    .pipe(gulp.dest('./dist/static/js'));
});

var testFiles = [
  'dist/static/vendor.js',
  'dist/static/dropchop.js',
  'test/**/*.spec.js'
];

gulp.task('html', function() {
  return gulp.src('./src/html/**.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('assets', function() {
  return gulp.src('./src/assets/**/*.*')
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('fa-fonts', function() {
  return gulp.src('./node_modules/font-awesome/fonts/**.*')
    .pipe(gulp.dest('./dist/static/fonts'));
});

gulp.task('watch', function() {
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/html/**.html', ['html']);
});

gulp.task('connect', function() {
  connect.server({
    port: '8888',
    root: 'dist'
  });
});

var testFiles = [
  './dist/static/js/vendor.js',
  './dist/static/js/dropchop.js',
  './test/spec/**/*.spec.js'
];
gulp.task('test', function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'test/karma-config.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('vendor', ['js_vendor', 'css_vendor', 'mapbox_assets', 'fa-fonts']);
gulp.task('js', ['lint', 'js_dropchop']);
gulp.task('build', ['js', 'html', 'sass', 'assets']);
gulp.task('default', ['build', 'connect', 'watch']);