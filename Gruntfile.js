'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/js/**/*.js']
    },
    uglify: {
      app: {
        options: {
          compress: true,
          mangle: true,
          sourceMap: true
        },
        files: {
          'dist/js/L.DNC.min.js': ['dist/js/L.DNC.js']
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
      htmldev: {
        files: ['src/index.html'],
        tasks: ['processhtml:dev'],
      },
      htmlprod: {
        files: ['src/index.html'],
        tasks: ['processhtml:prod'],
      },
      stylesheets: {
        files: ['src/sass/**/*.scss'],
        tasks: ['css'],
      },
      jsdev: {
        files: ['src/js/*.js', 'src/js/**/*.js'],
        tasks: ['js:dev'],
      },
      jsprod: {
        files: ['src/js/*.js', 'src/js/**/*.js'],
        tasks: ['js:prod'],
      },
      options: {
        livereload: true // Prevent auto-reload of browser by setting to false
      },
    },
    connect: {
      dev: {
        options: {
          base: './dist/',
        }
      },
      prod: {
        options: {
          base: './dist/',
        }
      },
    },
    focus: {
      dev: {
        include: ['htmldev', 'stylesheets', 'jsdev']
      },
      prod: {
        include: ['htmlprod', 'stylesheets', 'jsprod']
      },
    },
    concat: {
        dist: {
          src: ['src/js/*.js', 'src/js/menu/MenuBar.js', 'src/js/**/*.js'],
          dest: 'dist/js/L.DNC.js'
        },
    },
    karma: {
      unit: {
          configFile: 'spec/karma.conf.js'
      }
    },
    processhtml: {
        options: {
            strip: true
        },        
        prod: {
            files: {
                'dist/index.html' : ['src/index.html']
            }
        },
        dev: {
            files: {
                'dist/index.html' : ['src/index.html']
            }
        }
    },
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
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
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-focus');

  // Tasks.
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('lint', ['jshint']);
  // JS
  grunt.registerTask('js:dev', ['jshint', 'concat', 'uglify', 'test']);
  grunt.registerTask('js:prod', ['concat', 'uglify']);
  //CSS
  grunt.registerTask('css:dev', ['sass']);
  grunt.registerTask('css:prod', ['sass']);
  // Build wrappers
  grunt.registerTask('build:dev', ['js:dev', 'css:dev', 'processhtml:dev']);
  grunt.registerTask('build:prod', ['js:prod', 'css:prod', 'processhtml:prod']);
  // Serve locally on :8000
  grunt.registerTask('serve:dev', ['connect:dev', 'focus:dev']);
  grunt.registerTask('serve:prod', ['connect:prod', 'focus:prod']);
  // Overall build targets... dev and prod.  Default to dev
  grunt.registerTask('dev', ['build:dev', 'serve:dev']);
  grunt.registerTask('prod', ['build:prod', 'serve:prod']);
  grunt.registerTask('default', ['dev']);
  // Example to run dev (and serve) on commandline:
  // $ grunt
  // Example to run prod (and serve) on commandline:
  // $ grunt prod
};
