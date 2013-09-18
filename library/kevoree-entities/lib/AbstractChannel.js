;(function () {
    var KevoreeEntity = require('./KevoreeEntity');

    /**
     * AbstractChannel entity
     *
     * @type {AbstractChannel} extends KevoreeEntity
     */
    module.exports = KevoreeEntity.extend({
        toString: 'AbstractChannel',

        getModelEntity: function () {
            return this.kCore.getCurrentModel().findHubsByID(this.name);
        }
    });

})();