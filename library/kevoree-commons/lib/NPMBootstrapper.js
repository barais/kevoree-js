var Class   = require('pseudoclass'),
    log     = require('npmlog'),
    npm     = require('npm'),
    path    = require('path'),

    TAG     = 'NPMBootstrapper';

/**
 *
 * @type {NPMBootstrapper}
 */
module.exports = Class({
    toString: TAG,

    /**
     *
     */
    construct: function (modulesPath) {
        this.modulesPath = modulesPath;
        log.heading = 'kevoree';
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
                // TODO OMG THIS IS UGLY
                // but I'm not sure yet how to handle DU > ask François
                var packageName = deployUnits.get(0).unitName,
                    packageVersion = deployUnits.get(0).version,
                    that = this;

                npm.load({}, function (err) {
                    if (err) {
                        log.error(TAG, 'Unable to load npm module');
                        callback.call(that, new Error('Bootstrap failure'));
                        return;
                    }

                    // load success
                    npm.commands.install(that.modulesPath, [packageName+'@'+packageVersion], function (er) {
                        if (er) {
                            log.error(TAG, 'npm failed to install package %s:%s', packageName, packageVersion);
                            callback.call(that, new Error("Bootstrap failure"));
                            return;
                        }

                        // install sucess
                        var AbstractNode = require(path.resolve(that.modulesPath, 'node_modules', packageName));
                        callback.call(that, null, AbstractNode);
                        return;
                    });
                });

            } else {
                callback.call(this, new Error("'"+nodeName+"' NodeType deploy units not found. Have you forgotten to merge nodetype library ?"));
                return;
            }
        } else {
            callback.call(this, new Error("Unable to find '"+nodeName+"' in the given model."));
            return;
        }
    }
});