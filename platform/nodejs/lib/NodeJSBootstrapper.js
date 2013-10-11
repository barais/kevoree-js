var Bootstrapper    = require('kevoree-commons').Bootstrapper,
    KevoreeLogger   = require('kevoree-commons').KevoreeLogger,
    NPMResolver     = require('./NPMResolver'),
    path            = require('path');

var FILE    = 'file',
    GIT     = 'git',
    NPM     = 'npm';

/**
 *
 * @type {NPMBootstrapper}
 */
module.exports = Bootstrapper.extend({
    toString: "NodeJSBootstrapper",

    /**
     *
     */
    construct: function (modulesPath) {
        this.log = new KevoreeLogger(this.toString());

        this.resolvers = {};
        this.resolvers[NPM] = new NPMResolver(modulesPath);
    },

    /**
     *
     * @param deployUnit
     * @param callback
     */
    bootstrap: function (deployUnit, callback) {
        // --- Resolvers callback
        var bootstrapper = this;
        this.resolver('resolve', deployUnit, function (err, EntityClass) {
            if (err) {
                bootstrapper.log.error(err.message);
                callback(new Error("'"+deployUnit.unitName+"' bootstrap failed!"));
                return;
            }

            // install success
            callback(null, EntityClass);
            return;
        });
    },

    uninstall: function (deployUnit, callback) {
        var bootstrapper = this;
        this.resolver('uninstall', deployUnit, function (err) {
            if (err) {
                bootstrapper.log.error(err.message);
                callback(new Error("'"+deployUnit.unitName+"' uninstall failed!"));
                return;
            }

            // uninstall success
            callback(null);
            return;
        });
    },

    resolver: function (action, deployUnit, callback) {
        var url = deployUnit.url || '';

        if (url.startsWith(FILE)) {
//            this.resolvers[FILE][action](deployUnit, callback);
            this.log.warn("File resolver not implemented yet");

        } else if (url.startsWith(GIT)) {
//            this.resolvers[GIT][action](deployUnit, callback);
            this.log.warn("Git resolver not implemented yet");

        } else {
            this.resolvers[NPM][action](deployUnit, callback);
        }
    }
});