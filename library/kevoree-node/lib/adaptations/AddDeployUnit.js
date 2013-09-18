var AdaptationPrimitive = require('./AdaptationPrimitive'),
    RemoveDeployUnit    = require('./RemoveDeployUnit'),
    npm                 = require('npm');

/**
 * AddDeployUnit Adaptation command
 *
 * @type {AddDeployUnit} extends AdaptationPrimitive
 */
module.exports = AdaptationPrimitive.extend({
    toString: 'AddDeployUnit',

    /**
     *
     * @param _super AdaptationPrimitive parent
     * @param callback function: if this function first parameter != null it means that there is an error
     */
    execute: function (_super, callback) {
        _super.call(this, callback);

        var deployUnit = this.adaptModel.findByPath(this.trace.previousPath),
            packageName     = deployUnit.unitName,
            packageVersion  = deployUnit.version,
            that            = this;

        if (!this.mapper.hasObject(deployUnit.path())) {
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
                        callback.call(that, new Error('AddDeployUnit failed to install '+packageName+':'+packageVersion));
                        return;
                    }

                    // install success: add deployUnit typeDef name & packageName into instanceManager map
                    that.mapper.addEntry(deployUnit.path(), packageName);
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

        var cmd = new RemoveDeployUnit(this.node, this.mapper, this.adaptModel, this.trace);
        cmd.execute(callback);

        return;
    }
});