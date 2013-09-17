var AbstractGroup   = require('kevoree-entities').AbstractGroup,
    log             = require('npmlog'),
    WSClient        = require('ws'),
    WSServer        = require('ws').Server,

    TAG     = 'WebSocketGroup',
    PUSH    = 0,
    PULL    = 1;

/**
 * WebSocketGroup: Kevoree group that handles model transfers through WebSocket protocol
 *
 * @type {WebSocketGroup}
 */
var WebSocketGroup = AbstractGroup.extend({
    toString: TAG,

    construct: function () {
        log.heading = 'kevoree';

        this.server = null;
        this.client = null;
    },

    start: function (_super) {
        _super.call(this);

        if (this.dictionary.getValue('port') != undefined) {
            this.server = startWSServer(this.dictionary.getValue('port'));
        } else {
            log.warn(TAG, "There is no 'port' attribute defined: trying with default 8000");
            this.server = startWSServer(8000);
        }
    },

    stop: function (_super) {
        _super.call(this);

        if (this.server != null) {
            this.server.stop();
        }

        if (this.client != null) {
            this.client.stop();
        }
    },

    update: function (_super) {
        _super.call(this);

        this.stop();
        this.start();
    }
});

var startWSServer = function startWSServer(port) {
    // create a WebSocket server on specified port
    var server = new WSServer({port: port});
    log.info(TAG, "WebSocket server started: %s:%s", server.options.host, port);

    server.on('connection', function(ws) {
        ws.on('message', function(data, flag) {
            if (flag.binary == undefined) {
                // received data is a String
                log.info(TAG, "received %s", data);

            } else {
                // received data is binary
                log.info(TAG, "received binary data");
            }
        });
    });

    return server;
}

module.exports = WebSocketGroup;