;(function () {
	function JavascriptNode() {
		this.startNode = function () {
			console.log("Kevoree JavascriptNode started.");
		}

		this.stopNode = function () {
			console.log("Kevoree JavascriptNode stopped.");
		}

		this.updateNode = function () {
			console.log("Kevoree JavascriptNode updated.");
		}
	};

	module.exports = JavascriptNode;
})();