;(function () {
    var KevoreeEntity = require('./KevoreeEntity');

    /**
     * AbstractNode entity
     *
     * @type {AbstractNode} extends KevoreeEntity
     */
    module.exports = KevoreeEntity.extend({
        toString: 'AbstractNode',

        getModelEntity: function () {
            return this.kCore.getCurrentModel().findNodesByID(this.name);
        }
    });

})();