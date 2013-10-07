var Class = require('pseudoclass');

var KevoreeLogger = Class({
    toString: 'KevoreeLogger',

    construct: function (tag) {
        this.tag = tag;
    },

    info: function (msg) {
        console.log('[INFO] '+this.tag+': '+msg);
    },

    warn: function (msg) {
        console.warn('[WARN] '+this.tag+': '+msg);
    },

    error: function (msg) {
        console.error('[ERROR] '+this.tag+': '+msg);
    },

    debug: function (msg) {
        console.log('[DEBUG] '+this.tag+': '+msg);
    }
});

module.exports = KevoreeLogger;