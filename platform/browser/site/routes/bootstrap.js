var kevoree          = require('kevoree-library').org.kevoree,
    kevNodeJSRuntime = require('kevoree-nodejs-runtime'),
    npm              = require('npm'),
    path             = require('path');

var compare    = new kevoree.compare.DefaultModelCompare();
var loader     = new kevoree.loader.JSONModelLoader();
var serializer = new kevoree.serializer.JSONModelSerializer();
var factory    = new kevoree.impl.DefaultKevoreeFactory();

/**
 * GET /bootstrap
 * Returns a Kevoree bootstrap model for browser platform
 * @param req
 * @param res
 */
module.exports = function (req, res) {
    try {
        // default nodename will be node0 if none given in GET request
        var nodename = req.query.nodename || "node0";

        // load npm
        npm.load({}, function (err) {
            if (err) return res.send(500, 'Unable to load npm module');

            // installation success
            npm.commands.install(['kevoree-group-websocket'], function installKevWSGrpCb(err) {
                if (err) return res.send(500, 'npm failed to install "kevoree-group-websocket" module');

                var wsGrpModelJson = require(path.resolve('node_modules', 'kevoree-group-websocket', 'kevlib.json'));
                var wsGrpModel = loader.loadModelFromString(JSON.stringify(wsGrpModelJson)).get(0);

                // create a node instance
                var nodeInstance = factory.createContainerNode();
                nodeInstance.name = nodename;
                nodeInstance.typeDefinition = wsGrpModel.findTypeDefinitionsByID('JavascriptNode');
                wsGrpModel.addNodes(nodeInstance);

                // create a group instance
                var grpInstance = factory.createGroup();
                grpInstance.name = "sync";
                grpInstance.typeDefinition = wsGrpModel.findTypeDefinitionsByID('WebSocketGroup');
                grpInstance.addSubNodes(nodeInstance);
                wsGrpModel.addGroups(grpInstance);

                // serialize new model
                return res.json({model: serializer.serialize(wsGrpModel)});
            });
        });
    } catch (err) {
        return res.send(500, "Unable to create bootstrap model: "+err.message);
    }
}