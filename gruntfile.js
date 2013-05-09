module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', '/lib/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    //watch: {
      //scripts: {
        //files: ['<%= jshint.files %>'],
        //tasks: ['jshint']
      //}
    //},
    karma: {
      develop: {
        configFile: 'karma.conf.js',
        autoWatch: true
      },
      all: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Chrome', 'Firefox', 'Opera']
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          keepalive: true,
          base: '.'
        }
      },
      test: {
        options: {
          port: 8000,
          hostname: 'localhost',
          base: '.'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('develop', [
    'jshint',
    'connect:test',
    'karma:develop'
  ]);

  grunt.registerTask('test:all', [
    'jshint',
    'connect:test',
    'karma:all'
  ]);
  
  grunt.registerTask('default', ['develop']);
};
