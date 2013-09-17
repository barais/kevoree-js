var AbstractComponent   = require('kevoree-entities').AbstractComponent,
    log                 = require('npmlog'),

    TAG     = 'HelloWorldComponent';

var HelloWorldComponent = AbstractComponent.extend({
    toString: TAG,

    construct: function () {
        log.heading = 'kevoree';
    },

    start: function () {
        log.info(TAG, 'Hello world!');
    }
});

module.exports = HelloWorldComponent;