module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        remotefile: {
            daumtools: {
                url: 'http://m1.daumcdn.net/dcombo/v1' +
                '?daumtools/0.0.1/event.js' +
                '&daumtools/0.0.1/extend.js',
                dest: 'javascripts/external/daumtools.js'
            },
            simple_inheritance: {
                url: 'http://s1.daumcdn.net/svc/original/U03/cssjs/bower/1.0.1/class.js',
                dest: 'javascripts/external/class.js'
            },
            simple_observer: {
                url: 'http://s1.daumcdn.net/svc/original/U03/cssjs/bower/1.0.0/observer.js',
                dest: 'javascripts/external/observer.js'
            },
            ua_parser: {
                url: 'http://s1.daumcdn.net/svc/original/U03/cssjs/userAgent/userAgent-1.0.14.js',
                dest: 'javascripts/external/ua_parser.js'
            },
            gesture: {
                url: 'http://m1.daumcdn.net/svc/original/U03/cssjs/gesture/gesture-2.0.0-pre13.merged.js',
                dest: 'javascripts/external/gesture.js'
            },
            slide: {
                url: 'http://s1.daumcdn.net/svc/attach/U03/cssjs/slide/slide-2.0.0-pre18.merged.js',
                dest: 'javascripts/external/slide.js'
            }
        },
        concat: {
            external: {
                src: [
                    '<%= remotefile.daumtools.dest %>',
                    '<%= remotefile.simple_inheritance.dest %>',
                    '<%= remotefile.simple_observer.dest %>',
                    '<%= remotefile.ua_parser.dest %>',
                    '<%= remotefile.gesture.dest %>',
                    '<%= remotefile.slide.dest %>'
                ],
                dest: 'javascripts/external/external.merged.js',
                separator: "\n\n"
            }
        },
        uglify: {
            external: {
                src: ['<%= concat.external.dest %>'],
                dest: 'javascripts/external.min.js'
            }
        }
    });

    // Load local tasks.
    grunt.loadNpmTasks('grunt-remotefile');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('build', ['remotefile', 'concat:external', 'uglify:external']);
    grunt.registerTask('default', ['remotefile', 'concat:external', 'uglify:external']);
};