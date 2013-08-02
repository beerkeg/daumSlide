/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    remotefile: {
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
        src: [
          '<banner:meta.banner>',
          'src/js/init.js',
          'src/js/datasource.js',
          'src/js/panel.js',
          'src/js/container.js',
          'src/js/slide.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.merged.js',
        separator: "\n\n"
      },
      standalone: {
        src: [
          '<banner:meta.banner>',
          'dist/dependency/gesture.js',
          'dist/dependency/observable.js',
          'src/js/util.js',
          'src/js/datasource.js',
          'src/js/panel.js',
          'src/js/container.js',
          'src/js/slide.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.standalone.merged.js',
        separator: "\n\n"
      }
    },
    uglify: {
      dist: {
        src: ['<banner:meta.banner>', '<%= concat.dist.dest %>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      standalone: {
        src: ['<banner:meta.banner>', '<%= concat.standalone.dest %>'],
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
