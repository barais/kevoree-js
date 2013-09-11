;(function () {
	var Class = require('./lib/Class');

    var JavascriptNode = Class({
        toString: 'JavascriptNode',
        startNode: function () {
            console.log("Kevoree JavascriptNode started.");
        },

        stopNode: function () {
            console.log("Kevoree JavascriptNode stopped.");
        },

        updateNode: function () {
            console.log("Kevoree JavascriptNode updated.");
        }
    });

	module.exports = JavascriptNode;
})();