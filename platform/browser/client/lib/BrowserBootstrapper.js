var Bootstrapper    = require('kevoree-commons').Bootstrapper,
    KevoreeLogger   = require('./KevoreeBrowserLogger'),
    GITResolver     = require('./GITResolver'),
    NPMResolver     = require('./NPMResolver');

var GIT     = 'git',
    FILE    = 'file',
    NPM     = 'npm';

var BrowserBootstrapper = Bootstrapper.extend({
    toString: 'BrowserBootstrapper',

    construct: function (modulesPath) {
        this.modulesPath = modulesPath;

        this.resolvers = {};
        this.resolvers[GIT] = new GITResolver(modulesPath);
        this.resolvers[NPM] = new NPMResolver(modulesPath);

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
                return callback(new Error("'"+deployUnit.unitName+"' bootstrap failed!"));
            }

            // install success
            return callback(null, EntityClass);
        });
    },

    uninstall: function (deployUnit, callback) {
        var bootstrapper = this;
        this.resolver('uninstall', deployUnit, function (err) {
            if (err) {
                bootstrapper.log.error(err.message);
                return callback(new Error("'"+deployUnit.unitName+"' uninstall failed!"));
            }

            // uninstall success
            return callback(null);
        });
    },

    resolver: function (action, deployUnit, callback) {
        var url = deployUnit.url || '';

        if (url.startsWith(FILE)) {
//            this.resolvers[FILE][action](deployUnit, callback);
            return callback(new Error("File resolver not implemented yet"));

        } else if (url.startsWith(GIT)) {
            this.resolvers[GIT][action](deployUnit, callback);

        } else {
            this.resolvers[NPM][action](deployUnit, callback);
        }
    }
});

module.exports = BrowserBootstrapper;