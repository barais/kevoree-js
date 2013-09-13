;(function () {
    var Class   = require('../Class'),
        Log     = require('log');

    /**
     * Abstract AdaptationPrimitive command
     *
     * @param node JavascriptNode context
     * @param manager InstanceManager to handle deployUnit & instance refs
     * @type {AdaptationPrimitive}
     */
    module.exports = Class({
        toString: 'AdaptationPrimitive',

        /**
         * Construct an AdaptationPrimitive object
         * @param node KevoreeNode platform
         * @param manager InstanceManager
         */
        construct: function (node, manager) {
            this.logger = new Log(this.toString());
            this.node = node;
            this.instanceManager = manager;
        },

        /**
         * Executes adaption primitive logics
         * @param callback Function(err, [args]) if err != null => something went wrong
         */
        execute: function (callback) {
            if (callback == undefined || callback == null || typeof(callback) != 'function') {
                this.logger.error("Execute method need a callback function as last parameter");
                return;
            }
        },

        /**
         * Undo the process done by execute()
         */
        undo: function (callback) {
            if (callback == undefined || callback == null || typeof(callback) != 'function') {
                this.logger.error("Undo method need a callback function as last parameter");
                return;
            }
        }
    });
})();