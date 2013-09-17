;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        AddDeployUnit       = require('./AddDeployUnit'),
        npm                 = require('npm');

    /**
     * RemoveDeployUnit Adaptation
     *
     * @type {RemoveDeployUnit} extend AdaptationPrimitive
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'RemoveDeployUnit',

        execute: function (_super, callback) {
            _super.call(this, callback);

            var deployUnit      = this.adaptModel.findByPath(this.trace.previousPath),
                packageName     = deployUnit.unitName,
                packageVersion  = deployUnit.version,
                that            = this;

            // uninstall deploy unit
            npm.load({}, function (err) {
                if (err) {
                    // npm load error
                    callback.call(that, new Error('RemoveDeployUnit error: unable to load npm module'));
                    return;
                }

                // load success
                var modulesPath = that.node.getKevoreeCore().getModulesPath();
                npm.commands.uninstall(modulesPath, [packageName+'@'+packageVersion], function (er) {
                    if (er) {
                        // failed to load package:version
                        callback.call(that, new Error('RemoveDeployUnit failed to uninstall '+packageName+':'+packageVersion));
                        return;
                    }

                    // uninstall success: add deployUnit typeDef name & packageName into instanceManager map
                    that.mapper.removeEntry(deployUnit.path());
                    callback.call(that, null);
                    return;
                });
            });
        },

        undo: function (_super, callback) {
            _super.call(this, callback);

            var cmd = new AddDeployUnit(this.node, this.mapper, this.adaptModel, this.trace);
            cmd.execute(callback);

            return;
        }
    });
})();