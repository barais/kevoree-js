var AdaptationPrimitive = require('./AdaptationPrimitive'),
    AddInstance         = require('./AddInstance');

/**
 * RemoveInstance Adaptation command
 *
 * @type {RemoveInstance} extends AdaptationPrimitive
 */
module.exports = AdaptationPrimitive.extend({
    toString: 'RemoveInstance',

    /**
     *
     * @param _super AdaptationPrimitive parent
     * @param callback function: if this function first parameter != null it means that there is an error
     */
    execute: function (_super, callback) {
        _super.call(this, callback);

        var kInstance = this.adaptModel.findByPath(this.trace.previousPath);

        var instance = this.mapper.getObject(kInstance.path());
        if (instance != undefined && instance != null) {
            this.mapper.removeEntry(kInstance.path());
            callback.call(this, null);
            return;

        } else {
            callback.call(this, new Error("RemoveInstance error: unable to remove instance "+kInstance.path()));
            return;
        }
    },

    undo: function (_super, callback) {
        _super.call(this, callback);

        var cmd = new AddInstance(this.node, this.mapper, this.adaptModel, this.trace);
        cmd.execute(callback);
        return;
    }
});