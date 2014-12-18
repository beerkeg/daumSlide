module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        remotefile: {
            ua_parser: {
                url: 'http://s1.daumcdn.net/svc/original/U03/cssjs/userAgent/userAgent-1.0.14.js',
                dest: 'javascripts/external/ua_parser.js'
            },
            gesture: {
                url: 'http://m1.daumcdn.net/svc/original/U03/cssjs/gesture/gesture-2.0.0-pre14.merged.js',
                dest: 'javascripts/external/gesture.js'
            },
            slide: {
                url: 'http://s1.daumcdn.net/svc/attach/U03/cssjs/slide/slide-2.0.0-pre23.merged.js',
                dest: 'javascripts/external/slide.js'
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './dist/dependency',
                    install: true,
                    verbose: false,
                    cleanTargetDir: true,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        concat: {
            external: {
                src: [
                    '<%= bower.install.options.targetDir %>/simple-inheritance/class.js',
                    '<%= bower.install.options.targetDir %>/simple-observer/observer.js',
                    '<%= bower.install.options.targetDir %>/simple-event/event.js',
                    '<%= remotefile.ua_parser.dest %>',
                    '<%= remotefile.gesture.dest %>',
                    '<%= remotefile.slide.dest %>',
                    'javascripts/search_image_loader.js',
                    'javascripts/introduce.js'
                ],
                dest: 'javascripts/external.merged.js',
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
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('remote', ['bower:install', 'remotefile']);

    // Default task.
    grunt.registerTask('build', ['remote', 'concat:external', 'uglify:external']);
    grunt.registerTask('default', ['remote', 'concat:external', 'uglify:external']);
};