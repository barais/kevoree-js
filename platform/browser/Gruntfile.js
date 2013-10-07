var path = require('path');

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cli_pkg: grunt.file.readJSON('client/package.json'),
        uglify: {
            options: {
                banner: '/*! <%= cli_pkg.name %> browserified <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                // do not minify _super keyword because 'pseudoclass' needs it
                mangle: {
                    except: ['_super']
                }
            },
            build: {
                src: 'dist/<%= cli_pkg.name %>.browserify.js',
                dest: 'site/public/js/<%= cli_pkg.name %>.min.js'
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/<%= cli_pkg.name %>.browserify.js': ['client/<%= cli_pkg.name %>.js']
                },
                options: {
                    alias: [
                        // use browserify -r for kevoree-kotlin & kevoree-library
                        // to provide them only once in browser runtime
                        // When server will resolve a module with any of these dependence it will use
                        // those 'modularized' ones instead of reloaded them in a new bundle
                        path.resolve(__dirname, 'client', 'node_modules', 'kevoree-kotlin')+':kevoree-kotlin',
                        path.resolve(__dirname, 'client', 'node_modules', 'kevoree-library')+':kevoree-library'
                    ]
                }
            }
        },
        copy: {
            main: {
                src: 'dist/<%= cli_pkg.name %>.browserify.js',
                dest: 'site/public/js/<%= cli_pkg.name %>.min.js'
            }
        },
        express: {
            custom: {
                options: {
                    hostname: 'localhost',
                    port: 42042,
                    server: path.resolve('./server'),
                    watchChanges: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express');

    // Default task
    // => browserify runtime and output it to dist/
    // => uglify browserified runtime and move it to site/js/
    grunt.registerTask('default', ['browserify', 'uglify', 'express', 'express-keepalive']);

    // Dev task
    // => browserify runtime and output it to dist/
    // => copy file to site/js (without uglifying it = more readable in dev)
    grunt.registerTask('dev', ['browserify', 'copy', 'express', 'express-keepalive']);
};