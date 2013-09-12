;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive');

    /**
     * Noop Adaptation command
     * @param trace diff trace associated to this command
     * @param model model to deploy
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'Noop Adaptation',

        execute: function (callback) {
            if (callback == undefined || callback == null || typeof(callback) != 'function') {
                console.error("AddInstance error: execute method need a callback function as last parameter");
                return;
            }
            callback.call(this, null);
        },

        undo: function () {}
    });
})();