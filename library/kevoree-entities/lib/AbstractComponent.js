var KevoreeEntity   = require('./KevoreeEntity'),
    Port            = require('./Port');

/**
 * AbstractComponent entity
 *
 * @type {AbstractComponent} extends KevoreeEntity
 */
module.exports = KevoreeEntity.extend({
    toString: 'AbstractComponent',

    construct: function () {
        this.inputs = {};
        this.outputs = {};
    },

    addInputPort: function (name, callback) {
        if (this.inputs[name]) this.inputs[name].setCallback(callback);
        else console.error("Unable to find provided port '%s' (AddBinding failed?)", name);
    },

    send: function (name, msg) {
        this.outputs[name].process(msg);
    },

    addInternalInputPort: function (port) {
        this.inputs[port.getName()] = port;
    },

    addInternalOutputPort: function (port) {
        this.outputs[port.getName()] = port;
    }
});