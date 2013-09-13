;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        npm                 = require('npm'),
        path                = require('path');

    /**
     * AddDeployUnit Adaptation command
     * @param trace diff trace associated to this command
     * @param model model to deploy
     * @type {AddDeployUnit}
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'AddDeployUnit',

        setDeployUnit: function (du) {
            this.deployUnit = du;
        },

        execute: function (_super, callback) {
            _super.call(this, callback);

            var packageName     = this.deployUnit.getUnitName(),
                packageVersion  = this.deployUnit.getVersion(),
                that            = this;

            if (!this.instanceManager.hasDeployUnit(this.deployUnit.getGenerated_KMF_ID())) {
                // install deployUnit
                npm.load({}, function (err) {
                    if (err) {
                        // npm load error
                        callback.call(that, new Error('AddDeployUnit error: unable to load npm module'));
                        return;
                    }

                    // load success
                    var modulesPath = that.node.getKevoreeCore().getModulesPath();
                    npm.commands.install(modulesPath, [packageName+'@'+packageVersion], function (er) {
                        if (er) {
                            // failed to load package:version
                            callback.call(that, new Error('AddDeployUnit failed to load '+packageName+':'+packageVersion));
                            return;
                        }

                        // install success: add deployUnit typeDef name & packageName into instanceManager map
                        that.instanceManager.addDeployUnit(that.deployUnit.getGenerated_KMF_ID(), packageName);
                        callback.call(that, null);
                        return;
                    });
                });
            } else {
                // this deploy unit is already installed, move on
                callback.call(that, null);
                return;
            }
        },

        undo: function (_super, callback) {
            _super.call(this, callback);
            // TODO
            callback.call(this, null);
        }
    });
})();