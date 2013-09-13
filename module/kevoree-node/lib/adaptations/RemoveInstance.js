;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        npm                 = require('npm'),
        path                = require('path');

    /**
     * RemoveInstance Adaptation command
     * @param trace diff trace associated to this command
     * @param model model to deploy
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'RemoveInstance',

        setTypeDefinition: function (td) {
            this.typeDef = td;
        },

        execute: function (_super, callback) {
            _super.call(this, callback);
            // TODO
        },

        undo: function (_super, callback) {
            _super.call(this, callback);
            // TODO
            callback.call(this, null);
        }
    });
})();