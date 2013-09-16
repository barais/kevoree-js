;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        RemoveBinding       = require('./RemoveBinding');

    module.exports = AdaptationPrimitive.extend({
        toString: 'AddBinding',

        execute: function (_super, callback) {
            _super.call(this, callback);
            callback.call(this, null);
        },

        undo: function (_super, callback) {
            _super.call(this, callback);
            callback.call(this, null);
        }
    });
})();