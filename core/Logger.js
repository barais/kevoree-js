var Class = require('../lib/Class');

module.exports = Class({
    toString: 'Logger',
    construct: function (obj) {
        this.obj = obj;
    },
    log: function (message) {
        console.log(this.obj.toString()+': '+message);
    },
    error: function (message) {
        console.error(this.obj.toString()+': '+message);
    },
    warn: function (message) {
        console.warn(this.obj.toString()+': '+message);
    }
});