;(function () {
    var Class   = require('pseudoclass'),
        Log     = require('log'),
        Util    = require('./util/Util'),
        npm     = require('npm'),
        path    = require('path');

    /**
     *
     * @type {*}
     */
    module.exports = Class({
        toString: 'Bootstrapper',

        /**
         *
         */
        construct: function (modulesPath) {
            this.modulesPath = modulesPath;
            this.logger = new Log(this.toString());
        },

        /**
         *
         */
        destruct: function () {

        },

        /**
         *
         */
        init: function () {

        },

        /**
         *
         * @param nodeName
         * @param model
         * @param callback
         */
        bootstrapNodeType: function (nodeName, model, callback) {
            var nodeInstance = model.findNodesByID(nodeName);
            if (nodeInstance != undefined && nodeInstance != null) {
                var deployUnits = nodeInstance.getTypeDefinition().getDeployUnits();
                if (deployUnits.size() > 0) {
                    // TODO OMG THIS IS UGLY
                    // but I'm not sure yet how to handle DU > ask François
                    var packageName = deployUnits.get(0).getUnitName(),
                        packageVersion = deployUnits.get(0).getVersion(),
                        that = this;

                    npm.load({}, function (err) {
                        if (err) {
                            that.logger.debug('Unable to load npm module');
                            if (Util.callable(callback)) {
                                callback.call(this, new Error('Bootstrap failure'));
                                return;
                            }
                        }

                        // load success
                        npm.commands.install(that.modulesPath, [packageName+'@'+packageVersion], function (er) {
                            if (er) {
                                that.logger.debug('npm failed to install package %s:%s', packageName, packageVersion);
                                if (Util.callable(callback)) {
                                    callback.call(this, new Error("Bootstrap failure"));
                                    return;
                                }
                            }

                            // install sucess
                            if (Util.callable(callback)) {
                                var NodeClass = require(path.resolve(that.modulesPath, 'node_modules', packageName));
                                callback.call(this, null, NodeClass);
                                return;
                            }
                        });
                    });

                } else {
                    if (Util.callable(callback)) {
                        callback.call(this, new Error("'"+nodeName+"' NodeType deploy units not found. Have you forgotten to merge nodetype library ?"));
                        return;
                    }
                }
            } else {
                if (Util.callable(callback)) {
                    callback.call(this, new Error("Unable to find '"+nodeName+"' in the given model."));
                    return;
                }
            }
        }
    });
})();