var path = require('path'),
    fs   = require('fs'),
    gen  = require('./lib/generator');

var dirPath = path.resolve(process.argv[2] || '.');

stats = fs.lstat(dirPath, function (err, stats) {
    if (err) {
        console.log("'"+dirPath+"' does not exist. Aborting process.");
        process.exit(1);
    }

    if (stats.isFile()) {
        // it is a file
        dirPath = path.resolve(dirPath, '..'); // use this file's folder as root folder
        gen(dirPath, genCallback);

    } else if (stats.isDirectory()) {
        gen(dirPath, genCallback);

    } else {
        console.log("You should give the path to a folder in arugment.");
        process.exit(1);
    }
});

var genCallback = function genCallback(err) {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    console.log("gen success");
}