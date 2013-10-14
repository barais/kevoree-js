var kevoree          = require('kevoree-library').org.kevoree,
    npm              = require('npm'),
    path             = require('path');

var compare    = new kevoree.compare.DefaultModelCompare();
var loader     = new kevoree.loader.JSONModelLoader();
var serializer = new kevoree.serializer.JSONModelSerializer();
var factory    = new kevoree.impl.DefaultKevoreeFactory();

var serverModel = null;

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

      // create a node instance for new client
      var nodeInstance = factory.createContainerNode();
      nodeInstance.name = nodename;
      nodeInstance.typeDefinition = serverModel.findTypeDefinitionsByID('JavascriptNode');
      serverModel.addNodes(nodeInstance);

      // serialize new model
      var modelStr = serializer.serialize(serverModel);

      // send serialized model back
      return res.json({model: modelStr});

    } catch (err) {
      return res.send(500, "Unable to create bootstrap model: "+err.message);
    }
}