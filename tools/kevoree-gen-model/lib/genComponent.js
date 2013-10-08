var AbstractComponent = require('kevoree-entities').AbstractComponent;

/**
 * Generates component
 *
 * @param obj
 * @param callback
 */
module.exports = function (obj, model, callback) {
    for (var prop in obj) {
        if (prop.startsWith(AbstractComponent.IN_PORT)) {
            addInputPort(prop.replace(AbstractComponent.IN_PORT,  ''));

        } else if (prop.startsWith(AbstractComponent.OUT_PORT)) {
            addOutputPort(prop.replace(AbstractComponent.OUT_PORT,  ''));
        }

    }
}

var addInputPort = function addInputPort(name) {
    console.log("\tNew input port '%s' added to model", name);
}

var addOutputPort = function addOutputPort(name) {
    console.log("\tNew output port '%s' added to model", name);
}

// String.startsWith(str)
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function startsWith(str) {
        return this.slice(0, str.length) == str;
    };
}