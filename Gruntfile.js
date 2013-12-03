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
    extension_meta: {
      pc_slide: {
        banner: '/*! pc_slide - v<%= extension_meta.pc_slide.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> */\n',
        version: '0.1.0'
      }
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
          'src/js/datasource.js',
          'src/js/panel.js',
          'src/js/container.js',
          'src/js/slide.js',
          'src/js/progressive.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.standalone.merged.js',
        separator: "\n\n"
      },
      pc_slide: {
        options: {
          banner: '<%= extension_meta.pc_slide.banner %>'
        },
        src: ['src/extensions/pc_slide/pc_slide.js'],
        dest: 'dist/pc_slide-<%= extension_meta.pc_slide.version %>.merged.js'
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
      },
      pc_slide: {
        options: {
          banner: '<%= extension_meta.pc_slide.banner %>'
        },
        src: ['<%= concat.pc_slide.dest %>'],
        dest: 'dist/pc_slide-<%= extension_meta.pc_slide.version %>.min.js'
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
      },
      pc_slide_merged: {
        src: "<%= concat.pc_slide.dest %>",
        dest: "slide/extensions/pc_slide-<%= extension_meta.pc_slide.version %>.merged.js"
      },
      pc_slide_min: {
        src: "<%= uglify.pc_slide.dest %>",
        dest: "slide/extensions/pc_slide-<%= extension_meta.pc_slide.version %>.min.js"
      }
    },
    yuidoc: {
      // sublime: {
      //     name: 'daumtools',
      //     description: 'daumtools : daum javascript library',
      //     version: '<%= pkg.version %>',
      //     url: 'http://digit.daumcorp.com/html5tech/daumtools',
      //     options: {
      //         tabtospace: 4,
      //         paths: 'src/js',
      //         themedir: 'themes/daumtools_sublime',
      //         outdir: 'docs',
      //         helpers: ["themes/daumtools_sublime/helper/if_eq.js"]
      //     }
      // }
      bootstrap: {
        name: '<%= pkg.title || pkg.name %>',
        description: '<%= pkg.description%>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          tabtospace: 4,
          paths: 'src/js',
          themedir: 'themes/daumtools_bootstrap',
          outdir: 'docs/api',
          helpers: ["themes/daumtools_bootstrap/helpers/helpers.js"]
        }
      }
    },
    markdown: {
      slide: {
        options: {
          template: 'src/docs/template/template.jst'
        },
        files: [
          {
            expand: true,
            cwd: 'src/docs',
            src: ['*.md'],
            dest: 'docs/example',
            ext: '.html'
          }
        ]
      }
    }
    // docco: {
    //   slide: {
    //     src: ['src/example-cssjs/slide_simplesearch.js'],
    //     options: {
    //       output: 'docs/docco'
    //     }
    //   }
    // }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-remotefile');
  grunt.loadNpmTasks('grunt-daum-servicefarm');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-docco2');
  grunt.loadNpmTasks('grunt-markdown');

  // Default task.
  grunt.registerTask('remote', ['remotefile']);

  grunt.registerTask('concat_slide', ['concat:dist', 'concat:standalone']);
  grunt.registerTask('uglify_slide', ['uglify:dist', 'uglify:standalone']);
  grunt.registerTask('daum_servicefarm_slide', [
    'daum_servicefarm:path_merged',
    'daum_servicefarm:path_min',
    'daum_servicefarm:path_standalone_merged',
    'daum_servicefarm:path_standalone_min'
  ]);
  grunt.registerTask('default', ['remotefile', 'jshint', 'concat_slide', 'uglify_slide', 'daum_servicefarm_slide', 'docs']);
  grunt.registerTask('docs', ['yuidoc', 'markdown']);

  //extensions
  grunt.registerTask('pc_slide', ['jshint', 'concat:pc_slide', 'uglify:pc_slide', 'daum_servicefarm:pc_slide_merged', 'daum_servicefarm:pc_slide_min']);

};
