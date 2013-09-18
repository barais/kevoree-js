;(function () {
    var KevoreeEntity = require('./KevoreeEntity');

    /**
     * AbstractComponent entity
     *
     * @type {AbstractComponent} extends KevoreeEntity
     */
    module.exports = KevoreeEntity.extend({
        toString: 'AbstractComponent',

        getModelEntity: function () {
            return this.kCore.getCurrentModel().findComponentsByID(this.name);
        }
    });

})();