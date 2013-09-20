var AbstractComponent   = require('kevoree-entities').AbstractComponent,
    log                 = require('npmlog'),

    TAG     = 'HelloWorldComponent';

var HelloWorldComponent = AbstractComponent.extend({
    toString: TAG,

    construct: function () {
        log.heading = 'kevoree';
        this.id = null;
    },

    start: function () {
        log.info(TAG, 'Hello world!');

        var self = this;
        this.id = setInterval(function () {
            self.send('sendText', "hello world "+(new Date));
        }, 2000);

        this.addInputPort("fake", function (msg) {
            log.info(TAG, "Message received: %s", msg);
        });
    },

    stop: function () {
        clearInterval(this.id);
        this.id = null;
    }
});

module.exports = HelloWorldComponent;