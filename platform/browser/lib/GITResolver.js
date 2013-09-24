var Resolver    = require('kevoree-commons').Resolver;

var GITResolver = Resolver.extend({
    toString: 'GITResolver',

    construct: function (modulesPath) {
        this.modulesPath = modulesPath;
    },

    resolve: function (deployUnit, callback) {
        var resolver = this;

        // TODO
    },

    uninstall: function (deployUnit, callback) {
        var resolver = this;

        // TODO
    }
});

module.exports = GITResolver;