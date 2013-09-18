var AbstractChannel = require('kevoree-entities').AbstractChannel,
    log             = require('npmlog'),

    TAG     = 'LocalChannel';

var LocalChannel = AbstractChannel.extend({
    toString: TAG,

    construct: function () {
        log.heading = 'kevoree';
    },

    start: function () {
        log.info(TAG, 'TODO channel');
    }
});

module.exports = LocalChannel;