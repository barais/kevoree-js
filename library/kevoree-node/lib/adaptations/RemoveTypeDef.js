var AdaptationPrimitive = require('./AdaptationPrimitive'),
    AddTypeDef          = require('./AddTypeDef');

module.exports = AdaptationPrimitive.extend({
    toString: 'RemoveTypeDef',

    execute: function (_super, callback) {
        _super.call(this, callback);
        callback.call(this, null);
    },

    undo: function (_super, callback) {
        _super.call(this, callback);
        callback.call(this, null);
    }
});