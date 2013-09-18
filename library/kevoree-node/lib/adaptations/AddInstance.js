var AdaptationPrimitive = require('./AdaptationPrimitive'),
    RemoveInstance      = require('./RemoveInstance'),
    kevoree             = require('kevoree-library').org.kevoree,
    npm                 = require('npm'),
    path                = require('path');

/**
 * AddInstance Adaptation command
 *
 * @type {AddInstance} extends AdaptationPrimitive
 */
module.exports = AdaptationPrimitive.extend({
    toString: 'AddInstance',

    /**
     *
     * @param _super AdaptationPrimitive parent
     * @param callback function: if this function first parameter != null it means that there is an error
     */
    execute: function (_super, callback) {
        _super.call(this, callback);

        var kInstance = this.adaptModel.findByPath(this.trace.previousPath);

        // inception check
        if (kInstance && (kInstance.name != this.node.getName())) {
            // platform related check
            if (this.isRelatedToPlatform(kInstance)) {
                var moduleName = this.findSuitableModuleName(kInstance);
                if (moduleName != undefined && moduleName != null) {
                    var modulesPath = this.node.getKevoreeCore().getModulesPath();
                    var InstanceClass = require(path.resolve(modulesPath, 'node_modules', moduleName));

                    var instance = new InstanceClass();
                    instance.setKevoreeCore(this.node.getKevoreeCore());
                    instance.setName(kInstance.name);
                    instance.setNodeName(this.node.getName());

                    this.mapper.addEntry(kInstance.path(), instance);

                    callback.call(this, null);
                    return;

                } else {
                    // there is no DeployUnit installed for this instance TypeDefinition
                    callback.call(this, new Error("No DeployUnit installed for "+this.instance.path()));
                    return;
                }
            }
        }

        callback.call(this, null);
    },

    undo: function (_super, callback) {
        _super.call(this, callback);

        var cmd = new RemoveInstance(this.node, this.mapper, this.adaptModel, this.trace);
        cmd.execute(callback);
        return;
    },

    isRelatedToPlatform: function (kInstance) {
        if (isType(kInstance.typeDefinition, kevoree.impl.ComponentTypeImpl)) {
            // if parent is this node platform: it's ok
            return (kInstance.eContainer().name == this.node.getName());

        } else if (isType(kInstance.typeDefinition, kevoree.impl.ChannelTypeImpl)) {
            // if this channel has bindings with components hosted in this node platform: it's ok
            var bindings = kInstance.bindings;
            for (var i=0; i < bindings.size(); i++) {
                if (bindings.get(i).port.eContainer().eContainer().name == this.node.getName()) return true;
            }
            return false;

        } else if (isType(kInstance.typeDefinition, kevoree.impl.GroupTypeImpl)) {
            var subNodes = kInstance.subNodes;
            for (var i=0; i < subNodes.size(); i++) {
                if (subNodes.get(i).name == this.node.name) return true;
            }
            return false;

        } else if (isType(kInstance.typeDefinition, kevoree.impl.NodeTypeImpl)) {
            // TODO
            return true;
        }

        return false;
    },

    findSuitableModuleName: function (kInstance) {
        // change that to check if there is a JavascriptNode targetNodeType
        // in any of this typeDef deployUnits
        var du = kInstance.typeDefinition.deployUnits.get(0); // TODO OMG THIS IS UGLY
        return this.mapper.getObject(du.path());
    }
});

var isType = function (object, type) {
    if (object === null || object === undefined) {
        return false;
    }

    var proto = Object.getPrototypeOf(object);
    if (proto == type.proto) {
        return true;
    }
    return false;
}