;(function () {
	var Class   = require('pseudoclass'),
        Log     = require('log');

    var WebSocketGroup = Class({
        toString: 'WebSocketGroup',

        construct: function () {
            this.logger = new Log(this.toString());
        },

        start: function () {
            this.logger.debug("started");
        },

        stop: function () {
            this.logger.debug("stop");
        },

        update: function () {
            this.logger.debug("updated");
        },

        setKevoreeCore: function (core) {
            this.kCore = core;
        }
    });

	module.exports = WebSocketGroup;
})();