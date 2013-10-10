var kevoree = require('kevoree-library').org.kevoree,
    npm     = require('npm'),
    path    = require('path');

var compare = new kevoree.compare.DefaultModelCompare();

/**
 * GET /bootstrap
 * Returns a Kevoree bootstrap model for browser platform
 * @param req
 * @param res
 */
module.exports = function (req, res) {
    npm.load({}, function (err) {
        if (err) return res.send(500, 'Unable to load npm module');

        // load success
        npm.commands.install(['kevoree-node'], function installKevNodeCb(err) {
            if (err) return res.send(500, 'npm failed to install "kevoree-node" module');

            // installation succeeded
            var nodeJsModelJson = require(path.resolve('node_modules', 'kevoree-node', 'kevlib.json'));
            npm.commands.install(['kevoree-group-websocket'], function installKevWSGrpCb(err) {
                if (err) return res.send(500, 'npm failed to install "kevoree-group-websocket" module');

                var wsGrpModelJson = require(path.resolve('node_modules', 'kevoree-group-websocket', 'kevlib.json'));

            });
        });
    });
}