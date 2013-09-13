;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        StartInstance       = require('./StartInstance');

    module.exports = AdaptationPrimitive.extend({
        toString: 'StopInstance',

        setInstance: function (inst) {
            this.instance = inst;
        },

        execute: function (_super, callback) {
            _super.call(this, callback);

            var instance = this.instanceManager.getInstance(this.instance.getName());
            if (instance != undefined && instance != null) {
                instance.stop();
                callback.call(this, null);
                return;

            } else {
                callback.call(this, new Error("StopInstance error: unable to stop instance "+this.instance.getName()));
                return;
            }
        },

        undo: function (_super, callback) {
            _super.call(this, callback);

            var cmd = new StartInstance(this.node, this.instanceManager);
            cmd.setInstance(this.instance);
            cmd.execute(callback);
            return;
        }
    });
})();