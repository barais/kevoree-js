;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        StopInstance        = require('./StopInstance');

    module.exports = AdaptationPrimitive.extend({
        toString: 'StartInstance',

        setInstance: function (inst) {
            this.instance = inst;
        },

        execute: function (_super, callback) {
            _super.call(this, callback);

            var instance = this.instanceManager.getInstance(this.instance.getName());
            if (instance != undefined && instance != null) {
                instance.setKevoreeCore(this.node.getKevoreeCore());
                instance.start();
                callback.call(this, null);
                return;

            } else {
                callback.call(this, new Error("StartInstance error: unable to start instance "+this.instance.getName()));
                return;
            }
        },

        undo: function (_super, callback) {
            _super.call(this, callback);

            var cmd = new StopInstance(this.node, this.instanceManager);
            cmd.setInstance(this.instance);
            cmd.execute(callback);
            return;
        }
    });
})();