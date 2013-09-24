var Class = require('pseudoclass');

/**
 * Resolver API
 * @type {Resolver}
 */
var Resolver = Class({
    toString: 'Resolver',

    /**
     *
     * @param deployUnit Kevoree DeployUnit
     * @param callback(err, Class)
     */
    resolve: function (deployUnit, callback) {},

    uninstall: function (deployUnit, callback) {}
});

module.exports = Resolver;