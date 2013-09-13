;(function () {
	var Class   = require('pseudoclass'),
        Log     = require('log');

    var HelloWorldComponent = Class({
        toString: 'HelloWorldComponent',

        construct: function () {
            this.logger = new Log(this.toString());
        },

        start: function () {
            this.logger.debug("Hello World !");
        },

        stop: function () {
            this.logger.debug("Bye bye world !");
        },

        update: function () {
            this.logger.debug("Hello new updated World !");
        }
    });

	module.exports = HelloWorldComponent;
})();