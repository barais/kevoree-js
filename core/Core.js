;(function () {
    var Class           = require('../lib/Class'),
        kLib            = require('../org.kevoree.model.js/target/js/org.kevoree.model.js.merged'),
        Bootstrapper    = require('./Bootstrapper'),
        Log             = require('log'),
        Util            = require('./util/Util'),
        async           = require('async');

    /**
     * Kevoree Core
     *
     * @type {*}
     */
    module.exports = Class({
        toString: 'Kevoree Core',

        /**
         * Core constructor
         */
        construct: function(modulesPath) {
            this.logger = new Log(this.toString());
            this.logger.debug('Initialization...');

            this.factory = new kLib.org.kevoree.impl.DefaultKevoreeFactory();
            this.compare = new kLib.org.kevoree.compare.DefaultModelCompare();

            // TODO keep track of models in a list
            // create a new empty model container
            this.currentModel = this.factory.createContainerRoot();
            this.models = [];
            this.nodeName = null;
            this.nodeInstance = null;
            this.modulesPath = modulesPath;
            this.bootstrapper = new Bootstrapper(modulesPath);
        },

        /**
         * Destruct core instance
         */
        destruct: function() {
            this.logger.debug('Destructing');
        },

        /**
         * Starts Kevoree Core
         * @param nodeName
         * @param model
         */
        start: function (nodeName, model, callback) {
            this.logger.debug("Starting '%s' bootstrapping...", nodeName);
            pushModel(this.models, this.currentModel);
            this.currentModel = model;
            if (nodeName != undefined && nodeName != null) {
                this.nodeName = nodeName;
                var that = this;
                this.bootstrapper.bootstrapNodeType(this.nodeName, this.currentModel, function (err, NodeClass) {
                    if (err) {
                        that.logger.error(err.message);
                        if (Util.callable(callback)) {
                            callback.call(this, new Error("Unable to bootstrap '"+nodeName+"'! Start process aborted."));
                        }
                    }
                    that.nodeInstance = new NodeClass();
                    that.nodeInstance.setKevoreeCore(that);
                    that.nodeInstance.startNode();
                    if (Util.callable(callback)) callback.call(this, null);
                });

            } else {
                if (Util.callable(callback)) {
                    callback.call(this, new Error("Unable to bootstrap Kevoree Core: 'nodeName' & 'groupName' are null or undefined"));
                }
            }
        },

        /**
         * Stops Kevoree Core
         */
        stop: function () {
            this.currentModel = null;
            this.logger.debug('Stopped');
        },

        /**
         * Save model to hdd
         */
        saveModel: function () {
            // TODO
        },

        /**
         * Compare current with model
         * Get traces and call command (that can be redefined)
         *
         * @param model
         * @param uuid
         * @param callback
         */
        deploy: function (model, uuid, callback) {
            this.logger.debug('Deploy process started...');
            if (model != undefined && model != null) {
                if (this.nodeInstance != undefined && this.nodeInstance != null) {
                    // given model is defined and not null
                    var diffSeq = this.compare.diff(this.currentModel, model),
                        traces = diffSeq.get_traces();

                    var adaptations = this.nodeInstance.processTraces(traces, model);

                    // list of adaptation commands retrieved
                    var core = this,
                        cmdStack = [];

                    // executeCommand: function that save cmd to stack and executes it
                    var executeCommand = function executeCommand(cmd, iteratorCallback) {
                        // save the cmd to be processed in a stack using unshift
                        // in order to add the last processed cmd at the beginning of the array
                        // => cmdStack[0] = more recently executed cmd
                        cmdStack.unshift(cmd);

                        // execute cmd
                        cmd.execute(function (err) {
                            if (err) {
                                iteratorCallback(err);
                                return;
                            }

                            // adaptation succeed
                            iteratorCallback();
                        });
                    };

                    // rollbackCommand: function that calls undo() on cmds in the stack
                    var rollbackCommand = function rollbackCommand(cmd, iteratorCallback) {
                        cmd.undo(function (err) {
                            if (err) {
                                iteratorCallback(err);
                                return;
                            }

                            // undo succeed
                            iteratorCallback();
                        });
                    };

                    async.eachSeries(adaptations, executeCommand, function (err) {
                        if (err) {
                            // something went wrong while processing adaptations
                            core.logger.error(err.message);

                            // rollback process
                            async.eachSeries(cmdStack, rollbackCommand, function (er) {
                                if (er) {
                                    // something went wrong while rollbacking
                                    core.logger.error(er.message);
                                    callback.call(core, new Error("Something went wrong while rollbacking..."));
                                    return;
                                }

                                // rollback succeed
                                callback.call(core, null);
                                return;
                            });

                            callback.call(core, new Error("Something went wrong while processing adaptations. Rollback"));
                            return;
                        }

                        // adaptations succeed : woot
                        core.logger.debug("Model deployed successfully.");
                        // save old model
                        pushModel(core.models, core.currentModel);
                        // set new model to be the current one
                        core.currentModel = model;
                        // all good :)
                        callback.call(core, null);
                        return;
                    });

                }
            } else {
                if (Util.callable(callback)) {
                    callback.call(this, new Error("model is not defined or null. Deploy aborted."));
                }
                return;
            }
        },

        /**
         * Put core in readonly mode
         */
        lock: function() {
            // TODO
        },

        /**
         * Put core in read/write mode
         */
        unlock: function() {
            // TODO
        },

        getCurrentModel: function () {
            return this.currentModel;
        },

        getPreviousModel: function () {
            var model = null;
            if (this.models.length > 0) model = this.models[this.models.length-1];
            return model;
        },

        getPreviousModels: function () {
            return this.models;
        },

        getModulesPath: function () {
            return this.modulesPath;
        }
    });

    // utility function to ensure cached model list won't go over 10 items
    var pushModel = function pushModel(array, model) {
        if (array.length == 10) this.shift();
        array.push(model);
    }

    // utility function to know if a model is currently already in the array
    var containsModel = function containsModel(array, model) {
        return (array.indexOf(model) > -1);
    }

    var doAdaptation = function doAdaptation(err) {

    }
})();