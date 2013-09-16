;(function () {
    var KevoreeEntity = require('./KevoreeEntity');

    /**
     * AbstractComponent entity
     *
     * @type {AbstractComponent} extends KevoreeEntity
     */
    module.exports = KevoreeEntity.extend({
        toString: 'AbstractComponent'
    });

})();