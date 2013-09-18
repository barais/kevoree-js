var AdaptationPrimitive = require('./AdaptationPrimitive'),
    RemoveTypeDef       = require('./RemoveTypeDef');

module.exports = AdaptationPrimitive.extend({
    toString: 'AddTypeDef',

    execute: function (_super, callback) {
        _super.call(this, callback);
        callback.call(this, null);
    },

    undo: function (_super, callback) {
        _super.call(this, callback);
        callback.call(this, null);
    }
});