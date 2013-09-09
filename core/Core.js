var Class = require('../lib/Class'),
    modelLib = require('../org.kevoree.model.js/target/js/org.kevoree.model.js.merged'),
    Logger = require('./Logger');

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
        this.logger.log('Constructing');
        this.currentModel = null;
        this.factory = new modelLib.org.kevoree.impl.DefaultKevoreeFactory();
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
        this.logger.log(this.currentModel);
    },

    /**
     * Stops Kevoree Core
     */
    stop: function () {

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
        this.logger.log('Kevoree Core deploy model : process started...');
        // TODO
        this.logger.log('Kevoree Core deploy model : success!');
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