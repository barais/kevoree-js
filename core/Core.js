var Class = require('../lib/Class'),
    modelLib = require('../org.kevoree.model.js/target/js/org.kevoree.model.js.merged'),
    Logger = require('./util/Logger'),
    Util = require('./util/Util');

/**
 * Kevoree Core
 * @type {*}
 */
module.exports = Class({
    toString: 'Kevoree Core',

    /**
     * Core constructor
     */
    construct: function() {
        this.logger = new Logger(this);
        this.logger.log('initialization...');
        this.currentModel = null;
        this.factory = new modelLib.org.kevoree.impl.DefaultKevoreeFactory();
        this.compare = new modelLib.org.kevoree.compare.DefaultModelCompare();
    },

    /**
     * Destruct core instance
     */
    destruct: function() {
        this.logger.log('Destructing');
    },

    /**
     * Starts Kevoree Core
     */
    start: function () {
        this.currentModel = this.factory.createContainerRoot();
        this.logger.log('Started');
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
            for (var i=0; i < traces.size(); i++) {
                var trace = JSON.parse(traces.get(i));
                switch (trace.traceType) {
                    case modelLib.org.kevoree.modeling.api.util.ActionType.$SET:
                        this.logger.log("trace action type SET");
                        break;
                    case modelLib.org.kevoree.modeling.api.util.ActionType.$ADD:
                        this.logger.log("trace action type ADD");
                        break;
                    case modelLib.org.kevoree.modeling.api.util.ActionType.$REMOVE:
                        this.logger.log("trace action type REMOVE");
                        break;
                    case modelLib.org.kevoree.modeling.api.util.ActionType.$ADD_ALL:
                        this.logger.log("trace action type ADD ALL");
                        break;
                    case modelLib.org.kevoree.modeling.api.util.ActionType.$REMOVE_ALL:
                        this.logger.log("trace action type REMOVE ALL");
                        break;
                    case modelLib.org.kevoree.modeling.api.util.ActionType.$RENEW_INDEX:
                        this.logger.log("trace action type RENEW INDEX");
                        break;
                    default:
                        this.logger.log("default trace type");
                        break;
                }
            }
            // taking the given model as current one
            this.currentModel = model;

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

        this.logger.log('successfully deployed model');
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