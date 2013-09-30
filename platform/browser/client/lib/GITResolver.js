var Resolver        = require('kevoree-commons').Resolver,
    KevoreeLogger   = require('./KevoreeBrowserLogger');

var GITResolver = Resolver.extend({
    toString: 'GITResolver',

    construct: function (modulesPath) {
        this.modulesPath = modulesPath;
        this.log = new KevoreeLogger(this.toString());
    },

    resolve: function (deployUnit, callback) {
        var resolver = this;
        callback(new Error("GitResolver: Not implemented yet"));
        // TODO
    },

    uninstall: function (deployUnit, callback) {
        var resolver = this;
        callback(new Error("GitResolver: Not implemented yet"));
        // TODO
    }
});

module.exports = GITResolver;