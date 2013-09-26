var Bootstrapper    = require('kevoree-commons').Bootstrapper,
    KevoreeLogger   = require('./KevoreeBrowserLogger'),
    GITResolver     = require('./GITResolver');

var GIT     = 'git',
    FILE    = 'file';

var BrowserBootstrapper = Bootstrapper.extend({
    toString: 'BrowserBootstrapper',

    construct: function (modulesPath) {
        this.modulesPath = modulesPath;

        this.resolvers = {};
        this.resolvers[GIT] = new GITResolver(modulesPath);

        this.log = new KevoreeLogger(this.toString());
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
        deployUnit.url = deployUnit.url || '';

        if (deployUnit.url.startsWith(FILE)) {
//            this.resolvers[FILE][action](deployUnit, callback);
            callback(new Error("File resolver not implemented yet"));

        } else if (deployUnit.url.startsWith(GIT)) {
            this.resolvers[GIT][action](deployUnit, callback);

        } else {
            callback(new Error("BrowserBootstrapper only knows 'file' & 'git' url types. Can't process '"+deployUnit.url+"' url"));
        }
    }
});

module.exports = BrowserBootstrapper;