var Class   = require('pseudoclass'),
    zlib    = require('zlib'),
    http    = require('http'),
    url     = require('url');
//    tar     = require('tar');

var HTTPBootstrapper = Class({
    toString: 'HTTPBootstrapper',

    construct: function (modulesPath) {
        this.modulesPath = modulesPath;
//        this.extracter = tar.Extract({ path: modulesPath});
    },

    bootstrapNodeType: function (nodeName, model, callback) {
        var scope = this;
        var options = {
            host: 'registry.npmjs.org',
            path: '/kevoree-node/-/kevoree-node-0.0.6.tgz',
            port: 80,
            headers: { 'accept-encoding': 'gzip,deflate' }
        };

        var req = new XMLHttpRequest();
        req.open('GET', 'http://registry.npmjs.org/kevoree-node/-/kevoree-node-0.0.6.tgz', false);
        req.send(null);
        if (req.status == 200) {
            console.log(req.responseText);
            callback();
        }

//        gunzip.on('error', callback);
//        this.extracter.on('error', callback);
//        this.extracter.on('end', onTarballExtracted);

//        var req = http.get(options);
//        if (!req) callback(new Error('Unable to create request to server'));
//
//        req.on('error', function (err) {
//            callback(err);
//        });
//
//        req.on('close', function (err) {
//            callback(new Error("Something went wrong while downloading taball"));
//        });
//
//        req.on('response', function (res) {
//            if (res.statusCode !== 200) {
//                callback(new Error(res.statusCode + ' downloading tarball'))
//                return;
//            }
//
//            res.pipe(zlib.deflate).pipe(process.stdout);
//        });
//
//        function onTarballExtracted() {
//            console.log("tarball successfully extracted");
//            callback();
//        }
    }
});

module.exports = HTTPBootstrapper;