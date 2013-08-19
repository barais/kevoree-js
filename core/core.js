var Class = require('./lib/Class.min.js');

log = function(msg){
    console.log(msg);
}

err = function(msg){
    console.error(msg);
}

Core = Class({
    toString: 'Parent',
    construct: function() {
        log('Parent: Constructing');
    },
    destruct: function() {
        log('Parent: Destructing');
    },
    doStuff: function() {
        log('Parent: Doing stuff');
    }
});

exports.Core = Core;