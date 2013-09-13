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
        }
    });

	module.exports = WebSocketGroup;
})();