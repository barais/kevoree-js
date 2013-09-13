;(function () {
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

        setInstance: function (inst) {
            this.instance = inst;
        },

        /**
         *
         * @param _super AdaptationPrimitive parent
         * @param callback function: if this function first parameter != null it means that there is an error
         */
        execute: function (_super, callback) {
            _super.call(this, callback);

            var moduleName = this.findSuitableModuleName(this.instance.getTypeDefinition());
            if (moduleName != undefined && moduleName != null) {
                var modulesPath = this.node.getKevoreeCore().getModulesPath();
                var InstanceClass = require(path.resolve(modulesPath, 'node_modules', moduleName));
                var instance = new InstanceClass();
                this.instanceManager.addInstance(this.instance.getName(), instance);
                instance.start();
                callback.call(this, null);
                return;

            } else {
                // there is no DeployUnit installed for this instance TypeDefinition
                callback.call(this, new Error("No DeployUnit installed for "+this.instance.getTypeDefinition().getName()));
                return;
            }
        },

        undo: function (_super, callback) {
            _super.call(this, callback);

            var cmd = new RemoveInstance(this.node, this.instanceManager);
            cmd.setInstance(this.instance);
            cmd.execute(callback);
            return;
        },

        findSuitableModuleName: function (typeDef) {
            // change that to check if there is a JavascriptNode targetNodeType
            // in any of this typeDef deployUnits
            var du = this.instance.getTypeDefinition().getDeployUnits().get(0); // TODO OMG THIS IS UGLY
            return this.instanceManager.getDeployUnit(du.getGenerated_KMF_ID());
        }
    });
})();