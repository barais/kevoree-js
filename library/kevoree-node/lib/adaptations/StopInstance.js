var AdaptationPrimitive = require('./AdaptationPrimitive'),
    StartInstance       = require('./StartInstance');

module.exports = AdaptationPrimitive.extend({
    toString: 'StopInstance',

    execute: function (_super, callback) {
        _super.call(this, callback);

        var kInstance = this.adaptModel.findByPath(this.trace.srcPath);

        var instance = this.mapper.getObject(kInstance.path());
        if (instance != undefined && instance != null) {
            instance.stop();
            callback.call(this, null);
            return;

        } else {
            callback.call(this, new Error("StopInstance error: unable to stop instance "+kInstance.path()));
            return;
        }
    },

    undo: function (_super, callback) {
        _super.call(this, callback);

        var cmd = new StartInstance(this.node, this.mapper, this.adaptModel, this.trace);
        cmd.execute(callback);

        return;
    }
});