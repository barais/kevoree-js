module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cli_pkg: grunt.file.readJSON('client/package.json'),
        uglify: {
            options: {
                banner: '/*! <%= cli_pkg.name %> browserified <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= cli_pkg.name %>.browserify.js',
                dest: 'site/js/<%= cli_pkg.name %>.min.js'
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/<%= cli_pkg.name %>.browserify.js': ['client/<%= cli_pkg.name %>.js']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify']);

};