;(function () {
	var Class   = require('pseudoclass'),
        log     = require('npmlog'),

        TAG     = 'HelloWorldComponent';

    var HelloWorldComponent = Class({
        toString: TAG,

        construct: function () {
            log.heading = 'kevoree';
        },

        start: function () {
            log.info(TAG, "Hello World !");
        },

        stop: function () {
            log.info(TAG, "Bye bye world !");
        },

        update: function () {
            log.info(TAG, "Hello new updated World !");
        },

        setKevoreeCore: function (core) {
            this.kCore = core;
        }
    });

	module.exports = HelloWorldComponent;
})();