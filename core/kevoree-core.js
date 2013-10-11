var Class           = require('pseudoclass'),
    kLib            = require('kevoree-library'),
    KevoreeLogger   = require('kevoree-commons').KevoreeLogger,
    async           = require('async'),
    EventEmitter    = require('events').EventEmitter;

/**
 * Kevoree Core
 *
 * @type {*}
 */
module.exports = Class({
    toString: 'KevoreeCore',

    /**
     * Core constructor
     */
    construct: function(modulesPath, logger) {
        this.log = (logger != undefined) ? logger : new KevoreeLogger(this.toString());

        this.factory = new kLib.org.kevoree.impl.DefaultKevoreeFactory();
        this.loader  = new kLib.org.kevoree.loader.JSONModelLoader();
        this.compare = new kLib.org.kevoree.compare.DefaultModelCompare();
        this.cloner  = new kLib.org.kevoree.cloner.DefaultModelCloner();

        this.currentModel   = null;
        this.deployModel    = null;
        this.models         = [];
        this.nodeName       = null;
        this.nodeInstance   = null;
        this.modulesPath    = modulesPath;
        this.bootstrapper   = null;
        this.intervalId     = null;

        this.emitter = new EventEmitter();
    },

    /**
     * Destruct core instance
     */
    destruct: function() {
        this.log.debug('Destructing...');
    },

    /**
     * Starts Kevoree Core
     * @param nodeName
     */
    start: function (nodeName) {
        if (nodeName == undefined || nodeName.length == 0) nodeName = "node0";

        this.nodeName = nodeName;
        this.currentModel = this.factory.createContainerRoot();

        // starting loop function
        this.intervalId = setInterval(function () {}, 1e8);

        this.log.info("Platform started: "+nodeName);

        this.emitter.emit('started');
    },

    setBootstrapper: function (bootstrapper) {
        this.bootstrapper = bootstrapper;
    },

    getBootstrapper: function () {
        return this.bootstrapper;
    },

    /**
     * Stops Kevoree Core
     */
    stop: function () {
        if (this.intervalId != undefined && this.intervalId != null) {
            if (this.nodeInstance != null) {
                this.nodeInstance.stop();
            }
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.currentModel = null;

            this.log.info("Platform stopped: "+this.nodeName);
            this.emitter.emit('stopped');
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
     */
    deploy: function (model) {
        if (model.findNodesByID(this.nodeName) == null) {
            this.emitter.emit('error', new Error('Deploy model failure: unable to find '+this.nodeName+' in given model'));
            return;

        } else {
            this.log.info('Deploy process started...');
            if (model != undefined && model != null) {
                // check if there is an instance currently running
                // if not, it will try to run it
                var core = this;
                this.checkBootstrapNode(model, function (err) {
                    if (err) {
                        core.emitter.emit('error', err);
                        return;
                    }

                    if (core.nodeInstance != undefined && core.nodeInstance != null) {
                        // given model is defined and not null
                        core.deployModel = core.cloner.clone(model, true);
                        core.deployModel.setRecursiveReadOnly();
                        var diffSeq = core.compare.diff(core.currentModel, core.deployModel);
                        var adaptations = core.nodeInstance.processTraces(diffSeq.traces, core.deployModel);
                        // list of adaptation commands retrieved
                        var cmdStack = [];

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

                        // execute each command synchronously
                        async.eachSeries(adaptations, executeCommand, function (err) {
                            if (err) {
                                // something went wrong while processing adaptations
                                core.log.error(err.message);

                                // rollback process
                                async.eachSeries(cmdStack, rollbackCommand, function (er) {
                                    if (er) {
                                        // something went wrong while rollbacking
                                        core.log.error(er.message);
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
                            core.log.debug("Model deployed successfully.");
                            // save old model
                            pushInArray(core.models, core.currentModel);
                            // set new model to be the current deployed one
                            core.currentModel = model; // do not give core.deployModel here because it is a readOnly model
                            // reset deployModel
                            core.deployModel = null;
                            // all good :)
                            core.emitter.emit('deployed', core.currentModel);
                            return;
                        });

                    } else {
                        core.emitter.emit('error', new Error("There is no instance to bootstrap on"));
                        return;
                    }
                });
            } else {
                this.emitter.emit('error', new Error("model is not defined or null. Deploy aborted."));
                return;
            }
        }
    },

    checkBootstrapNode: function (model, callback) {
        callback = callback || function () { console.warn('No callback defined for checkBootstrapNode(model, cb) in KevoreeCore'); };

        if (this.nodeInstance == undefined || this.nodeInstance == null) {
            this.log.info("Start '"+this.nodeName+"' bootstrapping...");
            var core = this;
            this.bootstrapper.bootstrapNodeType(this.nodeName, model, function (err, AbstractNode) {
                if (err) {
                    core.log.error(err.message);
                    callback(new Error("Unable to bootstrap '"+core.nodeName+"'! Start process aborted."));
                    return;
                }

                core.nodeInstance = new AbstractNode();
                core.nodeInstance.setKevoreeCore(core);
                core.nodeInstance.setName(core.nodeName);
                core.nodeInstance.start();

                core.log.info("'"+core.nodeName+"' instance started successfully");

                callback();
                return
            });

        } else {
            callback();
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
    },

    getDeployModel: function () {
        return this.deployModel;
    },

    getNodeName: function () {
        return this.nodeName;
    },

    on: function (event, callback) {
        this.emitter.addListener(event, callback);
    }
});

// utility function to ensure cached model list won't go over 10 items
var pushInArray = function pushInArray(array, model) {
    if (array.length == 10) this.shift();
    array.push(model);
}

// utility function to know if a model is currently already in the array
var containsModel = function containsModel(array, model) {
    return (array.indexOf(model) > -1);
}