var fs      = require('fs'),
    path    = require('path'),
    rimraf  = require('rimraf'),
    async   = require('async');

module.exports = function (grunt) {

    /**
     * install task - runs 'npm install' in each module directory
     */
    var installTask = function installTask() {
        var done = this.async();

        doInEachModule(done, function (modulePath, callback) {
            var exec = require('child_process').exec;
            exec('npm install', {cwd: modulePath}, function(err, stdout, stderr) {
                if (err) console.error(stderr);
                grunt.log.write(stdout);
                callback(null);
            });
        });
    }

    /**
     * clean task - runs 'rm -rf node_modules' in each module directory
     */
    var cleanTask = function cleanTask() {
        var done = this.async();

        doInEachModule(done, function (modulePath, callback) {
            var nodeModulesPath = path.resolve(modulePath, 'node_modules');
            rimraf(nodeModulesPath, function (err) {
                if (err) return callback(new Error("Unable to delete "+nodeModulesPath+" folder :/"));

                // deletion succeed
                grunt.log.write("Clean node_modules/ for %s", modulePath);
                callback(null, nodeModulesPath);
            });
        });
    }

    /**
     * version task - runs 'npm version [<newversion> | major | minor | patch | build]' in each module directory
     */
    var versionTask = function versionTask(option) {
        var done = this.async();

        option = option || 'patch';

        doInEachModule(done, function (modulePath, callback) {
            var exec = require('child_process').exec;
            exec('npm version '+option, {cwd: modulePath}, function(err, stdout, stderr) {
                if (err) grunt.log.error(stderr);
                grunt.log.write(stdout);
                callback(null);
            });
        });
    }

    /**
     * Call command(modulePath, callback) for each module directory in __dirname
     * - modulePath: /full/path/to/the/module
     * - callback: function to callback when done (with a param => error)
     * @param doneCallback
     * @param command
     */
    var doInEachModule = function doInEachModule(doneCallback, command) {
        // read current directory content
        fs.readdir(__dirname, function (err, files) {
            if (err) {
                grunt.log.error(err.message);
                return doneCallback();
            }

            var moduleTasks = [];

            // for each file in directory
            files.forEach(function (file) {
                moduleTasks.push(function (callback) {
                    // check if it is a directory
                    fs.lstat(file, function (err, stats) {
                        if (err) return callback(err);
                        if (stats.isDirectory()) {
                            // it's a directory : which means that this is a kevoree library
                            command(path.resolve(__dirname, file), callback);
                        } else return callback();
                    });
                });
            });


            async.series(moduleTasks, function (err, results) {
                if (err) grunt.log.error(err.message);
                doneCallback();
            });
        });
    }

    // tasks
    grunt.registerTask(
        'clean',
        "Runs 'rm -rf node_modules' in every module folder",
        cleanTask
    );
    grunt.registerTask(
        'install',
        "Runs 'npm install' in every module folder",
        installTask
    );
    grunt.registerTask(
        'version',
        "Runs 'npm version _argument_' (default argument is 'patch') in every module folder",
        versionTask
    );

    // task sets
    grunt.registerTask('default', ['clean', 'install']);
};