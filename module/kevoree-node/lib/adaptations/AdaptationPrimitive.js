;(function () {
    var Class = require('../Class');


    module.exports = Class({
        toString: 'Adaptation Primitive',
        construct: function (node) {
            this.node = node;
        }
    });
})();