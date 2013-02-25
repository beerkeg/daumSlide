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
      files: ['grunt.js', 'src/js/*.js', 'src/test-js/*.js']
    },
    concat: {
      dist: {
        src: [
          '<banner:meta.banner>',
          'src/js/datasource.js',
          'src/js/init.js',
          'src/js/panel.js',
          'src/js/container.js',
          'src/js/observable.js',
          'src/js/slide.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.merged.js',
        separator: "\n\n"
      },
      standalone: {
        src: [
          '<banner:meta.banner>',
          'http://s1.daumcdn.net/svc/attach/U0301/cssjs/ejohn/class-0.1.0.min.js',
          'http://s1.daumcdn.net/svc/attach/U03/cssjs/gesture/gesture-1.0.4.js',
          'src/js/datasource.js',
          'src/js/util.js',
          'src/js/panel.js',
          'src/js/container.js',
          'src/js/observable.js',
          'src/js/slide.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.standalone.merged.js',
        separator: "\n\n"
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      standalone: {
        src: ['<banner:meta.banner>', '<config:concat.standalone.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.standalone.min.js'
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
      },
      path_standalone_merged:{
        src: "<config:concat.standalone.dest>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.standalone.merged.js"
      },
      path_standalone_min:{
        src: "<config:min.standalone.dest>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.standalone.min.js"
      }
    }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-servicefarm');
  grunt.loadNpmTasks('grunt-concat');

  // Default task.
  grunt.registerTask('default', 'lint concat min servicefarm');

};
