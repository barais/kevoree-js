var npm     = require('npm'),
  path    = require('path'),
  kevoree = require('kevoree-library').org.kevoree;

var compare    = new kevoree.compare.DefaultModelCompare();
var loader     = new kevoree.loader.JSONModelLoader();
var factory    = new kevoree.impl.DefaultKevoreeFactory();

var bootstrapModel = function bootstrapModel(modulesPath, nodename, groupname, callback) {
  var wsGrpModelJson = require(path.resolve(modulesPath, 'node_modules', 'kevoree-group-websocket', 'kevlib.json'));
  var wsGrpModel = loader.loadModelFromString(JSON.stringify(wsGrpModelJson)).get(0);

  // create a node instance
  var nodeInstance = factory.createContainerNode();
  nodeInstance.name = nodename;
  nodeInstance.typeDefinition = wsGrpModel.findTypeDefinitionsByID('JavascriptNode');
  wsGrpModel.addNodes(nodeInstance);

  // create a group instance
  var grpInstance = factory.createGroup();
  grpInstance.name = groupname;
  grpInstance.typeDefinition = wsGrpModel.findTypeDefinitionsByID('WebSocketGroup');
  grpInstance.dictionary = factory.createDictionary();
  var portVal = factory.createDictionaryValue();
  var portAttr = null;
  var attrs = wsGrpModel.findTypeDefinitionsByID('WebSocketGroup').dictionaryType.attributes.iterator();
  while (attrs.hasNext()) {
    var attr = attrs.next();
    if (attr.name == 'port') {
      portAttr = attr;
      break;
    }
  }
  portVal.attribute = portAttr;

  portVal.value = '8000';
  portVal.targetNode = nodeInstance;
  grpInstance.dictionary.addValues(portVal);
  grpInstance.addSubNodes(nodeInstance);
  wsGrpModel.addGroups(grpInstance);

  return callback(null, wsGrpModel);
}

module.exports = function (nodename, groupname, modulesPath, callback) {
  try {
    // try to bootstrapModel without downloading and installing module from npm
    bootstrapModel(modulesPath, nodename, groupname, callback);

  } catch (err) {
    // bootstrapping failed which means (probably) that module wasn't installed yet
    // so let's do it :D
    console.log("Unable to find DeployUnit (kevoree-group-websocket) locally: downloading & installing it...");
    // load npm
    npm.load({}, function (err) {
      if (err) return callback(err);

      // installation success
      npm.commands.install(modulesPath, ['kevoree-group-websocket'], function installKevWSGrpCb(err) {
        if (err) return callback(err);

        bootstrapModel(modulesPath, nodename, groupname, callback);
      });
    });
  }
};