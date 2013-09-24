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
     * @param nodeName
     * @param model
     * @param callback
     */
    bootstrapNodeType: function (nodeName, model, callback) {
        callback = callback || function () {};

        var nodeInstance = model.findNodesByID(nodeName);
        if (nodeInstance != undefined && nodeInstance != null) {
            var deployUnits = nodeInstance.typeDefinition.deployUnits;
            if (deployUnits.size() > 0) {
                // bootstrap node deploy unit
                this.bootstrap(deployUnits.get(0), callback);

            } else {
                callback.call(this, new Error("'"+nodeName+"' NodeType deploy units not found. Have you forgotten to merge nodetype library ?"));
                return;
            }
        } else {
            callback.call(this, new Error("Unable to find '"+nodeName+"' in the given model."));
            return;
        }
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
            this.log.warn("File resolver not implemented yet");

        } else if (deployUnit.url.startsWith(GIT)) {
//            this.resolvers[GIT][action](deployUnit, callback);
            this.log.warn("Git resolver not implemented yet");

        } else {
            this.resolvers[NPM][action](deployUnit, callback);
        }
    }
});