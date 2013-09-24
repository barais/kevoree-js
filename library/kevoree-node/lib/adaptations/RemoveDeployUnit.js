var AdaptationPrimitive = require('./AdaptationPrimitive'),
    AddDeployUnit       = require('./AddDeployUnit');

/**
 * RemoveDeployUnit Adaptation
 *
 * @type {RemoveDeployUnit} extend AdaptationPrimitive
 */
module.exports = AdaptationPrimitive.extend({
    toString: 'RemoveDeployUnit',

    execute: function (_super, callback) {
        _super.call(this, callback);

        var deployUnit  = this.adaptModel.findByPath(this.trace.previousPath),
            that        = this;

        var bootstrapper = this.node.getKevoreeCore().getBootstrapper();
        bootstrapper.uninstall(deployUnit, function (err) {
            if (err) {
                callback(err);
                return;
            }

            that.mapper.removeEntry(deployUnit.path());
            callback(null);
            return;
        });
    },

    undo: function (_super, callback) {
        _super.call(this, callback);

        var cmd = new AddDeployUnit(this.node, this.mapper, this.adaptModel, this.trace);
        cmd.execute(callback);

        return;
    }
});