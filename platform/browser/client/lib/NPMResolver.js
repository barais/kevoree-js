var Resolver        = require('kevoree-commons').Resolver,
    KevoreeLogger   = require('./KevoreeBrowserLogger'),
    FileSystem      = require('kevoree-commons').FileSystem;

/**
 * Retrieves module content from zip from server
 * @type {NPMResolver}
 */
var NPMResolver = Resolver.extend({
    toString: 'NPMResolver',

    construct: function (modulesPath) {
        this.modulesPath = modulesPath;
        this.log = new KevoreeLogger(this.toString());
    },

    resolve: function (deployUnit, callback) {
        var resolver = this;

        // forward resolving request to server
        $.ajax({
            type: 'GET',
            url: '/resolve',
            data: {
                type: deployUnit.type,
                name: deployUnit.unitName,
                version: deployUnit.version
            },
            success: function (resp) {
                // server response contains a zipPath & name of the requested module package
                // (retrieved server-side from npm registry)
                installZip(resp.zipPath, resp.zipName, function (err, KClass) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    // unpacking tarball to browser filesystem done
                    callback(null, KClass);
                });
            },
            error: function (err) {
                if (err.responseText.length == 0) {
                    err.responseText = "Kevoree Runtime server was not able to process '/resolve' request ("+deployUnit.unitName+":"+deployUnit.version+")";
                }
                callback(new Error(err.responseText));
            }
        });
    },

    uninstall: function (deployUnit, callback) {
        var resolver = this;
        callback(new Error("NPMResolver: Not implemented yet"));
        // TODO
    }
});

/**
 * Download and install zip locally in browser file system
 * @param zipPath zip file path on server
 * @param zipName zip name
 * @param callback
 */
var installZip = function installZip(zipPath, zipName, callback) {
    var fsapi = new FileSystem();
    // create a local file system of 50Mb
    fsapi.getFileSystem(5*1024*1024*1024, function (err, fs) {
        // create a root directory called "kev_libraries" in this fs
        fs.root.getDirectory('kev_libraries', { create: true, exclusive: false }, function (rootDir) {
            // create a new directory for the current zip
            rootDir.getDirectory(zipName, { create: true, exclusive: false }, function (zipDir) {
                // read zip content
                zip.createReader(new zip.HttpReader(zipPath), function(reader) {
                    reader.getEntries(function(entries) {
                        // process all entries from the zip
                        processEntries(entries, zipDir);
                    });
                }, function(error) {
                    // onerror callback
                });
            }, fsErrorHandler);
        }, fsErrorHandler);
    });
    callback(new Error("NPMResolver: unpack tarball not implemented yet"));
}

/**
 * Only processes 'file' entries in zip
 * @param entries
 * @param zipDir
 */
var processEntries = function processEntries(entries, zipDir) {
    var fileEntries = [];

    // check entries type (dir, file)
    for (var i in entries) {
        if (entries[i].directory == false) fileEntries.push(entries[i]);
    }

    console.log("File entries", fileEntries);
    // process file entries
    for (var i in fileEntries) processFileEntry(fileEntries[i], zipDir);
}

/**
 * Will recursively create needed directories for the file entry given
 * if its path is nested.
 * Lets say the entry has 'foo/bar/baz.ext' file path, this will try
 * to create a new directory foo, then bar, then call a file create into that 'bar' directory
 * @param entry
 * @param zipDir
 */
var processFileEntry = function processFileEntry(entry, zipDir) {
    getDir(entry.filename, zipDir, function (dir) {
        var splittedName = entry.filename.split('/'),
            cleanName    = splittedName[splittedName.length-1];
       dir.getFile(cleanName, {create: true, exclusive: false}, function(fileEntry) {
           // Create a FileWriter object for our FileEntry (log.txt).
           fileEntry.createWriter(function(fileWriter) {

               fileWriter.onwriteend = function(e) {
                   console.log('Write completed: '+entry.filename);

               };

               fileWriter.onerror = function(e) {
                   console.log('Write failed: ' + e.toString());
               };

               entry.getData(new zip.TextWriter(), function(text) {
                   // Create a new Blob and write it to log.txt.
                   var blob = new Blob([text], {type: 'text/plain'});
                   fileWriter.write(blob);

               }, function(current, total) {
                   // onprogress callback
               });

           });

       }, fsErrorHandler);
    }, fsErrorHandler);
}

/**
 * Recursively creates directory tree according to given path
 * @param path foo/bar/baz.ext
 * @param dir root directory to start directories creation (always need a starting point !)
 * @param callback
 */
var getDir = function getDir(path, dir, callback, errorCallback) {
    if (!dir || dir == null) {
        errorCallback(new Error('getDir(path, dir, callback, errorCallback) error: "dir" is null'));
        return;
    }

    var splittedPath = path.split('/');
    if (splittedPath.length == 1) {
        callback(dir);

    } else {
        dir.getDirectory(splittedPath[0], {create: true, exclusive: false}, function (newDir) {
            getDir(splittedPath.slice(1, splittedPath.length).join('/'), newDir, callback);
        }, fsErrorHandler);
    }
}

var fsErrorHandler = function fsErrorHandler(e) {
       var msg = '';
       switch (e.code) {
         case FileError.QUOTA_EXCEEDED_ERR:
           msg = 'QUOTA_EXCEEDED_ERR';
           break;
         case FileError.NOT_FOUND_ERR:
           msg = 'NOT_FOUND_ERR';
           break;
         case FileError.SECURITY_ERR:
           msg = 'SECURITY_ERR';
           break;
         case FileError.INVALID_MODIFICATION_ERR:
           msg = 'INVALID_MODIFICATION_ERR';
           break;
         case FileError.INVALID_STATE_ERR:
           msg = 'INVALID_STATE_ERR';
           break;
         default:
           console.error(e);
           return;
       };

       console.log('Error: ' + msg);
}

module.exports = NPMResolver;