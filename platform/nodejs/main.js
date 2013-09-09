var Core  = require('../../core/Core');
var model = require('../../org.kevoree.model.js/target/js/org.kevoree.model.js.merged');

var kevoree = new Core();
var factory = new model.org.kevoree.impl.DefaultKevoreeFactory();

kevoree.start();
var myModel = factory.createContainerRoot();
kevoree.deploy(myModel, null, function (model) {
    console.log("deployed = " + (myModel == model));
});

