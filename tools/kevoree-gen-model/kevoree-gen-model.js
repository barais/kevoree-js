var path = require('path'),
    fs   = require('fs'),
    gen  = require('./lib/generator'),
    argv = require('optimist')
            .usage('Usage: $0 -p path/to/your/project [-q]')
            .demand(['p'])
            .default('p', '.')
            .default('q', false)
            .argv;

var dirPath = path.resolve(argv.p);

stats = fs.lstat(dirPath, function (err, stats) {
    if (err) {
        console.log("'"+dirPath+"' does not exist. Aborting process.");
        process.exit(1);
    }

    if (stats.isFile()) {
        // it is a file
        dirPath = path.resolve(dirPath, '..'); // use this file's folder as root folder
        gen(dirPath, argv.q, genCallback);

    } else if (stats.isDirectory()) {
        gen(dirPath, argv.q, genCallback);

    } else {
        console.log("You should give the path to a folder in argument.");
        process.exit(1);
    }
});

var genCallback = function genCallback(err, model) {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    console.log("gen done");
}