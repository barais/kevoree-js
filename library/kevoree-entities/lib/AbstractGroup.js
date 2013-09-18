;(function () {
    var KevoreeEntity = require('./KevoreeEntity');

    /**
     * AbstractGroup entity
     *
     * @type {AbstractGroup} extends KevoreeEntity
     */
    module.exports = KevoreeEntity.extend({
        toString: 'AbstractGroup',

        getModelEntity: function () {
            return this.kCore.getCurrentModel().findGroupsByID(this.name);
        }
    });

})();