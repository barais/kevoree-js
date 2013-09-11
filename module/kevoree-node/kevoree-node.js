;(function () {
	var Class               = require('./lib/Class'),
        AdaptationEngine    = require('./lib/AdaptationEngine');

    var JavascriptNode = Class({
        toString: 'JavascriptNode',

        construct: function () {
            this.adaptationEngine = new AdaptationEngine();
        },

        startNode: function () {
            console.log("Kevoree JavascriptNode started.");
        },

        stopNode: function () {
            console.log("Kevoree JavascriptNode stopped.");
        },

        updateNode: function () {
            console.log("Kevoree JavascriptNode updated.");
        },

        processTrace: function (trace) {
            return this.adaptationEngine.processTrace(trace);
        }
    });

	module.exports = JavascriptNode;
})();