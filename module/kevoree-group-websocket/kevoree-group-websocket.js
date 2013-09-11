;(function () {
	var Class = require('./lib/Class');

    var WebSocketGroup = Class({
        toString: 'WebSocketGroup',
        start: function () {
            console.log("WebSocketGroup started");
        },

        stop: function () {
            console.log("WebSocketGroup stopped");
        },

        update: function () {
            console.log("WebSocketGroup updated");
        }
    });

	module.exports = WebSocketGroup;
})();