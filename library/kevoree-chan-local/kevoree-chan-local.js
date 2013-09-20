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
    },

    onSend: function (remoteNodeName, msg) {
        // directly dispatching message locally
        this.remoteCallback(msg);
    }
});

module.exports = LocalChannel;