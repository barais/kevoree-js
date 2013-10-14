var AdaptationPrimitive = require('./AdaptationPrimitive'),
    RemoveInstance      = require('./RemoveInstance'),
    kevoree             = require('kevoree-library').org.kevoree,
    Kotlin              = require('kevoree-kotlin'),
    Port                = require('kevoree-entities').Port,
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
                    try {
                        var InstanceClass = require(moduleName);
                        var instance = new InstanceClass();
                        instance.setKevoreeCore(this.node.getKevoreeCore());
                        instance.setName(kInstance.name);
                        instance.setPath(kInstance.path());
                        instance.setNodeName(this.node.getName());

                        this.doSpecificTypeProcess(kInstance);

                        this.mapper.addEntry(kInstance.path(), instance);

                        callback(null);
                        return;

                    } catch (e) {
                        callback(e);
                        return;
                    }

                } else {
                    // there is no DeployUnit installed for this instance TypeDefinition
                    callback(new Error("No DeployUnit installed for "+this.instance.path()));
                    return;
                }
            }
        }

        callback(null);
    },

    undo: function (_super, callback) {
        _super.call(this, callback);

        var cmd = new RemoveInstance(this.node, this.mapper, this.adaptModel, this.trace);
        cmd.execute(callback);
        return;
    },

    findSuitableModuleName: function (kInstance) {
        // change that to check if there is a JavascriptNode targetNodeType
        // in any of this typeDef deployUnits
        var du = kInstance.typeDefinition.deployUnits.get(0); // TODO OMG THIS IS UGLY
        return this.mapper.getObject(du.path());
    },

    doSpecificTypeProcess: function (kInstance) {
        if (Kotlin.isType(kInstance.typeDefinition, kevoree.impl.ComponentTypeImpl)) {
            var provided = kInstance.provided;
            for (var i=0; i < provided.size(); i++) {
                this.mapper.addEntry(provided.get(i).path(), new Port(provided.get(i).portTypeRef.name, provided.get(i).path()));
            }

            var required = kInstance.required;
            for (var i=0; i < required.size(); i++) {
                this.mapper.addEntry(required.get(i).path(), new Port(required.get(i).portTypeRef.name, required.get(i).path()));
            }

        } else if (Kotlin.isType(kInstance.typeDefinition, kevoree.impl.ChannelTypeImpl)) {

        } else if (Kotlin.isType(kInstance.typeDefinition, kevoree.impl.GroupTypeImpl)) {


        } else if (Kotlin.isType(kInstance.typeDefinition, kevoree.impl.NodeTypeImpl)) {

        }
    }
});