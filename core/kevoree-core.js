;(function () {
    var Class           = require('pseudoclass'),
        kLib            = require('kevoree-library'),
        log             = require('npmlog'),
        async           = require('async'),
        EventEmitter    = require('events').EventEmitter,

        Util            = require('./util/Util'),
        Bootstrapper    = require('./lib/Bootstrapper'),

        TAG             = 'KevoreeCore';

    /**
     * Kevoree Core
     *
     * @type {*}
     */
    module.exports = Class({
        toString: TAG,

        /**
         * Core constructor
         */
        construct: function(modulesPath) {
            log.heading = 'kevoree';
            log.silly(TAG, 'Initialization...');

            this.factory = new kLib.org.kevoree.impl.DefaultKevoreeFactory();
            this.compare = new kLib.org.kevoree.compare.DefaultModelCompare();

            // create a new empty model container
            this.currentModel = this.factory.createContainerRoot();
            this.models = [];
            this.nodeName = null;
            this.nodeInstance = null;
            this.modulesPath = modulesPath;
            this.bootstrapper = new Bootstrapper(modulesPath);
            this.intervalId = null;

            this.emitter = new EventEmitter();
        },

        /**
         * Destruct core instance
         */
        destruct: function() {
            log.silly(TAG, 'Destructing...');
        },

        /**
         * Starts Kevoree Core
         * @param nodeName
         * @param model
         */
        start: function (nodeName, model) {
            if (this.intervalId == null) {
                log.info(TAG, "Starting '%s' bootstrapping...", nodeName);
                pushModel(this.models, this.currentModel);
                this.currentModel = model;
                if (nodeName != undefined && nodeName != null) {
                    this.nodeName = nodeName;
                    var that = this;
                    this.bootstrapper.bootstrapNodeType(this.nodeName, this.currentModel, function (err, AbstractNode) {
                        if (err) {
                            log.error(TAG, err.stack);
                            that.emitter.emit('error', new Error("Unable to bootstrap '"+nodeName+"'! Start process aborted."));
                        }
                        that.nodeInstance = new AbstractNode();
                        that.nodeInstance.setKevoreeCore(that);
                        that.nodeInstance.start();

                        // starting loop function
                        that.intervalId = setInterval(function () {}, 10);

                        that.emitter.emit('started');
                        return;
                    });

                } else {
                    this.emitter.emit('error', new Error("Unable to bootstrap Kevoree Core: 'nodeName' & 'groupName' are null or undefined"));
                    return;
                }
            } else {
                this.emitter.emit('error', new Error("Core already started"));
                return;
            }
        },

        /**
         * Stops Kevoree Core
         */
        stop: function () {
            if (this.intervalId != undefined && this.intervalId != null) {
                if (this.nodeInstance != null) {
                    this.nodeInstance.stopNode();
                }
                clearInterval(this.intervalId);
                this.intervalId = null;
                this.currentModel = null;
                log.silly(TAG, 'Stopped');
            }
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
        deploy: function (model, uuid) {
            if (this.intervalId != null) {
                log.info(TAG, 'Deploy process started...');
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
                                log.error(TAG, err.stack);

                                // rollback process
                                async.eachSeries(cmdStack, rollbackCommand, function (er) {
                                    if (er) {
                                        // something went wrong while rollbacking
                                        log.error(TAG, er.stack);
                                        core.emitter.emit('error', new Error("Something went wrong while rollbacking..."));
                                        return;
                                    }

                                    // rollback succeed
                                    core.emitter.emit('rollback');
                                    return;
                                });

                                core.emitter.emit('error', new Error("Something went wrong while processing adaptations. Rollback"));
                                return;
                            }

                            // adaptations succeed : woot
                            log.verbose(TAG, "Model deployed successfully.");
                            // save old model
                            pushModel(core.models, core.currentModel);
                            // set new model to be the current one
                            core.currentModel = model;
                            // all good :)
                            core.emitter.emit('deployed', core.currentModel);
                            return;
                        });

                    }
                } else {
                    this.emitter.emit('error', new Error("model is not defined or null. Deploy aborted."));
                    return;
                }

            } else {
                // there is no platform started yet, deploy impossible
                // TODO auto-start ?
                this.emitter.emit('error', new Error("There is no platform started yet. Deploy impossible."));
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
        },

        on: function (event, callback) {
            this.emitter.addListener(event, callback);
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