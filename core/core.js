var Class = require('./lib/Class.min.js');

log = function(msg){
    console.log(msg);
}

err = function(msg){
    console.error(msg);
}

Core = Class({
    toString: 'Kevoree Core',
    construct: function() {
        log('Kevoree Core: Constructing');
    },
    destruct: function() {
        log('Kevoree Core : Destructing');
    },
    deploy: function(model,uuid,callback) {
        log('Kevoree Core deploy model : starting');
        log(model);
    },
    lock: function(){

    },
    unlock: function(){

    }
});

exports.Core = Core;