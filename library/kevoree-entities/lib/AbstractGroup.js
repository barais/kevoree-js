var KevoreeEntity = require('./KevoreeEntity');

/**
 * AbstractGroup entity
 *
 * @type {AbstractGroup} extends KevoreeEntity
 */
module.exports = KevoreeEntity.extend({
    toString: 'AbstractGroup',

    updateModel: function (model) {
        this.kCore.deploy(model);
    },

    push: function (model, targetNodeName) {},

    pull: function (targetNodeName, callback) {}
});