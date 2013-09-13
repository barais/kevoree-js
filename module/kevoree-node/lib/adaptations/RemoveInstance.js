;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        AddInstance         = require('./AddInstance'),
        npm                 = require('npm'),
        path                = require('path');

    /**
     * RemoveInstance Adaptation command
     *
     * @type {RemoveInstance} extends AdaptationPrimitive
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'RemoveInstance',

        setInstance: function (instance) {
            this.instance = instance;
        },

        /**
         *
         * @param _super AdaptationPrimitive parent
         * @param callback function: if this function first parameter != null it means that there is an error
         */
        execute: function (_super, callback) {
            _super.call(this, callback);

            var instance = this.instanceManager.getInstance(this.instance.getName());
            if (instance != undefined && instance != null) {
                instance.stop();
                this.instanceManager.removeInstance(this.instance.getName());
                callback.call(this, null);
                return;
            }
        },

        undo: function (_super, callback) {
            _super.call(this, callback);

            var cmd = new AddInstance(this.node, this.instanceManager);
            cmd.setInstance(this.instance);
            cmd.execute(callback);
            return;
        }
    });
})();