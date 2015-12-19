module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: ['public/js/components/{,**/}*.{js,jsx}'],
                tasks: ['browserify', 'uglify']
            },
            options: {
                nospawn: true
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'public/js/build/app.js',
                dest: 'public/js/build/app.min.js'
            }
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                },
                transform: [
                    ['reactify', {
                        'es6': true
                    }]
                ]
            },
            dist: {
                files: {
                    'public/js/build/app.js': ['public/js/components/app.jsx']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-browserify');

};