;(function () {
    var Class   = require('pseudoclass'),
        log     = require('npmlog');

    module.exports = Class({
        toString: 'KevoreeEntity',

        construct: function () {
            log.heading = 'kevoree';

            this.kCore = null;
            this.dictionary = null;
        },

        start: function () {
            log.info(this.toString(), "start");
        },

        stop: function () {
            log.info(this.toString(), "stop");
        },

        update: function () {
            log.info(this.toString(), "update");
        },

        setKevoreeCore: function (kCore) {
            this.kCore = kCore;
        },

        getKevoreeCore: function () {
            return this.kCore;
        },

        updateDictionary: function (dict) {
            this.dictionary = dict;
        }
    });
})();