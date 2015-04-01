'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      target: {
        src: 'index.html'
      }
    },
    jshint: {
      files: ['src/js/*.js']
    },
    uglify: {
      app: {
        options: {
          compress: true,
          mangle: true,
          sourceMap: true
        },
        files: {
          'dist/js/app.js': ['src/js/*.js']
        }
      }
    },
    sass: {                              
      dist: {                            
        options: {                       
          style: 'compressed'
        },
        files: {
          'dist/css/app.css': 'src/sass/site.scss'
        }
      }
    },
    watch: {
      all: {
        files: ['src/js/*.js', 'src/sass/*.scss'],
        tasks: ['js', 'css'],
      }
    },
  });

  // Loading tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-wiredep');

  // Tasks.  
  grunt.registerTask('default', ['build']);
  grunt.registerTask('js', ['jshint', 'uglify']);
  grunt.registerTask('build', ['wiredep', 'js', 'css', 'watch']);
  grunt.registerTask('bower', ['wiredep'])
  grunt.registerTask('css',['sass']);
  grunt.registerTask('lint', ['jshint']);

};
