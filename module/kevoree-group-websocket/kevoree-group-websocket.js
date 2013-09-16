;(function () {
	var Class   = require('pseudoclass'),
        log     = require('npmlog'),

        TAG     = 'WebSocketGroup';

    var WebSocketGroup = Class({
        toString: TAG,

        construct: function () {
            log.heading = 'kevoree';
        },

        start: function () {
            log.info(TAG, 'started');
        },

        stop: function () {
            log.info(TAG, 'stopped');
        },

        update: function () {
            log.info(TAG, 'updated');
        },

        setKevoreeCore: function (core) {
            this.kCore = core;
        }
    });

	module.exports = WebSocketGroup;
})();