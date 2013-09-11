;(function () {
	var Class = require('./lib/Class');

    var HelloWorldComponent = Class({
        toString: 'HelloWorldComponent',
        start: function () {
            console.log("Hello world!");
        },

        stop: function () {
            console.log("Bye bye world!");
        },

        update: function () {
            console.log("Hello new updated world!");
        }
    });

	module.exports = HelloWorldComponent;
})();