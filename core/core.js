var Class = require('../lib/Class.js'),
    modelLib = require('../org.kevoree.model.js/target/js/org.kevoree.model.js.merged.js');

log = function(msg) {
    console.log(msg);
}

err = function(msg){
    console.error(msg);
}

var factory = new modelLib.org.kevoree.impl.DefaultKevoreeFactory();

Core = Class({
    toString: 'Kevoree Core',
    construct: function() {
        log('Kevoree Core: Constructing');
        var currenModel = factory.createContainerRoot();
        console.log(currenModel);
    },
    destruct: function() {
        log('Kevoree Core : Destructing');
    },
    deploy: function(model,uuid,callback) {
        log('Kevoree Core deploy model : starting');
    },
    lock: function(){

    },
    unlock: function(){

    }
});

exports.Core = Core;