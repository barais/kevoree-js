;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        npm                 = require('npm'),
        path                = require('path');

    /**
     * RemoveInstance Adaptation command
     *
     * @type {RemoveInstance} extends AdaptationPrimitive
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'RemoveInstance',

        setTypeDefinition: function (td) {
            this.typeDef = td;
        },

        /**
         *
         * @param _super AdaptationPrimitive parent
         * @param callback function: if this function first parameter != null it means that there is an error
         */
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