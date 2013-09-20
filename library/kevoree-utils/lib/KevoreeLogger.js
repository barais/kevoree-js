var Class = require('pseudoclass');

var KevoreeLogger = Class({
    toString: 'KevoreeLogger',

    construct: function (tag) {
        this.tag = tag;
    },

    info: function () {
        var template = '[INFO] %s: ' + (arguments[0] || '');
        var args = [template, this.tag];
        for (var i=1; i < arguments.length; i++) args.push(arguments[i]);
        console.log.apply(this, args);
    },

    warn: function (msg) {
        var template = '[WARN] %s: ' + (arguments[0] || '');
        var args = [template, this.tag];
        for (var i=1; i < arguments.length; i++) args.push(arguments[i]);
        console.log.apply(this, args);
    },

    error: function (msg) {
        var template = '[ERROR] %s: ' + (arguments[0] || '');
        var args = [template, this.tag];
        for (var i=1; i < arguments.length; i++) args.push(arguments[i]);
        console.log.apply(this, args);
    },

    debug: function (msg) {
        var template = '[DEBUG] %s: ' + (arguments[0] || '');
        var args = [template, this.tag];
        for (var i=1; i < arguments.length; i++) args.push(arguments[i]);
        console.log.apply(this, args);
    }
});

module.exports = KevoreeLogger;