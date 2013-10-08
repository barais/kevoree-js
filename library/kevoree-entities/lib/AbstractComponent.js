var KevoreeEntity   = require('./KevoreeEntity'),
    Port            = require('./Port');

var IN_PORT  = 'in_',
    OUT_PORT = 'out_';

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

    send: function (name, msg) {
        if (typeof (this.outputs[name]) === 'undefined') {
            console.error("Output port '"+name+"' does not exist. You should define a 'out_"+name+"' variable in your component in order for Kevoree to create it.");
        } else {
            this.outputs[name].process(msg);
        }
    },

    addInternalInputPort: function (port) {
        this.inputs[port.getName()] = port;
        if (typeof(this[IN_PORT+port.getName()]) === 'undefined') {
            throw new Error("Unable to find provided port '"+IN_PORT+port.getName()+"' (Function defined in class?)");
        } else port.setCallback(this[IN_PORT+port.getName()]);
    },

    addInternalOutputPort: function (port) {
        this.outputs[port.getName()] = port;
    }
});