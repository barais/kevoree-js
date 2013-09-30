var AdaptationPrimitive = require('./AdaptationPrimitive'),
    RemoveDeployUnit    = require('./RemoveDeployUnit');

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
            that       = this;

        if (!this.mapper.hasObject(deployUnit.path())) {
            var bootstrapper = that.node.getKevoreeCore().getBootstrapper();
            bootstrapper.bootstrap(deployUnit, function (err) {
                if (err) {
                    callback(err);
                    return;
                }

                // bootstrap success: add deployUnit path & packageName into mapper
                that.mapper.addEntry(deployUnit.path(), deployUnit.unitName);
                callback(null);
                return;
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