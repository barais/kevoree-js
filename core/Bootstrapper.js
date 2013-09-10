var Class = require('../lib/Class'),
    Logger = require('./util/Logger'),
    Util = require('./util/Util'),
    npm = require('npm');

/**
 *
 * @type {*}
 */
module.exports = Class({
    toString: 'Bootstrapper',

    /**
     *
     */
    construct: function () {
        this.logger = new Logger(this);
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
                console.log("Deploy Units:");
                for (var i=0; i < deployUnits.size(); i++) {
                    var packageName = deployUnits.get(i).getUnitName(),
                        packageVersion = deployUnits.get(i).getVersion(),
                        that = this;

                    npm.load({}, function (err) {
                        if (err) {
                            that.logger.log('Unable to load npm module');
                            if (Util.callable(callback)) {
                                callback.call(this, new Error('Bootstrap failure'));
                                return;
                            }
                        }

                        // load success
                        npm.commands.install([packageName+'@'+packageVersion], function (er) {
                            if (er) {
                                that.logger.log('npm failed to install package '+packageName+':'+packageVersion);
                                if (Util.callable(callback)) {
                                    callback.call(this, new Error("Bootstrap failure"));
                                    return;
                                }
                            }

                            // install sucess
                            if (Util.callable(callback)) {
                                callback.call(this, null, {
                                    startNode: function () {
                                        console.log("TODO: not implemented yet!");
                                    }
                                });
                                return;
                            }
                        });
                    });
                }
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