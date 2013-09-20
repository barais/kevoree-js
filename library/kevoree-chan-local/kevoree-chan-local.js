var AbstractChannel = require('kevoree-entities').AbstractChannel,
    KevoreeLogger   = require('kevoree-utils').KevoreeLogger;

var LocalChannel = AbstractChannel.extend({
    toString: 'LocalChannel',

    construct: function () {
        this.log = new KevoreeLogger(this.toString());
    },

    start: function () {
        this.log.info('Local channel started');
    },

    onSend: function (remoteNodeName, msg) {
        // directly dispatching message locally
        this.remoteCallback(msg);
    }
});

module.exports = LocalChannel;