var AdaptationPrimitive = require('./AdaptationPrimitive'),
    AddBinding          = require('./AddBinding');

module.exports = AdaptationPrimitive.extend({
    toString: 'RemoveBinding',

    execute: function (_super, callback) {
        _super.call(this, callback);
        callback.call(this, null);
    },

    undo: function (_super, callback) {
        _super.call(this, callback);
        callback.call(this, null);
    }
});