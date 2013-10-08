var Class = require('pseudoclass');

/**
 * You are not supposed to create Port object (unless you are an AdaptationPrimitive)
 * @type {*}
 */
module.exports = Class({
    toString: 'Port',

    construct: function (name, path) {
        this.name       = name;
        this.path       = path;
        this.component  = null;
        this.channel    = null;
        this.callback   = null;
    },

    process: function (msg) {
        this.channel.internalSend(this.path, msg);
    },

    setCallback: function (callback) {
        this.callback = callback;
    },

    getCallback: function () {
        return this.callback;
    },

    getName: function () {
        return this.name;
    },

    setComponent: function (comp) {
        this.component = comp;
    },

    setChannel: function (chan) {
        this.channel = chan;
    }
});