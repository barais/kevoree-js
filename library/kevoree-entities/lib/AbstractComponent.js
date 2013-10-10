var KevoreeEntity   = require('./KevoreeEntity'),
    Port            = require('./Port');

/**
 * AbstractComponent entity
 *
 * @type {AbstractComponent} extends KevoreeEntity
 */
var AbstractComponent = KevoreeEntity.extend({
    toString: 'AbstractComponent',

    construct: function () {
        this.inputs = {};
    },

    addInternalInputPort: function (port) {
        this.inputs[port.getName()] = port;
        if (typeof(this[AbstractComponent.IN_PORT+port.getName()]) === 'undefined') {
            throw new Error("Unable to find provided port '"+AbstractComponent.IN_PORT+port.getName()+"' (Function defined in class?)");
        } else port.setCallback(this[AbstractComponent.IN_PORT+port.getName()]);
    },

    addInternalOutputPort: function (port) {
        this[AbstractComponent.OUT_PORT+port.getName()] = function (msg) {
            port.process.call(port, msg);
        };
    }
});

AbstractComponent.IN_PORT = 'in_';
AbstractComponent.OUT_PORT = 'out_';

module.exports = AbstractComponent;