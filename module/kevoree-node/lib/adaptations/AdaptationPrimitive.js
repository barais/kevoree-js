;(function () {
    var Class   = require('pseudoclass'),
        log     = require('npmlog'),

        TAG     = 'AdaptationPrimitive';

    /**
     * Abstract AdaptationPrimitive command
     *
     * @param node JavascriptNode context
     * @param manager InstanceManager to handle deployUnit & instance refs
     * @type {AdaptationPrimitive}
     */
    module.exports = Class({
        toString: TAG,

        /**
         * Construct an AdaptationPrimitive object
         * @param node KevoreeNode platform
         * @param manager InstanceManager
         */
        construct: function (node, manager) {
            log.heading = 'kevoree';

            this.node = node;
            this.instanceManager = manager;
        },

        /**
         * Executes adaption primitive logics
         * @param callback Function(err, [args]) if err != null => something went wrong
         */
        execute: function (callback) {
            if (callback == undefined || callback == null || typeof(callback) != 'function') {
                log.error(TAG, "Execute method need a callback function as last parameter");
                return;
            }
        },

        /**
         * Undo the process done by execute()
         */
        undo: function (callback) {
            if (callback == undefined || callback == null || typeof(callback) != 'function') {
                log.error(TAG, "Undo method need a callback function as last parameter");
                return;
            }
        }
    });
})();