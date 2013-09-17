var AdaptationPrimitive = require('./AdaptationPrimitive'),
    RemoveInstance      = require('./RemoveInstance'),
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

        var moduleName = this.findSuitableModuleName(kInstance);
        if (moduleName != undefined && moduleName != null) {
            var modulesPath = this.node.getKevoreeCore().getModulesPath();
            var InstanceClass = require(path.resolve(modulesPath, 'node_modules', moduleName));
            var instance = new InstanceClass();
            this.mapper.addEntry(kInstance.path(), instance);
            callback.call(this, null);
            return;

        } else {
            // there is no DeployUnit installed for this instance TypeDefinition
            callback.call(this, new Error("No DeployUnit installed for "+this.instance.path()));
            return;
        }
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
    }
});