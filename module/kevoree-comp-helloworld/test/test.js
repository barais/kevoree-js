var assert = require("assert");
var JSComponent = require('../kevoree-comp-helloworld');

describe('Kevoree Javascript Component - Hello world', function () {
    var comp = new JSComponent();

    describe('#startNode()', function () {
        it('should print an HelloWorld', function () {
            comp.start();
        });
    });
    describe('#updateNode()', function () {
        it('should print an updated Hello world', function () {
            comp.update();
        });
    });
    describe('#stopNode()', function () {
        it('should print a bye bye world', function () {
            comp.stop();
        });
    });
});

