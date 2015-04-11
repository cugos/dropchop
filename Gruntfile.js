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
          'dist/js/dnc.min.js': ['dist/js/dnc.js']
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
        tasks: ['js'],
      },
      options: {
        livereload: true,
      },
    },
    connect: {
      server: {
        options: {
          base: './',
          livereload: true,
          open: true,
        }
      }
    },
    concat: {
        basic: {
          src: ['src/js/DncApp.js'],
          dest: 'dist/js/dnc.js'
        },
        extras: {
          src: ['src/js/L.DNC.js', 'src/js/**/*.js'],
          dest: 'dist/js/L.DNC.js'
        },
    },
    karma: {
      unit: {
          configFile: 'spec/karma.conf.js'
      }
    }
  });

  // Loading tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');

  // Tasks.
  grunt.registerTask('default', ['build']);
  grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('build', ['js', 'css','watch']);
  grunt.registerTask('css',['sass']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('serve', ['connect:server', 'watch']);
  grunt.registerTask('test', ['karma']);
};
