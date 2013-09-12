;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        npm                 = require('npm'),
        path                = require('path');

    /**
     * AddInstance Adaptation command
     * @param trace diff trace associated to this command
     * @param model model to deploy
     * @type {AddInstance}
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'AddInstance Adaptation',

        setInstance: function (inst) {
            this.instance = inst;
        },

        execute: function (_super, callback) {
            _super.call(this, callback);

            var moduleName = this.instanceManager.getDeployUnit(this.instance.getTypeDefinition().getDeployUnits().get(0).getGenerated_KMF_ID()); // TODO OMG THIS IS UGLY : change that to chack if there is JavascriptNode in deployUnit targetNodeType
            if (moduleName != undefined && moduleName != null) {
                // this TypeDef module has already been installed
                // we can create instance
                var modulesPath = this.node.getKevoreeCore().getModulesPath();
                var InstanceClass = require(path.resolve(modulesPath, 'node_modules', moduleName));
                var instance = new InstanceClass();
                this.instanceManager.addInstance(this.instance.getName(), instance);
                instance.start();
                callback.call(this, null);
                return;

            } else {
                // this TypeDef module hasn't been installed yet : try to do it
                var AddDeployUnit = require('./AddDeployUnit');
                var cmd = new AddDeployUnit(this.node, this.instanceManager);
                var that = this;

                cmd.setDeployUnit(this.instance.getTypeDefinition().getDeployUnits().get(0)); // TODO OMG THIS IS UGLY : change that to check if there is JavascriptNode in deployUnit targetNodeType
                cmd.execute(function (er) {
                    if (er) {
                        // something went wrong while trying to install deployUnit
                        callback.call(that, new Error(er.message));
                        return;
                    }

                    // deployUnit successfully installed
                    // execute AddInstance code
                    that.execute(callback);
                    return;
                });
            }
        },

        undo: function (_super) {
            _super.call(this);
            // TODO
        }
    });
})();