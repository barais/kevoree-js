var kevoree   = require('kevoree-library').org.kevoree,
    pullModel = require('kevoree-model-sync').pullModel,
    pushModel = require('kevoree-model-sync').pushModel,
    config    = require('./../config'),
    path      = require('path');

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
  var model = loader.loadModelFromString(JSON.stringify(require('./../model.json'))).get(0);

  pullModel(model, config.nodeJSPlatform.nodeName, function (err, serverModel) {
    if (err) return res.send(500, 'Unable to pull model from server-side platform.');

    // let's be really cautious about
    var nodename = req.query.nodename || 'node'+parseInt(Math.random()*1e10); // name from request or random generated
    var nodeInst = serverModel.findNodesByID(nodename);
    if (nodeInst) nodename = 'node'+parseInt(Math.random()*1e10); // this name was already taken: roll the dices again

    // create a node instance for the new client
    var nodeInstance = factory.createContainerNode();
    nodeInstance.name = nodename;
    nodeInstance.typeDefinition = serverModel.findTypeDefinitionsByID('JavascriptNode');

    // add this instance to model
    serverModel.addNodes(nodeInstance);

    // connect this node to server-side group
    var groupInstance = serverModel.findGroupsByID(config.nodeJSPlatform.groupName); // TODO if people mess up with server-side group name, we are doomed
    groupInstance.addSubNodes(nodeInstance);

    // push new created model to server-side platform
    pushModel(serverModel, config.nodeJSPlatform.nodeName, function (err) {
      if (err) return res.send(500, 'Unable to push model to server-side platform.');

      // serialize updated model
      var modelStr = serializer.serialize(serverModel);

      // send serialized model back
      return res.json({model: modelStr});
    });
  });
}