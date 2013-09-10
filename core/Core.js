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
        this.nodeName = null;
        this.nodeInstance = null;
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
    start: function (nodeName, model) {
        this.logger.log("starting '"+nodeName+"' bootstrapping...");
        this.currentModel = model; // TODO improve that by saving old model or smthg like that
        if (nodeName != undefined && nodeName != null) {
            this.nodeName = nodeName;
            var that = this;
            this.bootstrapper.bootstrapNodeType(this.nodeName, this.currentModel, function (err, NodeClass) {
                if (err) {
                    that.logger.error(err.message);
                    that.logger.error("Unable to bootstrap '"+nodeName+"'! Start process aborted.");
                    return;
                }
                that.nodeInstance = new NodeClass();
                that.nodeInstance.startNode(); // TODO
            });

        } else {
            throw new Error("Unable to bootstrap Kevoree Core: 'nodeName' & 'groupName' are null or undefined");
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
    deploy: function(model, uuid, callback) {
        this.logger.log('deploy process started...');
        if (model != undefined && model != null) {
            // given model is defined and not null
            var traces = this.compare.diff(this.currentModel, model).get_traces();

            // TODO
            var tracesArray = [];
            for (var i=0; i < traces.size(); i++) {
                var trace = JSON.parse(traces.get(i));
                switch (trace.traceType) {
                    case kLib.org.kevoree.modeling.api.util.ActionType.$SET:
                        tracesArray.push("SET");
                        break;

                    case kLib.org.kevoree.modeling.api.util.ActionType.$ADD:
                        tracesArray.push("ADD");
                        break;

                    case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE:
                        tracesArray.push("REMOVE");
                        break;

                    case kLib.org.kevoree.modeling.api.util.ActionType.$ADD_ALL:
                        tracesArray.push("ADD ALL");
                        break;

                    case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE_ALL:
                        tracesArray.push("REMOVE ALL");
                        break;

                    case kLib.org.kevoree.modeling.api.util.ActionType.$RENEW_INDEX:
                        tracesArray.push("RENEW INDEX");
                        break;

                    default:
                        tracesArray.push("!UNKNOWN TRACE!");
                        break;
                }
            }
            // taking the given model as current one
            this.currentModel = model;
            this.logger.log('traces ['+tracesArray.join(', ')+']');
            this.logger.log('successfully deployed model');

            // check callback availability
            if (Util.callable(callback.success)) {
                callback.success.call(this, this.currentModel);
            } else {
                this.logger.error("callback parameter must be a function. Can't call it :/");
            }
        } else {
            if (Util.callable(callback.error)) {
                callback.error.call(this, "model is not defined or null. Deploy aborted.");
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
    }
});