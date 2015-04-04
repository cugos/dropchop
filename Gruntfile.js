'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
      html: {
        files: ['index.html'],
      },
      stylesheets: {
        files: ['src/sass/*.scss'],
        tasks: ['css'],
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['js', 'browserify'],
      },
      options: { livereload: true },
    },
    browserify: {
      dist: {
        files: {
          'dist/js/dnc.js': ['src/js/DNC.js'],
        }
      },
      options: {
        watch: true
      }
    },
    connect: {
      server: {
        options: {
          base: './',
          livereload: true,
          open: true,
        }
      }
    }
  });

  // Loading tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');

  // Tasks.
  grunt.registerTask('default', ['build']);
  grunt.registerTask('js', ['jshint', 'uglify']);
  grunt.registerTask('build', ['js', 'css','watch']);
  grunt.registerTask('css',['sass']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('serve', ['connect:server', 'watch']);
};
