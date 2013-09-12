;(function () {
    var Class           = require('../lib/Class'),
        kLib            = require('../org.kevoree.model.js/target/js/org.kevoree.model.js.merged'),
        Bootstrapper    = require('./Bootstrapper'),
        Logger          = require('./util/Logger'),
        Util            = require('./util/Util');

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
            this.logger = new Logger(this);
            this.logger.log('initialization...');

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
            this.logger.log('Destructing');
        },

        /**
         * Starts Kevoree Core
         * @param nodeName
         * @param model
         */
        start: function (nodeName, model, callback) {
            this.logger.log("starting '"+nodeName+"' bootstrapping...");
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
            this.logger.log('Stopped');
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
            this.logger.log('deploy process started...');
            if (model != undefined && model != null) {
                if (this.nodeInstance != undefined && this.nodeInstance != null) {
                    // given model is defined and not null
                    var diffSeq = this.compare.diff(this.currentModel, model),
                        traces = diffSeq.get_traces();

                    // TODO
                    for (var i=0; i < traces.size(); i++) {
                        var trace = JSON.parse(traces.get(i));
                        var adaptation = this.nodeInstance.processTrace(trace, model);
                        (function (trace, adaptation, core) {
                            if (adaptation != undefined && adaptation != null) {
                                // adaptation is possible, try to do it
                                adaptation.execute(function (er) {
                                    if (er) {
                                        // something went wrong while executing adaptation primitive
                                        // TODO undo() and undo() all other adaptation primitives
                                        core.logger.error(er.message);
                                        core.logger.error('unable to execute AdaptionPrimitive '+adaptation.toString());
                                        return;
                                    }
                                    core.logger.log('Adaption '+adaptation.toString()+' succeed!');
                                });

                            } else {
                                // unable to process this trace, rollback
                                if (Util.callable(callback)) {
                                    callback.call(core, new Error("unable to process an adaptation trace. Rollback!"));
                                }
                                return;
                            }
                        })(trace, adaptation, this);
                    }
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
})();