var assert = require("assert");
var JSNode = require('../kevoree-javascript-node');

describe('Kevoree Javascript Node', function () {
    var node = new JSNode();

    describe('#startNode()', function () {
        it('should print "Kevoree JavascriptNode started."', function () {
            node.startNode();
        });
    });
    describe('#updateNode()', function () {
        it('should print "Kevoree JavascriptNode updated."', function () {
            node.updateNode();
        });
    });
    describe('#stopNode()', function () {
        it('should print "Kevoree JavascriptNode stopped."', function () {
            node.stopNode();
        });
    });
});

