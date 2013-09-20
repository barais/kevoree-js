var KevoreeEntity   = require('./KevoreeEntity'),
    Port            = require('./Port'),
    log             = require('npmlog'),

    TAG = 'AbstractComponent';

/**
 * AbstractComponent entity
 *
 * @type {AbstractComponent} extends KevoreeEntity
 */
module.exports = KevoreeEntity.extend({
    toString: TAG,

    construct: function () {
        log.heading = 'kevoree';
        this.inputs = {};
        this.outputs = {};
    },

    addInputPort: function (name, callback) {
        if (this.inputs[name]) this.inputs[name].setCallback(callback);
        else log.error(TAG, "Unable to find provided port '%s' (AddBinding failed?)", name);
    },

    getOutputPort: function (name) {
        return this.outputs[name];
    },

    addInternalInputPort: function (port) {
        this.inputs[port.getName()] = port;
    },

    addInternalOutputPort: function (port) {
        this.outputs[port.getName()] = port;
    }
});