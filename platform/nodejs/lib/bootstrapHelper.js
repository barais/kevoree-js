var npm     = require('npm'),
    path    = require('path'),
    kevoree = require('kevoree-library').org.kevoree;

var compare    = new kevoree.compare.DefaultModelCompare();
var loader     = new kevoree.loader.JSONModelLoader();
var factory    = new kevoree.impl.DefaultKevoreeFactory();

module.exports = function (nodename, callback) {
    try {
        // load npm
        npm.load({}, function (err) {
            if (err) return callback(err);

            // installation success
            npm.commands.install(['kevoree-group-websocket'], function installKevWSGrpCb(err) {
                if (err) return callback(err);

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

                callback(null, wsGrpModel);
            });
        });
    } catch (err) {
        return callback(err);
    }
};