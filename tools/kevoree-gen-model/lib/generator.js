var fs                = require('fs'),
    path              = require('path'),
    KevoreeEntity     = require('kevoree-entities').KevoreeEntity,
    AbstractChannel   = require('kevoree-entities').AbstractChannel,
    AbstractComponent = require('kevoree-entities').AbstractComponent,
    AbstractGroup     = require('kevoree-entities').AbstractGroup,
    AbstractNode      = require('kevoree-entities').AbstractNode,
    async             = require('async'),
    genComponent      = require('./genComponent'),
    genChannel        = require('./genChannel'),
    genGroup          = require('./genGroup'),
    genNode           = require('./genNode'),
    kevoree           = require('kevoree-library').org.kevoree;

var quiet = false;

/**
 *
 * @param dirPath
 * @param callback
 */
var generator = function generator(dirPath, quiet_, callback) {
    if (dirPath == undefined) throw new Error("dirPath undefined");

    quiet = quiet_;

    // get every file path recursively
    walk(dirPath, ['node_modules'], function (err, files) {
        var factory = new kevoree.impl.DefaultKevoreeFactory();
        var model = factory.createContainerRoot();
        var tasks = [];
        files.forEach(function (file) {
            tasks.push(function (taskCallback) {
                processFile(file, model, function (err) {
                    if (err) {
                        taskCallback(err);
                        return;
                    }

                    taskCallback();
                });
            });
        });

        // execute each tasks asynchronously
        async.parallel(tasks, function (err) {
            if (err) {
                return callback(err);
            }

            // each file has been processed successfully
            callback(null, model);
        });
    });
};

/**
 * Recursively walk through a directory tree filling a "files" array
 * with all the files encountered during the walk (excluding those
 * given in the "excludes" param array)
 * On error or when its job is done it will call the third argument.
 * So this is supposed to be a function that has 2 arguments (err, files)
 * If "err" is defined = something went wrong
 * If "err" undefined = woot, you have all the files in the "files" array argument
 *
 * @param dir root dir to walk through
 * @param excludes array of files/directory/names to exclude from results (do not give a full path, just filename or directory name)
 * @param done callback(err, files)
 */
var walk = function(dir, excludes, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);

        // readdir success
        var pending = list.length;
        if (!pending) return done(null, results);

        // process excludes
        list.diff(excludes);
        pending = list.length;
        if (!pending) return done(null, results);

        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, excludes, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    if (getExtension(file) == '.js') {
                        results.push(file);
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

var processFile = function (file, model, callback) {
    try {
        var Class = require(file);

        if (typeof Class == 'function') {
            var obj = new Class();
            if (obj instanceof KevoreeEntity) {
                // this Class is a KevoreeEntity
                console.log("\nProcessing:\n\tFile: '%s'", file);
                if      (obj instanceof AbstractComponent) genComponent(obj, model, callback);
                else if (obj instanceof AbstractChannel)   genChannel(obj, model, callback);
                else if (obj instanceof AbstractGroup)     genGroup(obj, model, callback);
                else if (obj instanceof AbstractNode)      genNode(obj, model, callback);

            } else {
                // this is not the Class you are looking for
                if (!quiet) console.log("\nIgnored:\n\tFile: '%s'\n\tReason: Not a KevoreeEntity", file);
                return callback();
            }
        }
    } catch (e) {
        if (!quiet) console.log("\nIgnored:\n\tFile: '%s'\n\tReason: Unable to create a new object\n\tError: %s", file, e.message);
        return callback();
    }
}

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

/**
 * Removes elements from the given array parameter from the array
 * var files = ['index.js', 'node_modules', 'README.md'];
 * var excludes = ['node_modules'];
 * files.diff(excludes) => ['index.js', 'README.md'];
 *
 * @param array elements to remove from array
 */
Array.prototype.diff = function diff(array) {
    for (var i in array) {
        do {
            var index = this.indexOf(array[i]);
            // if item is in 'this' array: remove it
            if (index > -1) this.splice(index, 1);
            // keep doing this until there is no more array[i] item in 'this' array
        } while (index > -1);
    }
}

module.exports = generator;