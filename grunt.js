/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'src/main/webapp/js/*.js', 'src/main/webapp/test-js/*.js']
    },
    concat: {
      dist: {
        src: [
          '<banner:meta.banner>',
          'http://m1.daumcdn.net/svc/attach/U0301/cssjs/ejohn/class-0.1.0.min.js',
          'http://m1.daumcdn.net/svc/attach/U0301/cssjs/gesture/gesture-1.0.3.js',
          'src/main/webapp/js/datasource.js',
          'src/main/webapp/js/util.js',
          'src/main/webapp/js/panel.js',
          'src/main/webapp/js/container.js',
          'src/main/webapp/js/observable.js',
          'src/main/webapp/js/slide.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.merged.js',
        separator: "\n\n"
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
      }
    },
    servicefarm: {
      path_merged:{
        src: "<config:concat.dist.dest>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.merged.js"
      },
      path_min:{
        src: "<config:min.dist.dest>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.min.js"
      }
    }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-servicefarm');
  grunt.loadNpmTasks('grunt-concat');

  // Default task.
  grunt.registerTask('default', 'lint concat min servicefarm');

};