;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive');

    module.exports = AdaptationPrimitive.extend({
        toString: 'UpdateDictionary',

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