/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> */\n',
      standalone_banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> (standalone) - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> */\n'
    },
    remotefile: {
      event: {
        url: 'http://s1.daumcdn.net/svc/original/U03/cssjs/jscode/event-0.1.4.js',
        dest: 'dist/dependency/event.js'
      },
      ua_parser: {
        url: 'http://s1.daumcdn.net/svc/original/U03/cssjs/userAgent/userAgent-1.0.14.js',
        dest: 'dist/dependency/ua_parser.js'
      },
      gesture: {
        url: 'http://s1.daumcdn.net/svc/attach/U03/cssjs/gesture/gesture-1.0.5.js',
        dest: 'dist/dependency/gesture.js'
      },
      observable: {
        url: 'http://m1.daumcdn.net/svc/original/U03/cssjs/observable/observable-0.1.5.merged.js',
        dest: 'dist/dependency/observable.js'
      }
    },
    concat: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          'src/js/init.js',
          'src/js/resize.js',
          'src/js/datasource.js',
          'src/js/panel.js',
          'src/js/container.js',
          'src/js/slide.js',
          'src/js/progressive.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.merged.js',
        separator: "\n\n"
      },
      standalone: {
        options: {
          banner: '<%= meta.standalone_banner %>'
        },
        src: [
          '<banner:meta.banner>',
          '<%= remotefile.event.dest %>',
          '<%= remotefile.ua_parser.dest %>',
          '<%= remotefile.gesture.dest %>',
          '<%= remotefile.observable.dest %>',
          'src/js/init.js',
          'src/js/resize.js',
          'src/js/datasource.js',
          'src/js/panel.js',
          'src/js/container.js',
          'src/js/slide.js',
          'src/js/progressive.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.standalone.merged.js',
        separator: "\n\n"
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: ['<%= concat.dist.dest %>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      standalone: {
        options: {
          banner: '<%= meta.standalone_banner %>'
        },
        src: ['<%= concat.standalone.dest %>'],
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
        slide: true,
        clay: true,
        daumtools: true,
        dongtl: true,
        gesture: true
      },
      uses_defaults: ['Gruntfile.js', 'src/js/*.js', 'src/test-js/*.js']
    },
    daum_servicefarm: {
      path_merged:{
        src: "<%= concat.dist.dest %>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.merged.js"
      },
      path_min:{
        src: "<%= uglify.dist.dest %>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.min.js"
      },
      path_standalone_merged:{
        src: "<%= concat.standalone.dest %>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.standalone.merged.js"
      },
      path_standalone_min:{
        src: "<%= uglify.standalone.dest %>",
        dest: "slide/<%= pkg.name %>-<%= pkg.version %>.standalone.min.js"
      }
    }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-remotefile');
  grunt.loadNpmTasks('grunt-daum-servicefarm');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('remote', ['remotefile']);
  grunt.registerTask('default', ['remotefile', 'jshint', 'concat', 'uglify', 'daum_servicefarm']);

};
