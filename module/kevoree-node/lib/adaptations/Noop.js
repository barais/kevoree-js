;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive');

    /**
     * Noop Adaptation command
     * @param trace diff trace associated to this command
     * @param model model to deploy
     * @type {Noop}
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'Noop',

        execute: function (_super, callback) {
            _super.call(this, callback);
            callback.call(this, null);
        },

        undo: function (_super) {
            _super.call(this);
        }
    });
})();