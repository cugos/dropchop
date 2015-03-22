'use strict';

var base = './app';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      target: {
        src: 'app/index.html'
      }
    },
    jshint: {
      files: ['src/js/*.js']
    },
    uglify: {
      dist: {
        files: {
          'app/static/js/app.js': ['src/js/app.js']
        }
      }
    },
    sass: {                              
      dist: {                            
        options: {                       
          style: 'compact'
        },
        files: {
          'app/static/css/app.css': 'src/sass/site.scss'
        }
      }
    },
    watch: {
      scripts: {
        files: 'src/sass/*.scss',
        tasks: ['css'],
        options: {
          event: [ 'changed', 'added', 'deleted'],
        },
      },
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/js/*.js'],
        dest: 'src/js/app.js',
      },
    },
    server: {
      port: 8080,
      base: './app'
    }
  });

  // Loading tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Tasks.  
  grunt.registerTask('default', ['build']);
  grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('build', ['wiredep', 'jshint', 'sass', 'uglify']);
  grunt.registerTask('bower', ['wiredep'])
  grunt.registerTask('css',['sass']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('watcher', ['watch']);

};
