var fs      = require('fs'),
    path    = require('path'),
    rimraf  = require('rimraf');

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({});


    grunt.registerTask('clean', "Run 'rm -rf node_modules' in every module folder", function() {
        var exec = require('child_process').exec;
        var cb = this.async();
        // read current directory content
        fs.readdir(__dirname, function (err, files) {
            // for each file in directory
            files.forEach(function (file) {
                // check if it is a directory
                fs.lstat(file, function (err, stats) {
                    if (stats.isDirectory()) {
                        // it's a directory : which means that this is a kevoree library
                        // remove node_modules folder
                        var nodeModulesPath = path.resolve(__dirname, file, 'node_modules');
                        rimraf(nodeModulesPath, function (err) {
                            if (err) console.error("Unable to delete %s folder :/", nodeModulesPath);

                            // deletion succeed => clean npm install
                            exec('', {cwd: path.resolve(__dirname, file)}, function (err, stdout, stderr) {
                                console.log(stdout);
                                cb();
                            });
                        });
                    }
                });
            });
        });
    });

    grunt.registerTask('install', "Run 'npm install' in every module folder", function() {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('echo "potato"', {cwd: '.'}, function(err, stdout, stderr) {
            console.log(stdout);
            cb();
        });
    });

    // default task
    grunt.registerTask('default', ['clean', 'install']);
};