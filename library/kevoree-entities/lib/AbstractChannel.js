;(function () {
    var KevoreeEntity = require('./KevoreeEntity');

    /**
     * AbstractChannel entity
     *
     * @type {AbstractChannel} extends KevoreeEntity
     */
    module.exports = KevoreeEntity.extend({
        toString: 'AbstractChannel'
    });

})();